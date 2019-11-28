<template>
  <div class="page-container">
	<!--工具栏-->
	<div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;">
		<el-form :inline="true" :model="filters" :size="size">
			<el-form-item>
				<el-input v-model="filters.label" placeholder="名称"></el-input>
			</el-form-item>
			<el-form-item>
				<kt-button icon="fa fa-search" :label="$t('action.search')" perms="news:consultation:view" type="primary" @click="findPage(null)"/>
			</el-form-item>
			<el-form-item>
				<kt-button :label="$t('action.add')" perms="news:consultation:add" type="primary" @click="handleAdd" />
			</el-form-item>
		</el-form>
	</div>
	<!-- 筛选列表 -->
	<filter-tool :columns="columns" @setColumns="setColumns" @findPage="findPage(null)"></filter-tool>
	<!--表格内容栏-->
	<kt-table permsEdit="news:consultation:edit" permsDelete="news:consultation:delete"
		:data="pageResult" :columns="filterColumns" 
		@findPage="findPage" @handleEdit="handleEdit" @handleDelete="handleDelete">
	</kt-table>
	<!--新增编辑界面-->
	<el-dialog :title="operation?'新增':'编辑'" width="40%" :visible.sync="editDialogVisible" :close-on-click-modal="false">
		<el-form :model="dataForm" label-width="80px" :rules="dataFormRules" ref="dataForm" :size="size">
			<el-form-item label="" prop="id"  v-if="true">
				<el-input v-model="dataForm.id" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="用户id" prop="memberId"  v-if="false">
				<el-input v-model="dataForm.memberId" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="用户手机号" prop="memberPhone"  v-if="false">
				<el-input v-model="dataForm.memberPhone" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="联系方式" prop="contact"  v-if="false">
				<el-input v-model="dataForm.contact" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="内容" prop="content"  v-if="false">
				<el-input v-model="dataForm.content" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="创建时间" prop="createTime"  v-if="false">
				<el-input v-model="dataForm.createTime" auto-complete="off"></el-input>
			</el-form-item>
		</el-form>
		<div slot="footer" class="dialog-footer">
			<el-button :size="size" @click.native="editDialogVisible = false">{{$t('action.cancel')}}</el-button>
			<el-button :size="size" type="primary" @click.native="submitForm" :loading="editLoading">{{$t('action.submit')}}</el-button>
		</div>
	</el-dialog>
  </div>
</template>

<script>
import filterTool from "@/components/filterTool"
import KtTable from "@/views/Core/KtTable"
import KtButton from "@/views/Core/KtButton"
import { format } from "@/utils/datetime"
import { Message } from 'element-ui'
export default {
	components:{
			filterTool,
			KtTable,
			KtButton
	},
	data() {
		return {
			size: 'small',
			filters: {
				label: ''
			},
			columns: [],
			filterColumns: [],
			pageRequest: { pageNum: 1, pageSize: 10 },
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
				memberId: null,
				memberPhone: null,
				contact: null,
				content: null,
				createTime: null,
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
			this.$api.newsConsultation.findPage(this.pageRequest).then((res) => {
				this.pageResult = res.data
				if(data !== null){
					data.callback()
				}
			}).then(res => {
				//根据接口返回数据，进行处理
			}).catch(err =>{
				console.log(err)
				Message.error('请求超时, 请重试!')
			})
		},
		// 批量删除
		handleDelete: function (data) {
			this.$api.newsConsultation.batchDelete(data.params).then(res=>{
				if(res.code == 200){
					Message.success(res.msg == null?'操作成功':res.msg);
				}else{
					Message.error(res.msg == null? '操作失败' : res.msg);
				}
			})
		},
		// 显示新增界面
		handleAdd: function () {
			this.editDialogVisible = true
			this.operation = true
			this.dataForm = {
				id: null,
				memberId: null,
				memberPhone: null,
				contact: null,
				content: null,
				createTime: null,
			}
		},
		// 显示编辑界面
		handleEdit: function (params) {
			this.editDialogVisible = true
			this.operation = false
			this.dataForm = Object.assign({}, params.row)
		},
		// 编辑
		submitForm: function () {
			this.$refs.dataForm.validate((valid) => {
				if (valid) {
					this.$confirm('确认提交吗？', '提示', {}).then(() => {
						this.editLoading = true
						let params = Object.assign({}, this.dataForm)
						this.$api.newsConsultation.save(params).then((res) => {
							if(res.code == 200){
								Message.success(res.msg == null?'操作成功':res.msg);
							}else{
								Message.error(res.msg == null? '操作失败' : res.msg);
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
		initColumns: function () {
			this.columns = [
								{prop:"id", label:"", minWidth:100},
								{prop:"memberId", label:"用户id", minWidth:100},
								{prop:"memberPhone", label:"用户手机号", minWidth:100},
								{prop:"contact", label:"联系方式", minWidth:100},
								{prop:"content", label:"内容", minWidth:100},
								{prop:"createTime", label:"创建时间", minWidth:100},
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
		this.initColumns()
	}
}
</script>

<style scoped>

</style>