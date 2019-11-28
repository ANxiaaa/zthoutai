<template>
  <div class="container">
	<!--工具栏-->
	<div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;">
		<el-form :inline="true" :model="columnFilters" :size="size">
			<el-form-item>
				<el-input v-model="columnFilters.memberPhone.value" placeholder="手机号"></el-input>
			</el-form-item>
			<el-form-item>
				<el-input v-model="columnFilters.lsnum.value" placeholder="车牌后缀"></el-input>
			</el-form-item>
			<el-form-item>
				<el-col>
					<el-autocomplete class="inline-input" v-model="state1" value-key="province" :fetch-suggestions="querySearch" placeholder="请输入管局" @select="handleSelect"></el-autocomplete>
				</el-col>
			</el-form-item>
			<el-form-item>
				<kt-button :label="$t('action.search')" perms="illegal:record:view" type="primary" @click="findPage(null)"/>
			</el-form-item>
		</el-form>
	</div>
	<filter-tool :columns="columns" @setColumns="setColumns" @findPage="findPage(null)"></filter-tool>
	<!--表格内容栏-->
	<kt-table :showBatchDelete="false" @handleCurrentChange="handleCurrentChange" :data="pageResult" :columns="filterColumns" @findPage="findPage">
		<kt-button icon="el-icon-search" slot="ktbtna" slot-scope="scope" label="查看" :key="scope.row" perms="illegal:record:view" size="mini" type="primary" @click="info" />
	</kt-table>
	<!-- 显示页面 -->
	<el-dialog title="明细" width="40%" :visible.sync="editDialogVisible" :close-on-click-modal="false">
		<div class="weizhang">
			<div class="weizhangCar">
				<p><span>车牌号：</span>{{resultData.lsprefix}}{{resultData.lsnum}}</p>
				<p><span>管局名称：</span>{{resultData.carorg}}</p>
				<p><span>违章条数：</span>{{resultData.count}}</p>
				<p><span>违章金额：</span>{{resultData.totalprice}}</p>
				<p><span>违章扣分：</span>{{resultData.totalscore}}</p>
			</div>
			<el-collapse accordion @change="handleChange">
                <el-collapse-item v-for="(item, index) in resultData.list" :key="index" :title="'违章:'+item[Object.keys(item)[0]]" :name="index">
                    <p v-for="(info, index2) in infoData" :key="index2"><span>{{info.label}}：</span>{{item[info.prop] || '-'}}</p>
                </el-collapse-item>
            </el-collapse>
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
				},
				lsnum: {
					value: ''
				},
				carorg: {
					value: ''
				}
			},
			state1: '',
			columns: [],
			filterColumns: [],
			pageRequest: { pageNum: 1, pageSize: 10 },
			pageResult: {},
			operation: false, // true:新增, false:编辑
			editDialogVisible: false, // 新增编辑界面是否显示
			editLoading: false,
			rowData: {},
			resultData: {},
			illegalManagerList: [],
			infoData: [
				{prop:"time", label:"时间"},
				{prop:"address", label:"地点"},
				{prop:"content", label:"违章内容"},
				{prop:"legalnum", label:"违章代码"},
				{prop:"price", label:"罚款金额"},
				{prop:"score", label:"扣分"},
				{prop:"number", label:"违章编号"},
				{prop:"agency", label:"采集机关"},
				{prop:"province", label:"省"},
				{prop:"city", label:"市"},
				{prop:"town", label:"县"},
				{prop:"lat", label:"纬度 参考，有误差"},
				{prop:"lng", label:"经度 参考，有误差"}
			]
		}
	},
	methods: {
		// 获取分页数据
		findPage: function (data) {
			if(data !== null) {
				this.pageRequest = data.pageRequest
			}
			this.pageRequest.columnFilters = this.columnFilters
			this.$api.illegalRecord.findPage(this.pageRequest).then((res) => {
				this.pageResult = res.data
			}).then(data!=null?data.callback:'')
		},
		// 查看明细
		info: function () {
			let _this = this
			setTimeout(() => {
				let id = this.rowData.val.id
				this.$api.illegalRecord.findById(id)
				.then(res=>{
					_this.editDialogVisible = true;


					console.log(res.data)
					_this.resultData = res.data
				})
			}, 0);
		},
		handleCurrentChange(data){
			this.rowData = data
		},
		// 时间格式化
      	dateFormat: function (row, column, cellValue, index){
          	return format(row[column.property])
      	},
		initColumns : function(){
			this.columns = [
				{prop:"id", label:"ID", minWidth:100},
				{prop:"memberId", label:"查询用户ID", minWidth:100},
				{prop:"memberPhone", label:"手机号", minWidth:100},
				{prop:"queryTime", label:"查询时间", minWidth:100},
				{prop:"lsprefix", label:"车牌前缀", minWidth:100},
				{prop:"lsnum", label:"车牌后缀", minWidth:100},
				{prop:"carorg", label:"管局名称", minWidth:100},
				{prop:"usercarid", label:"车牌ID", minWidth:100},
				{prop:"count", label:"违章条数", minWidth:100},
				{prop:"totalprice", label:"违章总金额", minWidth:100},
				{prop:"totalscore", label:"违章总扣分", minWidth:100},
			]
			this.filterColumns = JSON.parse(JSON.stringify(this.columns));
		},
		setColumns(data){
			this.filterColumns = data;
		},
		querySearch(queryString, cb) {
			console.log(queryString)
			var restaurants = this.illegalManagerList;
			var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
			// 调用 callback 返回建议列表的数据
			cb(results);
		},
		createFilter(queryString) {
			return (restaurant) => {
				return (restaurant.province.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
			};
		},
		handleSelect(item) {
			console.log(item.carorg);
			let a = {
				value: item.carorg
			}
			console.log(a)
			this.$set(this.columnFilters, 'carorg', a)
		},
		findIllegalManager(){
			this.$api.illegalManagerBureau.findAll().then(res =>{
				this.illegalManagerList = res.data;
			})
		},
		handleChange(){
        },
        activeNames(){},
        change(){}
	},
	mounted() {
		this.initColumns()
		this.findIllegalManager()
	}
}
</script>

<style scoped lang="scss">
.weizhang{
	.weizhangCar{
		display: flex;
		flex-wrap: wrap;
		margin-bottom: 30px;
	}
	p{
		width: 50%;
		display: flex;
		text-align: left;
		line-height: 30px;
		font-size: 14px;
		span{
			width: 50%;
		}
	}
}
</style>
<style scoped>
>>> .el-collapse-item__content{
	display: flex;
	flex-wrap: wrap;
}
</style>