<template>
  <div class="page-container">
	<!--工具栏-->
	<div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;">
		<el-form @submit.native.prevent :inline="true" :model="filters" :size="size">
			<el-form-item>
				<el-input v-model="filters.name" placeholder="用户名"></el-input>
			</el-form-item>
			<el-form-item>
				<kt-button icon="fa fa-search" :label="$t('action.search')" perms="sys:log:view" type="primary" @click="findPage(null)"/>
			</el-form-item>
		</el-form>
	</div>
	<filter-tool :columns="columns" @setColumns="setColumns" @findPage="findPage(null)"></filter-tool>
	<!--表格内容栏-->
	<kt-table :element-loading-text="$t('action.loading')"
    :data="pageResult" :columns="filterColumns" :showOperation="showOperation" @findPage="findPage">
	</kt-table>
  </div>
</template>

<script>
import filterTool from "@/components/filterTool"
import KtTable from "@/views/Core/KtTable"
import KtButton from "@/views/Core/KtButton"
import { format } from "@/utils/datetime"
export default {
	components: {
		KtTable,
		KtButton,
		filterTool
	},
	data() {
		return {
			size: 'small',
			filters: {
				name: ''
			},
			columns: [],
			filterColumns: [],
			pageRequest: { pageNum: 1, pageSize: 10 },
			pageResult: {},
			showOperation:false
		}
	},
	methods: {
		// 获取分页数据
		findPage: function (data) {
			if(data !== null) {
				this.pageRequest = data.pageRequest
			}
			this.pageRequest.columnFilters = {userName: {name:'userName', value:this.filters.name}}
			this.$api.log.findPage(this.pageRequest).then((res) => {
				this.pageResult = res.data
			}).then(data!=null?data.callback:'')
		},
		// 时间格式化
      	dateFormat: function (row, column, cellValue, index){
          	return format(row[column.property])
      	},
		initColumns: function () {
			this.columns = [
				{prop:"id", label:"ID", minWidth:60},
				{prop:"userName", label:"用户名", minWidth:100},
				{prop:"method", label:"方法", minWidth:180},
				{prop:"params", label:"参数", minWidth:220},
				{prop:"ip", label:"IP", minWidth:120},
				{prop:"time", label:"耗时", minWidth:80},
				{prop:"createBy", label:"创建人", minWidth:100},
				{prop:"createTime", label:"创建时间", minWidth:120, formatter:this.dateFormat}
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