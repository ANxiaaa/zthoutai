<template>
  <div class="page-container">
	<!--工具栏-->
	<div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;">
		<el-form @submit.native.prevent :inline="true" :model="filters" :size="size">
			<el-form-item>
				<el-input v-model="filters.name" placeholder="角色名"></el-input>
			</el-form-item>
			<el-form-item>
				<kt-button icon="fa fa-search" :label="$t('action.search')" perms="sys:role:view" type="primary" @click="findPage(null)"/>
			</el-form-item>
			<el-form-item>
				<kt-button icon="fa fa-plus" :label="$t('action.add')" perms="sys:role:add" type="primary" @click="handleAdd" />
			</el-form-item>
		</el-form>
	</div>
	<filter-tool :columns="columns" @setColumns="setColumns" @findPage="findPage(null)"></filter-tool>
	<!--表格内容栏-->
	<kt-table permsEdit="sys:role:edit" permsDelete="sys:role:delete" :highlightCurrentRow="true" :stripe="false"
		:data="pageResult" :columns="filterColumns" :showBatchDelete="false" :width="250" @handleCurrentChange="handleRoleSelectChange"
		@findPage="findPage" @handleEdit="handleEdit" @handleDelete="handleDelete">
		<kt-button slot="ktbtna" slot-scope="scope" :label="'权限'" type="primary" perms="sys:role:view"
		@click="showPower" :key="scope.row"
		></kt-button>
	</kt-table>
	<!--新增编辑界面-->
	<el-dialog :title="operation?'新增':'编辑'" width="40%" :visible.sync="dialogVisible" :close-on-click-modal="false">
		<el-form :model="dataForm" label-width="80px" :rules="dataFormRules"  ref="dataForm" :size="size">
			<el-form-item label="ID" prop="id" v-if="false">
				<el-input v-model="dataForm.id" :disabled="true" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="角色名" prop="name">
				<el-input v-model="dataForm.name" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="备注 " prop="remark">
				<el-input v-model="dataForm.remark" auto-complete="off" type="textarea"></el-input>
			</el-form-item>
		</el-form>
		<div slot="footer" class="dialog-footer">
			<el-button :size="size" @click.native="dialogVisible = false">{{$t('action.cancel')}}</el-button>
			<el-button :size="size" type="primary" @click.native="submitForm" :loading="editLoading">{{$t('action.submit')}}</el-button>
		</div>
	</el-dialog>
	<!-- 设置权限 -->
	<div class="power">
		<el-dialog
		:title="selectRole.name + '  ' + selectRole.remark"
		:visible.sync="setPower" :close-on-click-modal="false"
		width="60%" height="auto"
		:before-close="closePower">
		<!--角色菜单，表格树内容栏-->
		<div class="menu-container" :v-if="true">
			<div class="menu-header">
				<span><B>角色菜单授权</B></span>
			</div>
			<el-tree :data="menuData" size="mini"
			show-checkbox
				node-key="id"
				:props="defaultProps"
				style="width: 100%;pading-top:20px;" ref="menuTree" :render-content="renderContent"
				v-loading="menuLoading" element-loading-text="拼命加载中" :check-strictly="false"
				@check="clickDeal">
			</el-tree>
			<div style="float:left;padding-left:24px;padding-top:12px;padding-bottom:4px;">
				<el-checkbox v-model="checkAll" @change="handleCheckAll" :disabled="this.selectRole.id == null"><b>全选</b></el-checkbox>
			</div>
			<div style="float:right;padding-right:15px;padding-top:4px;padding-bottom:4px;">
				<kt-button :label="$t('action.reset')" perms="sys:role:edit" type="primary" @click="resetSelection"
					:disabled="this.selectRole.id == null"/>
				<kt-button :label="('取消')" perms="sys:role:edit" type="primary" @click="closePower"
					:disabled="this.selectRole.id == null"/>
				<kt-button :label="$t('action.submit')" perms="sys:role:edit" type="primary" @click="submitAuthForm"
					:disabled="this.selectRole.id == null" :loading="authLoading"/>
			</div>
		</div>
		</el-dialog>
	</div>
  </div>
