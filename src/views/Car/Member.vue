<template>
    <div class="container">
        <!--工具栏-->
        <div id="top">
            <el-form @submit.native.prevent :inline="true" :model="findPageData.columnFilters" style="float:left;padding-top:10px;padding-left:15px;" size="mini">
                <el-form-item v-for="(i,index) in findPageData.columnFilters" :key="index">
                    <el-input v-model="i.value" :placeholder="i.name"></el-input>
                </el-form-item>
                <el-form-item>
                    <kt-button icon="fa fa-search" :label="$t('action.search')" perms="member:info:view" type="primary" @click="findPage(null, 1)"/>
                </el-form-item>
            </el-form>
            <filter-tool :showexcel="false" :columns="columns" @setColumns="setColumns" @findPage="findPage(null)"></filter-tool>
        </div>
        <div id="main">
            <div id="tab">
                <!-- 内容区域 -->
                <el-table id="tab2" :element-loading-text="$t('action.loading')"  v-loading="fansloading"
                :data="fansData" height="598">
                    <el-table-column v-for="i in filterColumns" :key="i.id" align="center" :show-overflow-tooltip="i.showOverflowTooltip"
                    :prop="i.prop" :label="i.label" :min-width="i.minWidth" :width="i.width">
                    <template slot-scope="scope">
                        <span>{{scope.row[i.prop] || '-'}}</span>
                    </template>
                    </el-table-column>
                    <el-table-column
                        fixed="right" header-align="center" align="center" width="180" :label="$t('action.operation')">
                        <template slot-scope="scope">
                            <kt-button icon="fa fa-edit" label="查看" perms="member:info:view" :loading="viewLoading" @click="handleEdit(scope.row)"/>
                            <kt-button v-if="scope.row.enable" icon="fa fa-close" label="禁用" perms="wx:temp:delete" type="danger" @click="handleDelete(scope.row)"/>
                            <kt-button v-else icon="fa fa-check" label="解除" perms="wx:temp:delete" type="success" @click="handleDelete(scope.row)"/>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div id="fenye">
                <!-- 下边分页器 -->
                <el-pagination
                    layout="prev, pager, next" @current-change="currentChange" :page-size="pageSize.pageSize"
                    :total="pageSize.totalSize">
                </el-pagination>
            </div>
        </div>
		<!--查看界面-->
		<el-dialog :title="operation" :modal="false" :visible.sync="dialogVisible" :close-on-click-modal="false">
			<div style="height: 540px;overflow-y: auto">
				<member-view :userData="userData"></member-view>
			</div>
			<div slot="footer" class="dialog-footer">
				<el-button size="small" type="primary" @click.native="dialogVisible = false">关闭</el-button>
			</div>
		</el-dialog>
    </div>
</template>
<script>
import axios from 'axios'
import KtButton from "@/views/Core/KtButton"
import { hasPermission } from '@/permission/index.js'
import KtTable from "@/views/Core/KtTable"
import { Message } from 'element-ui'
import { format } from "@/utils/datetime"
import filterTool from "@/components/filterTool"
import memberView from "../Core/MemberView"
export default {
	components:{
        KtButton,
        KtTable,
		filterTool,
		memberView
	},
	data() {
		return {
            loading: false,
            fansloading:false,
            fansData:[],
            filterColumns:[],
            columns:[],
            pageSize:{},
            findPageData:{
                columnFilters: {
                    phone: {
                        name: '手机号',
                        value: ''
                    },
                    nickName: {
                        name: '昵称',
                        value: ''
                    },
                    account: {
                        name: '账号',
                        value: ''
                    },
                    referralCode: {
                        name: '推荐码',
                        value: ''
                    }
                },
                pageNum: 1,
                pageSize: 30
            },
			cur: {},
			operation: '',
			dialogVisible: false,
            userData: {},
            viewLoading: false
        }
	},
	methods: {
        // 时间格式化
      	dateFormat: function (row, column, cellValue, index){
          	return format(row[column.property])
      	},
        // 查看用户详情
        handleEdit(a){
            this.viewLoading = true
            this.operation = '用户信息'
            console.log(a)
            axios.all([this.$api.member.findDrivingPermit(a.id),this.$api.member.findCarInfo(a.id)]).then(res=>{
                console.log(res)
                this.dialogVisible = true
                this.viewLoading = false
            })
        },
        // 获取页面数据
        findPage(data, find){
            data = data || this.findPageData
            console.log(data)
            !find || (data.pageNum = 1)
            this.fansloading = true
            this.$api.member.findPage(data).then(res=>{
				this.fansData = res.data.content
				this.pageSize = res.data
				this.fansloading = false
				this.findPageData = data
            })
        },
        //获取页数的数据
        currentChange(a){
            console.log(a)
            let data = {
                pageNum: a,
                pageSize: this.findPageData.pageSize
            }
            this.fansloading = true
            this.findPage(data)
        },
        // 初始化列表头
		initColumns: function () {
			this.columns = [
				{prop:"id", label:"ID", width:60, minWidth: 0},
				{prop:"phone", label:"手机号",width:110, minWidth:0},
				{prop:"account", label:"帐号", minWidth:250},
				{prop:"password", label:"密码", minWidth:150},
				{prop:"nickName", label:"昵称", minWidth:100},
                {prop:"referralCode", label:"推荐码", minWidth:150},
                {prop:"source", label:"注册来源", minWidth:130}
			]
			this.filterColumns = JSON.parse(JSON.stringify(this.columns));
      	},
        // 过滤列
		setColumns(data){
			this.filterColumns = data;
        },
	},
	mounted() {
		this.findPage()
        this.initColumns()
    }
}
</script>
<style scoped lang="scss">
#main{
    display: flex;
    padding-bottom: 80px;
    position: relative;
}
#top{
    overflow: hidden;
}
#tab{
	width: 100%
}
.touxiang {
    display: block;
    margin: auto
}
.el-table::before{
    display: none
}
#fenye{
    position: absolute;
    bottom:0;
    left: 0;
    right: 0;
    margin: auto;
}
</style>
<style scoped>
#tab1 >>> .el-table__header-wrapper{
    display: none;
}
>>> #filterTool{
    float: right;
}
</style>