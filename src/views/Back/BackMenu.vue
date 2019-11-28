<template>
  <div class="container">
	<!--工具栏-->
	<div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;">
		<el-form :inline="true" :model="filters" :size="size">
			<el-form-item>
				<kt-button :label="$t('action.add')" perms="back:menu:add" type="primary" @click="handleAdd" />
			</el-form-item>
		</el-form>
	</div>
	<filter-tool :columns="allColumns" @setColumns="setColumns" @findPage="findPage(null)"></filter-tool>
	<!--表格树内容栏-->
	<el-table :data="tableTreeDdata" stripe size="mini" style="width: 100%;" row-key="id"
      v-loading="loading" :element-loading-text="$t('action.loading')">
	  <el-table-column
	  v-for="(column, index) in filterColumns" :key="index" :prop="column.prop" header-align="center" :align="column.align || 'center'" :formatter="column.formatter" :treeKey="column.treeKey" :minWidth="column.minWidth" :label="column.label">
		<template slot-scope="scope">
			<i :class="scope.row.menuIcon ? scope.row.menuIcon + ' iconfont' :''" v-if="column.prop === 'menuIcon'"></i>
			<p :style="'height:20px;margin:auto;width:20px;background:'+scope.row.menuColor" v-if="column.prop === 'menuColor'"></p>
			<span v-if="column.prop === 'menuType'">{{showTypeData(scope.row[column.prop])}}</span>
			<span v-if="column.prop !== 'menuIcon' && column.prop !== 'menuColor' && column.prop !== 'menuType'">{{scope.row[column.prop]}}</span>
		</template>
	  </el-table-column>
	  <el-table-column
	  v-for="column in filterDateColumns" :key="column.prop" :prop="column.prop" header-align="center" align="center" :formatter="column.formatter" :minWidth="column.minWidth" :label="column.label"></el-table-column>
      <el-table-column
        fixed="right" header-align="center" align="center" width="185" :label="$t('action.operation')">
        <template slot-scope="scope">
          <kt-button icon="fa fa-edit" :label="$t('action.edit')" perms="back:menu:edit" @click="handleEdit(scope.row)"/>
          <kt-button icon="fa fa-trash" :label="$t('action.delete')" perms="back:menu:delete" type="danger" @click="handleDelete(scope.row)"/>
        </template>
      </el-table-column>
    </el-table>
	<!--新增编辑界面-->
	<el-dialog :title="operation?'新增':'编辑'" width="40%" :visible.sync="editDialogVisible" :close-on-click-modal="false">
		<el-form :model="dataForm" label-width="80px" :rules="dataFormRules" ref="dataForm" :size="size">
			<el-form-item label="父级" prop="parentId"  v-if="true">
				<popup-tree-input
					:data="popupTreeData" :props="popupTreeProps" :prop="dataForm.parentName==null?'顶级菜单':dataForm.parentName"
					:nodeKey="''+dataForm.parentId" :currentChangeHandle="handleTreeSelectChange">
				</popup-tree-input>
			</el-form-item>
			<el-form-item label="名称" prop="menuName"  v-if="true">
				<el-input v-model="dataForm.menuName" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="类型" prop="menuType"  v-if="true">
				<el-select v-model="dataForm.menuType" placeholder="请选择" style="width:100%;">
					<el-option
					v-for="item in menuTypeData"
					:key="item.value"
					:label="item.title"
					:value="item.name">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="图标" prop="menuIcon"  v-if="true">
				<icon-tool
				:iconName="dataForm.menuIcon + ' iconfont'"  @changeIcon="changeIcon"></icon-tool>
			</el-form-item>
			<el-form-item label="颜色" prop="menuColor"  v-if="true">
				<el-color-picker :popper-class="'colorBox'" v-model="dataForm.menuColor"></el-color-picker>
			</el-form-item>
			<el-form-item label="链接" prop="menuUrl"  v-if="true">
				<el-input v-model="dataForm.menuUrl" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="排序字段" prop="menuSn"  v-if="true">
				<el-input-number v-model="dataForm.menuSn" style="float: left" controls-position="right" :min="0" label="排序编号"></el-input-number>
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
import Cookies from "js-cookie"
import filterTool from "@/components/filterTool"
import KtTable from "@/views/Core/KtTable"
import KtButton from "@/views/Core/KtButton"
import TableTreeColumn from '@/views/Core/TableTreeColumn'
import PopupTreeInput from "@/components/PopupTreeInput"
import FaIconTooltip from "@/components/FaIconTooltip"
import IconTool from "@/components/iconTool"
import { format } from "@/utils/datetime"
import { mapState } from "vuex"
export default {
	components:{
		KtTable,
		KtButton,
		PopupTreeInput,
		TableTreeColumn,
		FaIconTooltip,
		filterTool,
		IconTool
	},
	data() {
		return {
			size: 'small',
			filters: {
				label: ''
			},
			loading: false,
			tableTreeDdata: [],
			columns: [],
			filterColumns: [],
			dateColumns:[],
			filterDateColumns:[],
			allColumns:[],
			pageRequest: { pageNum: 1, pageSize: 8 },
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
				parentId: null,
				parentName: null,
				menuName: null,
				menuType: null,
				menuIcon: null,
				menuColor: null,
				menuUrl: null,
				menuSn: null,
				delFlg: null,
			},
			popupTreeData: [],
			popupTreeProps: {
				label: 'menuName',
				children: 'children'
			},
			menuTypeData:[]
		}
	},
	methods: {
		// 批量删除
		handleDelete: function (data) {
			this.$confirm('确认删除选中记录吗？', '提示', {
				type: 'warning'
			}).then(() => {
				let param = Object.assign({}, data)
				let params = [param]
				console.log(params)
				this.$api.backMenu.batchDelete(params).then( res => {
					this.findTreeData()
					this.$message({message: '删除成功', type: 'success'})
				})
			})
		},
		getDeleteIds (ids, row) {
			ids.push({id:row.id})
			if(row.children != null) {
				for(let i=0, len=row.children.length; i<len; i++) {
					this.getDeleteIds(ids, row.children[i])
				}
			}
			return ids
		},
		// 显示新增界面
		handleAdd: function () {
			this.editDialogVisible = true
			this.operation = true
			this.dataForm = {
				id: null,
				parentId: null,
				menuName: null,
				menuType: null,
				menuIcon: null,
				menuColor: '#666666',
				menuUrl: null,
				menuSn: null,
				delFlg: null,
			}
		},
		// 显示编辑界面
		handleEdit: function (params) {
			this.editDialogVisible = true
			this.operation = false
			this.dataForm = Object.assign({}, params)
		},
		// 编辑
		submitForm: function () {
			this.$refs.dataForm.validate((valid) => {
				if (valid) {
					this.$confirm('确认提交吗？', '提示', {}).then(() => {
						this.editLoading = true;
						let params = Object.assign({}, this.dataForm)
						this.$api.backMenu.save(params).then((res) => {
							if(res.code == 200) {
								this.$message({ message: '操作成功', type: 'success' })
							} else {
								this.$message({message: '操作失败, ' + res.msg, type: 'error'})
							}
							this.editLoading = false
							this.$refs['dataForm'].resetFields()
							this.editDialogVisible = false
							this.findTreeData(null)
						})
					})
				}
			})
		},
		// 时间格式化
      	dateFormat: function (row, column, cellValue, index){
          	return format(row[column.property])
      	},
		load(tree, treeNode, resolve) {
			setTimeout(() => {
			resolve([{}])
			}, 1000)
		},
		handleTreeSelectChange (data, node) {
			this.dataForm.parentId = data.id
			this.dataForm.parentName = data.name
		},
		// 获取数据
		findTreeData: function () {
			this.loading = true
			this.$api.backMenu.findTree().then((res) => {
				console.log(res)
				this.tableTreeDdata = res.data
				this.popupTreeData = this.getParentMenuTree(res.data)
				this.loading = false
			})
		},
		// 获取上级机构树
		getParentMenuTree: function (tableTreeDdata) {
			let parent = {
				parentId: 0,
				menuName: '顶级菜单',
				children: tableTreeDdata
			}
			return [parent]
		},
		handleTreeSelectChange (data, node) {
			this.dataForm.parentId = data.id
			this.dataForm.parentName = data.menuName
		},
		changeIcon(icon){
			this.dataForm.menuIcon = icon
		},
		initColumns: function () {
			this.columns = [
				{prop:"menuName", label:"名称", minWidth:120, align: 'left', treeKey:'id'},
				{prop:"parentName", label:"父级", minWidth:80},
				{prop:"menuType", label:"类型", minWidth:100},
				{prop:"menuIcon", label:"图标", minWidth:100},
				{prop:"menuColor", label:"颜色", minWidth:100},
				{prop:"menuUrl", label:"连接", minWidth:100},
				{prop:"menuSn", label:"排序字段", minWidth:100},
			]
			this.filterColumns = JSON.parse(JSON.stringify(this.columns));

			this.dateColumns =[
				{prop:"createTime", label:"创建时间", minWidth:100},
				{prop:"lastUpdateTime", label:"更新时间", minWidth:100},
				{prop:"lastUpdateUser", label:"最后操作人", minWidth:120}
			]
			this.filterDateColumn = JSON.parse(JSON.stringify(this.dateColumns));
			this.allColumns = this.filterColumns.concat(this.filterDateColumn)
      	},
		setColumns(data){
			let newDateColumns = data.slice(-3)
			let newData = data.filter(i=>i.prop !== 'createTime' && i.prop !== 'lastUpdateTime' && i.prop !== 'lastUpdateUser')
			this.filterDateColumns = newDateColumns
			this.filterColumns = newData;
			this.filterDateColumns.forEach((a,b)=>{
				if(a.prop === 'createTime' || a.prop === 'lastUpdateTime'){
					a.formatter = this.dateFormat
				}
			})
		},
		// 获取分页数据
		findPage: function (data) {
			if(data !== null) {
				this.pageRequest = data.pageRequest
			}
			this.pageRequest.columnFilters = {label: {name:'label', value:this.filters.label}}
			this.$api.backMenu.findTree(this.pageRequest).then((res) => {
				this.pageResult = res.data
			}).then(data!=null?data.callback:'')
		},
		getType(){
			let token = Cookies.get('token')
			if(token){
				this.$api.backMenu.getType(token).then(res => {
					console.log(res)
					this.menuTypeData = res.data
				}).catch(err => {
					console.log(err)
				})
			}
		},
		showTypeData(data){
			let type = data || '';
			if (data) {
				let arr = [].concat.apply([],this.menuTypeData)
				for (let i = 0;i < arr.length; i++){
					if (arr[i].name == data){
						type = arr[i].title
					}
				}
			}
			return type
		}
	},
	mounted() {
		this.findTreeData()
		this.initColumns()
		this.getType()
	}
}
</script>

<style scoped>
>>>.el-color-picker{
	width:100%
}
>>>.el-color-picker .el-color-picker__trigger{
	width:100%
}
.box-card{
	height: 0;
}
</style>