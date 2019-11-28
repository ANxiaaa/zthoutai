<template>
	<div class="page-container">
	<!--工具栏-->
	<div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;">
		<el-form @submit.native.prevent :inline="true" :model="filters" :size="size">
			<el-form-item>
				<el-input v-model="filters.label" placeholder="名称"></el-input>
			</el-form-item>
			<el-form-item>
				<kt-button icon="fa fa-search" :label="$t('action.search')" perms="sys:mail:view" type="primary" @click="findPage(null)"/>
			</el-form-item>
			<el-form-item>
				<kt-button icon="fa fa-plus" :label="$t('action.add')" perms="sys:mail:add" type="primary" @click="handleAdd" />
			</el-form-item>
		</el-form>
	</div>
	<filter-tool :columns="columns" @setColumns="setColumns" @findPage="findPage(null)"></filter-tool>
	<!--表格内容栏-->
	<kt-table permsEdit="sys:mail:edit" permsDelete="sys:mail:delete"
		:data="pageResult" :columns="filterColumns"
		@findPage="findPage" @handleEdit="handleEdit" @handleDelete="handleDelete">
	</kt-table>
	<!--新增编辑界面-->
	<el-dialog :title="operation?'新增':'编辑'" width="60%" :visible.sync="editDialogVisible" :close-on-click-modal="false" >
		<el-form :model="dataForm" label-width="80px" :rules="dataFormRules" ref="dataForm" :size="size">
			<el-form-item label="id" prop="id" v-if="false" >
				<el-input v-model="dataForm.id" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="发送机构" prop="deptName">
				<popup-tree-input
					:data="deptData"
					:props="deptTreeProps"
					:prop="dataForm.deptName"
					:nodeKey="''+dataForm.depId"
					:currentChangeHandle="deptTreeCurrentChangeHandle"
					:disabledValue="!operation">
				</popup-tree-input>
			</el-form-item>
			<el-form-item label="标题" prop="title"  >
				<el-input v-model="dataForm.title" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="内容" prop="content"  >
				<div class="edit_container">
					<quill-editor v-model="dataForm.content" class="editer" :options="editorOption"> </quill-editor>
				</div>
			</el-form-item>
		</el-form>
		<div slot="footer" class="dialog-footer">
			<el-button :size="size" @click.native="editDialogVisible = false">{{$t('action.cancel')}}</el-button>
			<el-button :size="size" type="primary" @click.native="submitForm" :loading="editLoading">{{$t('action.submit')}}</el-button>
		</div>
	</el-dialog>
	</div>
</template>
<style>
.quill-editor {
	height: 400px;
}
</style>
<script>
import filterTool from "@/components/filterTool"
import PopupTreeInput from "@/components/PopupTreeInput"
import TableColumnFilterDialog from "@/views/Core/TableColumnFilterDialog"
import KtTable from "@/views/Core/KtTable"
import KtButton from "@/views/Core/KtButton"
import { format } from "@/utils/datetime"
import { quillEditor } from 'vue-quill-editor' //调用编辑器
import { Message } from 'element-ui'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
export default {
	components:{
			PopupTreeInput,
			KtTable,
			KtButton,
			quillEditor,
			filterTool
	},
	data() {
		return {
			size: 'small',
			filters: {
				label: ''
			},
			editorOption: {
				//定义富文本展示内容
				modules:{
					toolbar:[
						[
						{ 'header': 1 }, { 'header': 2 },'bold', 'italic', 'underline', 'strike',{ 'script': 'sub'},
							{ 'script': 'super' },{ 'indent': '-1'}, { 'indent': '+1' },{ 'color': [] }, { 'background': [] },{ 'align': [] },
							{ 'size': ['small', false, 'large', 'huge'] }
						]
					]
				}
			},
			columns: [],
			filterColumns: [],
			pageRequest: { pageNum: 1, pageSize: 8 },
			pageResult: {},
			operation: false, // true:新增, false:编辑
			editDialogVisible: false, // 新增编辑界面是否显示
			editLoading: false,
			dataFormRules: {
				label: [
					{ required: true, message: '请输入名称', trigger: 'blur' }
				]
			},
			// 新增编辑界面数据
			dataForm: {
				id: null,
				title: null,
				content: '',
				deptName: null,
				depId: null
			},
			deptData: [],
			deptTreeProps: {
				label: 'name',
				children: 'children'
			}
		}
	},
	methods: {
		// 获取分页数据
		findPage: function (data) {
			if(data !== null) {
				this.pageRequest = data.pageRequest
			}
			this.pageRequest.columnFilters = {label: {name:'label', value:this.filters.label}}
			this.$api.sysMail.findPage(this.pageRequest).then((res) => {
				console.log(res)
				if(res.status === 200){
					this.pageResult = res.data.data
				}else if(res.code === 200){
					this.pageResult = res.data
				}
			}).then(data!=null?data.callback:'')
			.catch(err=>{
				console.log(err)
				Message.error('请求超时, 请重试!')
				data.callback()
			})
		},
		// 批量删除
		handleDelete: function (data) {
			this.$api.sysMail.batchDelete(data.params).then(data!=null?data.callback:'')
		},
		// 显示新增界面
		handleAdd: function () {
			this.editDialogVisible = true
			this.operation = true
			this.dataForm = {
				id: null,
				title: null,
				content: '',
				deptName: null,
				depId: null,
			};
		},
		// 显示编辑界面
		handleEdit: function (params) {
			this.editDialogVisible = true
			this.operation = false
			this.dataForm = Object.assign({}, params.row)
			this.dataForm.deptName = params.row.depName
		},
		// 编辑
		submitForm: function () {
			this.$refs.dataForm.validate((valid) => {
				if (valid) {
					this.$confirm('确认提交吗？', '提示', {}).then(() => {
						this.editLoading = true
						let params = Object.assign({}, this.dataForm)
						this.$api.sysMail.save(params).then((res) => {
							if(res.code == 200) {
								this.$message({ message: '操作成功', type: 'success' })
							} else {
								this.$message({message: '操作失败, ' + res.msg, type: 'error'})
							}
							this.editLoading = false
							this.$refs['dataForm'].resetFields()
							this.editDialogVisible = false
							this.findPage(null)
						})
					})
				}
			})
		},
		// 时间格式化
      	dateFormat: function (row, column, cellValue, index){
          	return format(row[column.property])
      	},
		// 获取部门列表
		findDeptTree: function () {
			this.$api.dept.findDeptTree().then((res) => {
				this.deptData = res.data
			})
		},
		// 菜单树选中
		deptTreeCurrentChangeHandle (data, node) {
			this.dataForm.depId = data.id
			this.dataForm.deptName = data.name
		},
      	initColumns: function () {
			this.columns = [
				{prop:"id", label:"id", width:60, minWidth: 0},
				{prop:"title", label:"标题", minWidth:100},
				// {prop:"content", label:"内容", minWidth:100},
				{prop:"createName", label:"创建人", minWidth:60},
				{prop:"createDate", label:"创建时间", minWidth:120},
				{prop:"depName", label:"部门机构", minWidth:100},
			]
			this.filterColumns = JSON.parse(JSON.stringify(this.columns));
			this.filterColumns.forEach(a=>{
				if(a.prop === 'createDate'){
					a.formatter = this.dateFormat
				}
			})
      	},
		setColumns(data){
			this.filterColumns = data;
			this.filterColumns.forEach((a,b)=>{
				if(a.prop === 'createDate'){
					a.formatter = this.dateFormat
				}
			})
		}
	},
	mounted() {
		this.findDeptTree()
		this.initColumns()
	}
}
</script>

<style scoped>

</style>