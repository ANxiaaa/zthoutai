<template>
  <div class="page-container">
	<!--工具栏-->
	<div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;">
		<el-form :inline="true" :model="filters" :size="size">
			<el-form-item>
				<kt-button label="同步" perms="limit:row:city:syn" icon="iconfont icon-tongbu" type="primary" @click="syn()"/>
			</el-form-item>
		</el-form>
	</div>
	<filter-tool :columns="columns" @setColumns="setColumns" @findPage="findPage(null)"></filter-tool>
	<!--表格内容栏-->
	<kt-table :showBatchDelete="false" :data="pageResult" @handleCurrentChange="handleCurrentChange" :columns="filterColumns" @findPage="findPage" @handleEdit="handleEdit" @handleDelete="handleDelete">
		<kt-button slot="ktbtna" slot-scope="scope" label="查看限行" :key="scope.row" perms="limit:row:city:view" size="mini" type="primary" @click="bureauView" :loading="viewLoading"/>
	</kt-table>
	<!-- 显示页面 -->
	<el-dialog title="城市限行" width="40%" :visible.sync="editDialogVisible" :close-on-click-modal="false">
		<div class="areaData">
			<div class="areaList">
				<p>限行区域: <span>{{areaData.area}}</span></p>
				<p>限行时间: <span>{{areaData.date}} ({{areaData.week}}) {{areaData.time}}</span></p>
				<p>城市: <span>{{areaData.cityname}}</span></p>
				<p>限号: <span>{{areaData.number}}</span></p>
			</div>
			<h6>限号说明:{{areaData.numberrule}}</h6>
			<h6>简介:{{areaData.summary}}</h6>
		</div>
		<div slot="footer" class="dialog-footer">
			<el-button :size="size" @click.native="editDialogVisible = false">关闭</el-button>
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
import { getDate } from "@/utils/getDate"
import { formatWithSeperator } from "@/utils/date"
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
			viewLoading: false,
			dataFormRules: {
				label: [
					{ required: true, message: '请输入名称', trigger: 'blur' }
				]
			},
			rowData: {},
			areaData: {}
		}
	},
	methods: {
		// 获取分页数据
		findPage: function (data) {
			if(data !== null) {
				this.pageRequest = data.pageRequest
			}
			this.pageRequest.columnFilters = {label: {name:'label', value:this.filters.label}}
			this.$api.limitRowCity.findPage(this.pageRequest).then((res) => {
                console.log(res)
				this.pageResult = res.data
			}).then(data!=null?data.callback:'')
		},
		// 同步
		syn: function () {
			this.$api.limitRowCity.syn().then(res=>{
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
				{prop:"cityname", label:"城市名称", minWidth:100},
				{prop:"city", label:"城市代码", minWidth:100},
				{prop:"updateTime", label:"更新时间", minWidth:100}
			]
			this.filterColumns = JSON.parse(JSON.stringify(this.columns));
			this.filterColumns.forEach(a=>{
				if(a.prop === 'updateTime'){
					a.formatter = this.dateFormat
				}
			})
		},
		setColumns(data){
			this.filterColumns = data;
			this.filterColumns.forEach((a,b)=>{
				if(a.prop === 'updateTime'){
					a.formatter = this.dateFormat
				}
			})
		},
		handleCurrentChange(data){
			this.rowData = data
		},
		bureauView(){
			setTimeout(()=>{
				console.log(this.rowData.val)
				this.viewLoading = true
				let data = {
					city: this.rowData.val.city,
					date: getDate()
				}
				console.log(data)
				this.$api.limitRowCity.findByCityAndDate(data).then(res=>{
					res.data.date = formatWithSeperator(res.data.date, '-')
					this.areaData = res.data
					console.log(this.areaData)
					this.editDialogVisible = true
					this.viewLoading = false
				})

        	}, 0)
		},
		handleEdit(){},
		handleDelete(){}
	},
	mounted() {
		this.initColumns()
	}
}
</script>

<style scoped lang="scss">
.areaData{
	padding: 0 50px;
	.areaList{
		display: flex;
		flex-wrap: wrap;
		margin-bottom: 30px;
		p{
			width: 50%;
			display: flex;
			justify-content: space-between;
			line-height: 30px;
			text-align: left;
			font-size: 14px;
			span{
				width: 70%;
			}
		}
	}
	h6{
		text-align: left;
		line-height: 50px;
	}
}
</style>