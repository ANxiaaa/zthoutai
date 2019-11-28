<template>
  <div class="page-container">
	<!--  工具栏  -->
	<div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;">
		<el-form @submit.native.prevent :inline="true" :model="columnFilters" :size="size">
			<el-form-item>
				<el-input v-model="columnFilters.address.value" placeholder="地址"></el-input>
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
				address: {
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
			this.$api.parking.findPage(this.pageRequest).then((res) => {
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
				{prop:"province", label:"省", minWidth:100},
				{prop:"city", label:"城市", minWidth:100},
				{prop:"address", label:"地址", minWidth:250},
				{prop:"area", label:"区域", minWidth:100},
				{prop:"price", label:"价格", minWidth:100},
				{prop:"priceunit", label:"价格单位", minWidth:100},
				{prop:"type", label:"类型", minWidth:100},
				{prop:"updatetime", label:"更新时间", minWidth:100},
				{prop:"bookprice", label:"账面价格", minWidth:100},
			]
			this.filterColumns = JSON.parse(JSON.stringify(this.columns));
			this.filterColumns.forEach(a=>{
				if(a.prop === 'updatetime'){
					a.formatter = this.dateFormat
				}
			})
		},
		setColumns(data){
			this.filterColumns = data;
			this.filterColumns.forEach((a,b)=>{
				if(a.prop === 'updatetime'){
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