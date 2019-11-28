<template>
  <div class="page-container">
	<!--  工具栏  -->
	<div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;">
		<el-form @submit.native.prevent :inline="true" :model="columnFilters" :size="size">
			<el-form-item>
				<el-input v-model="columnFilters.memberPhone.value" placeholder="用户电话"></el-input>
			</el-form-item>
			<el-form-item>
				<kt-button :label="$t('action.search')" perms="parking:record:view" type="primary" @click="findPage(null)"/>
			</el-form-item>
		</el-form>
	</div>
	<filter-tool :columns="columns" @setColumns="setColumns" @findPage="findPage(null)"></filter-tool>
	<!--  表格内容栏  -->
	<kt-table :data="pageResult" :columns="filterColumns" :showBatchDelete="false" @findPage="findPage" :showOperation="false" @handleEdit="handleEdit" @handleDelete="handleDelete">
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
				memberPhone: {
					value: ''
				}
			},
			columns: [],
			filterColumns: [],
			pageRequest: { pageNum: 1, pageSize: 10 },
			pageResult: {},
			operation: false, // true:新增, false:编辑
			editDialogVisible: false, // 新增编辑界面是否显示
			editLoading: false
		}
	},
	methods: {
		// 获取分页数据
		findPage: function (data) {
			if(data !== null) {
				this.pageRequest = data.pageRequest
			}
			this.pageRequest.columnFilters = this.columnFilters
			this.$api.parking.recordfindPage(this.pageRequest).then((res) => {
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
				{prop:"ip", label:"IP", minWidth:100},
				{prop:"lat", label:"纬度", minWidth:120},
				{prop:"lng", label:"经度", minWidth:120},
				{prop:"pid", label:"a", minWidth:120},
				{prop:"memberId", label:"查询用户ID", minWidth:100},
				{prop:"memberPhone", label:"查询用户电话", minWidth:100},
				{prop:"createTime", label:"查询时间", minWidth:100}
			]
			this.filterColumns = JSON.parse(JSON.stringify(this.columns));
			this.filterColumns.forEach(a=>{
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