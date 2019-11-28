<template>
  <div class="page-container">
	<!--工具栏-->
	<div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;">
		<el-form :inline="true" :model="filters" :size="size">
			<el-form-item>
				<kt-button label="同步" perms="illegal:manager:bureau:syn" icon="iconfont icon-tongbu" type="primary" @click="syn()"/>
			</el-form-item>
		</el-form>
	</div>
	<filter-tool :columns="columns" @setColumns="setColumns" @findPage="findPage(null)"></filter-tool>
	<!--表格内容栏-->
	<kt-table permsEdit="illegal:manager:bureau:edit" permsDelete="illegal:manager:bureau:delete" :data="pageResult" :columns="filterColumns" :showBatchDelete="false" @findPage="findPage" @handleEdit="handleEdit" @handleDelete="handleDelete">
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
			this.$api.illegalManagerBureau.findPage(this.pageRequest).then((res) => {
				this.pageResult = res.data
			}).then(data!=null?data.callback:'')
		},
		// 同步
		syn: function () {
			this.$api.illegalManagerBureau.syn().then(res=>{
				if(res.code == 200){
					Message.success(res.msg == null ? '操作成功' : res.msg);
				}else{
					Message.error(res.msg == null ? '操作失败' : res.msg);
				}
			})
		},
		// 时间格式化
      	dateFormat: function (row, column, cellValue, index){
          	return format(row[column.property])
      	},
		initColumns : function(){
			this.columns = [
				{prop:"id", label:"ID", minWidth:100},
				{prop:"province", label:"省", minWidth:100},
				{prop:"carorg", label:"管局名称", minWidth:100},
				{prop:"lsprefix", label:"车牌前缀", minWidth:100},
				{prop:"lsnum", label:"车牌首字母", minWidth:100},
				{prop:"updatetime", label:"更新时间", minWidth:100},
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