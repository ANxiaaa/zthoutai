<template>
  <div class="page-container">
	<!--  工具栏  -->
	<div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;">
		<el-form @submit.native.prevent :inline="true" :model="columnFilters" :size="size">
			<el-form-item>
				<el-input v-model="columnFilters.phone.value" placeholder="电话"></el-input>
			</el-form-item>
			<el-form-item>
				<kt-button :label="$t('action.search')" perms="sms:blacklist:view" type="primary" @click="findPage(null)"/>
			</el-form-item>
		</el-form>
	</div>
	<filter-tool :columns="columns" @setColumns="setColumns" @findPage="findPage(null)"></filter-tool>
	<!--  表格内容栏  -->
	<kt-table :data="pageResult" :columns="filterColumns" :showBatchDelete="false" @findPage="findPage" permsEdit="sms:blacklist:edit" permsDelete="sms:blacklist:delete" @handleEdit="handleEdit" @handleDelete="handleDelete">
	</kt-table>
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
			columnFilters: {
				phone: {
					value: ''
				}
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
			}
		}
	},
	methods: {
		// 获取分页数据
		findPage: function (data) {
			if(data !== null) {
				this.pageRequest = data.pageRequest
			}
			this.pageRequest.columnFilters = this.columnFilters
			this.$api.sms.blacklist(this.pageRequest).then((res) => {
				this.pageResult = res.data
			}).then(data!=null?data.callback:'')
		},
		// 时间格式化
      	dateFormat: function (row, column, cellValue, index){
          	return format(row[column.property])
      	},
		initColumns : function(){
			this.columns = [
				{prop:"id", label:"ID", minWidth:70},
				{prop:"ip", label:"IP", minWidth:70},
				{prop:"phone", label:"电话", minWidth:100},
				{prop:"reason", label:"理由", minWidth:100},
				{prop:"createUser", label:"创建用户", minWidth:100},
				{prop:"createDate", label:"创建时间", minWidth:120}
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
		},
		handleEdit(){},
		handleDelete(){},
	},
	mounted() {
		this.initColumns()
	}
}
</script>

<style scoped>

</style>