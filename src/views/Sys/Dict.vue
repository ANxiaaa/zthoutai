<template>
  <div class="page-container">
	<el-row>
		<el-col :span="24">
			<!--工具栏-->
			<div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;">
				<el-form :inline="true" :model="filters" :size="size">
					<el-form-item>
						<kt-button icon="fa fa-plus" :label="$t('action.add')" perms="sys:dict:add" type="primary" @click="handleAdd" />
					</el-form-item>
				</el-form>
			</div>
		</el-col>
	</el-row>
	<el-row>
		<el-col :span="5" >
			<div style="border: 1px solid #ebebeb;">
				<el-tree :data="treeData" :props="defaultProps" ref="tree" @node-click="handleNodeClick"></el-tree>
			</div>
		</el-col>
		<el-col :span="19">
			<!--表格内容栏-->
			<kt-table permsEdit="sys:dict:edit" permsDelete="sys:dict:delete"
				:data="pageResult" :columns="columns" :border="true"
				@findPage="findPage" @handleEdit="handleEdit" :dict="dict" :findTree="findTree" @handleDelete="handleDelete">
			</kt-table>
		</el-col>
	</el-row>
	<!--新增编辑界面-->
	<el-dialog :title="operation?'新增':'编辑'" width="40%" :visible.sync="editDialogVisible" :close-on-click-modal="false">
		<el-form :model="dataForm" label-width="80px" :rules="dataFormRules" ref="dataForm" :size="size">
			<el-form-item label="ID" prop="id" ref="id"  v-if="false">
				<el-input v-model="dataForm.id" :disabled="true" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="parnetId" prop="parentId" ref="parentId" v-if="false">
				<el-input v-model="dataForm.parentId" :disabled="true" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="父级名称" prop="parentName">
				<el-input v-model="dataForm.parentName" :disabled="true" aoto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="名称" prop="label">
				<el-input v-model="dataForm.label" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="值" prop="value">
				<el-input v-model="dataForm.value" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="类型" prop="type">
				<el-input v-model="dataForm.type" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="排序" prop="sort">
				<el-input v-model="dataForm.sort" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="描述 " prop="description">
				<el-input v-model="dataForm.description" auto-complete="off" type="textarea"></el-input>
			</el-form-item>
			<el-form-item label="备注" prop="remarks">
				<el-input v-model="dataForm.remarks" auto-complete="off" type="textarea"></el-input>
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
import KtTable from "@/views/Core/KtTable"
import KtButton from "@/views/Core/KtButton"
import { format } from "@/utils/date"
export default {
	components:{
			KtTable,
			KtButton
	},
	data() {
		return {
			size: 'small',
			filters: {
				label: ''
			},
			dict:true,
			columns: [
				{prop:"id", label:"ID", minWidth:50},
				{prop:"label", label:"名称", minWidth:100},
				{prop:"value", label:"值", minWidth:100},
				{prop:"type", label:"类型", minWidth:80},
				{prop:"sort", label:"排序", minWidth:80},
				{prop:"description", label:"描述", minWidth:120},
				{prop:"remarks", label:"备注", minWidth:120},
				{prop:"createBy", label:"创建人", minWidth:100},
				{prop:"createTime", label:"创建时间", minWidth:120, formatter:this.dateFormat}
			],
			pageRequest: { pageNum: 1, pageSize: 10 },
			pageResult: {},
			treeData: [],
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
				id: 0,
				parentId: '',
				parentName: '',
				label: '',
				value: '',
				type: '',
				sort: 0,
				description: '',
				remarks: ''
			},
			defaultProps: {
				children: 'children',
				label: 'label',
				id: 'id'
			}
		}
	},
	methods: {
		findTree: function(){
			this.$api.dict.findTree().then((res) =>{
				this.treeData = res.data
			})
		},
		// 获取分页数据
		findPage: function (data) {
			if(data !== null) {
				this.pageRequest = data.pageRequest
			}
			var currentNode = this.$refs.tree.getCurrentNode();
				if(currentNode != null){
					this.pageRequest.columnFilters = {parentId: {name:'parentId', value:currentNode.id}}
				}
			this.$api.dict.findPage(this.pageRequest).then((res) => {
				this.pageResult = res.data
			}).then(data!=null?data.callback:'')
		},
		// 批量删除
		handleDelete: function (data) {
			this.$api.dict.batchDelete(data.params).then(data!=null?data.callback:'')
			this.findTree()
		},
		// 显示新增界面
		handleAdd: function () {
			this.editDialogVisible = true
			this.operation = true
			this.dataForm = {
				id: 0,
				parentId: this.$refs.tree.getCurrentNode().id,
				parentName: this.$refs.tree.getCurrentNode().label,
				label: '',
				value: '',
				type: '',
				sort: 0,
				description: '',
				remarks: ''
			}
		},
		// 显示编辑界面
		handleEdit: function (params) {
			this.editDialogVisible = true
			this.operation = false
			this.dataForm = Object.assign({}, params.row)
		},
		handleNodeClick(data) {
			this.findPage(null);
		},
		// 编辑
		submitForm: function () {
			this.$refs.dataForm.validate((valid) => {
				if (valid) {
					this.$confirm('确认提交吗？', '提示', {}).then(() => {
						this.editLoading = true
						let params = Object.assign({}, this.dataForm)
						this.$api.dict.save(params).then((res) => {
							if(res.code == 200) {
								this.$message({ message: '操作成功', type: 'success' })
							} else {
								this.$message({message: '操作失败, ' + res.msg, type: 'error'})
							}
							this.editLoading = false
							this.$refs['dataForm'].resetFields()
							this.editDialogVisible = false
							this.findPage(null)
							this.findTree();
							this.$refs.id='';
							this.$refs.parentId='';
						})
					})
				}
			})
		},
		// 时间格式化
      	dateFormat: function (row, column, cellValue, index){
          	return format(row[column.property])
      	}
	},
	mounted() {
		this.findTree();
	}
}
</script>

<style scoped>

</style>