</template>
<script>
import filterTool from "@/components/filterTool"
import KtTable from "@/views/Core/KtTable"
import KtButton from "@/views/Core/KtButton"
import TableTreeColumn from '@/views/Core/TableTreeColumn'
import { format } from "@/utils/datetime"
export default {
	components:{
		KtTable,
		KtButton,
		TableTreeColumn,
		filterTool
	},
	data() {
		return {
			setPower:false,
			size: 'small',
			a:'scope',
			filters: {
				name: ''
			},
			columns: [],
			filterColumns: [],
			pageRequest: { pageNum: 1, pageSize: 10 },
			pageResult: {},

			operation: false, // true:新增, false:编辑
			dialogVisible: false, // 新增编辑界面是否显示
			editLoading: false,
			dataFormRules: {
				name: [
					{ required: true, message: '请输入角色名', trigger: 'blur' }
				]
			},
			// 新增编辑界面数据
			dataForm: {
				id: 0,
				name: '',
				remark: ''
			},
			selectRole: {},
			menuData: [],
			menuSelections: [],
			menuLoading: false,
			authLoading: false,
			checkAll: false,
			currentRoleMenus: [],
			defaultProps: {
				children: 'children',
				label: 'name'
			}
		}
	},
	methods: {
		// 获取分页数据
		findPage: function (data) {
			if(data !== null) {
				this.pageRequest = data.pageRequest
			}
			this.pageRequest.columnFilters = {name: {name:'name', value:this.filters.name}}
			this.$api.role.findPage(this.pageRequest).then((res) => {
				this.pageResult = res.data
				this.findTreeData()
			}).then(data!=null?data.callback:'')
		},
		// 批量删除
		handleDelete: function (data) {
			this.$api.role.batchDelete(data.params).then(data.callback)
		},
		// 显示新增界面
		handleAdd: function () {
			this.dialogVisible = true
			this.operation = true
			this.dataForm = {
				id: 0,
				name: '',
				remark: ''
			}
		},
		// 显示编辑界面
		handleEdit: function (params) {
			this.dialogVisible = true
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
						this.$api.role.save(params).then((res) => {
							this.editLoading = false
							if(res.code == 200) {
								this.$message({ message: '操作成功', type: 'success' })
								this.dialogVisible = false
								this.$refs['dataForm'].resetFields()
							} else {
								this.$message({message: '操作失败, ' + res.msg, type: 'error'})
							}
							this.findPage(null)
						})
					})
				}
			})
		},
		// 获取数据
		findTreeData: function () {
			this.menuLoading = true
			this.$api.menu.findMenuTree().then((res) => {
				this.menuData = res.data
				this.menuLoading = false
			})
		},
		// 角色选择改变监听
		handleRoleSelectChange(val) {
			if(val == null || val.val == null) {
				return
			}else if(val.val == 'set'){
				this.selectRole.id = val.id;
			}else if(val.val !== 'set'){
				this.selectRole = val.val;
			}
			setTimeout(()=>{
				this.$api.role.findRoleMenus({'roleId':this.selectRole.id}).then((res) => {
					let a = res.data.filter(i=>{
						return i.selection === 1
					})
					this.currentRoleMenus = a;
					this.$refs.menuTree.setCheckedNodes(a)
				}).catch(err=>{
					console.log(err)
				})
			},10)
		},
		// 树节点选择监听
		handleMenuCheckChange(data, check, subCheck) {
			if(check) {
				// 节点选中时同步选中父节点
				let parentId = data.parentId
				this.$refs.menuTree.setChecked(parentId, true)
			} else {
				// 节点取消选中时同步取消选中子节点
				if(data.children != null) {
					data.children.forEach(element => {
						this.$refs.menuTree.setChecked(element.id, false, false)
					});
				}
			}
		},
		clickDeal(currentObj, treeStatus){
			this.clickCheck(currentObj, treeStatus,this.$refs.menuTree)
			console.log(currentObj, treeStatus)
		},
		clickCheck(currentObj, treeStatus, ref) {
			let selected = treeStatus.checkedKeys.indexOf(currentObj.id);
			if (selected !== -1) {
				this.selectedParent(currentObj, ref);
				this.uniteChildSame(currentObj, true, ref);
			} else {
				if (currentObj.parentId == -1) {
					this.removeParent(currentObj, ref);
				}
				if (currentObj.children.length !== 0) {
					this.uniteChildSame(currentObj, false, ref);
				}
			}
		},
		uniteChildSame(treeList, isSelected, ref) {
			let treeListData = treeList.children;
			let len = treeListData.length;
			ref.setChecked(treeList.id, isSelected);
			for (let i = 0; i < len; i++) {
				this.uniteChildSame(treeListData[i], isSelected, ref);
			}
		},
		selectedParent(currentObj, ref) {
			let currentNode = ref.getNode(currentObj);
			if (currentNode.parent.key !== undefined) {
				ref.setChecked(currentNode.parent, true);
				return this.selectedParent(currentNode.parent, ref);
			}
		},
		removeParent(currentObj, ref) {
			let a = 0;
			let b = 0;
			let currentNode = ref.getNode(currentObj);
			if (currentNode.parent !== null) {
				if (currentNode.parent.key !== undefined) {
					ref.setChecked(currentNode.parent, true);
					this.removeParent(currentNode.parent, ref);
				}
			}
			if (currentNode.childNodes.length !== 0) {
				for (let i = 0; i < currentNode.childNodes.length; i++) {
					if (currentNode.childNodes[i].checked === false) {
						++a;
						if (a === currentNode.childNodes.length) {
							if (currentNode.childNodes[i].parent.key !== undefined) {
								ref.setChecked(currentNode.childNodes[i].parent, false);
								for (let i = 0; i < currentNode.parent.childNodes.length; i++) {
									if (currentNode.parent.childNodes[i].checked === false) {
										++b;
										if (b === currentNode.parent.childNodes.length) {
											ref.setChecked(currentNode.parent.key, false);
											return this.removeParent(currentNode.parent, ref);
										}
									}
								}
							}
						}
					}
				}
			}
		},
		// 重置选择
		resetSelection() {
			this.checkAll = false
			this.$refs.menuTree.setCheckedNodes(this.currentRoleMenus)
		},
		// 全选操作
		handleCheckAll() {
			if(this.checkAll) {
				let allMenus = []
				this.checkAllMenu(this.menuData, allMenus)
				this.$refs.menuTree.setCheckedNodes(allMenus)
			} else {
				this.$refs.menuTree.setCheckedNodes([])
			}
		},
		// 递归全选
		checkAllMenu(menuData, allMenus) {
			console.log(menuData, allMenus)
			menuData.forEach(menu => {
				allMenus.push(menu)
				if(menu.children) {
					this.checkAllMenu(menu.children, allMenus)
				}
			});
		},
		// 角色菜单授权提交
		submitAuthForm() {
			let roleId = this.selectRole.id
			if('admin' == this.selectRole.name) {
				this.$message({message: '超级管理员拥有所有菜单权限，不允许修改！', type: 'error'})
				return
			}
			this.$confirm('确认保存吗？', '提示', {}).then(() => {
				this.authLoading = true
				let checkedNodes = this.$refs.menuTree.getCheckedKeys()
				let halfCheckedKeys = this.$refs.menuTree.getHalfCheckedKeys()
				console.log('全选:', checkedNodes)
				console.log('半选:', halfCheckedKeys)
				let roleMenus = []
				checkedNodes.forEach((i)=>{
					roleMenus.push({roleId, menuId: i, selection: 1})
				})
				halfCheckedKeys.forEach((i)=>{
					roleMenus.push({roleId, menuId: i, selection: 0})
				})
				console.log('请求发送的参数', roleMenus)
				this.$api.role.saveRoleMenus(roleMenus).then((res) => {
					if(res.code == 200) {
						this.$message({ message: '操作成功', type: 'success' })
						this.closePower();
					} else {
						this.$message({message: '操作失败, ' + res.msg, type: 'error'})
					}
					this.authLoading = false
				})
			})
		},
		renderContent(h, { node, data, store }) {
			return (
			<div class="column-container">
				<span style="text-algin:center;margin-right:80px;">{data.name}</span>
				<span style="text-algin:center;margin-right:80px;">
					<el-tag type={data.type === 0?'':data.type === 1?'success':'info'} size="small">
						{data.type === 0?'目录':data.type === 1?'菜单':'按钮'}
					</el-tag>
				</span>
				<span style="text-algin:center;margin-right:80px;"> <i class={data.icon}></i></span>
				<span style="text-algin:center;margin-right:80px;">{data.parentName?data.parentName:'顶级菜单'}</span>
				<span style="text-algin:center;margin-right:80px;">{data.url?data.url:'\t'}</span>
			</div>);
		},
		handleCheckChange() {
			return this.$refs.menuTree.getCheckedNodes().concat(this.$refs.menuTree.getHalfCheckedNodes())
		},
		// 时间格式化
      	dateFormat: function (row, column, cellValue, index){
          	return format(row[column.property])
      	},
		showPower(){
			this.handleRoleSelectChange({
				val: 'set',
				id: this.selectRole.id
			})
			this.setPower = true;
		},
		closePower(){
			this.setPower = false;
		},
		initColumns: function () {
			this.columns = [
				{prop:"id", label:"ID", minWidth:50},
				{prop:"name", label:"角色名", minWidth:120},
				{prop:"remark", label:"备注", minWidth:120},
				{prop:"createBy", label:"创建人", minWidth:120},
				{prop:"createTime", label:"创建时间", minWidth:140}
			]
			this.filterColumns = JSON.parse(JSON.stringify(this.columns));
			this.filterColumns.forEach((a,b)=>{
				if(a.prop === 'createTime'){
					a.formatter = this.dateFormat
				}
			})
      	},
		setColumns(data){
			this.filterColumns = data;
			this.filterColumns.forEach((a,b)=>{
				if(a.prop === 'createTime'){
					a.formatter = this.dateFormat
				}
			})
		}
	},
	mounted(){
		this.initColumns()
	}
}
</script>
<style scoped>
.menu-container {
	margin-top: 10px;
}
.menu-header {
	padding-left: 8px;
	padding-bottom: 5px;
	text-align: left;
	font-size: 16px;
	color: rgb(20, 89, 121);
}
.power >>> .el-dialog__body{
	overflow: hidden
}
>>>.btnbox .cell {
	word-spacing: -3px;
}
</style>