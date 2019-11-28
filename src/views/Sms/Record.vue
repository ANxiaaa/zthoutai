<template>
    <div class="container">
        <!--工具栏-->
        <div id="top">
            <el-form @submit.native.prevent :inline="true" :model="findPageData.columnFilters" style="float:left;padding-top:10px;padding-left:15px;" size="small">
                <el-form-item v-for="(i,index) in findPageData.columnFilters" :key="index">
                    <el-input v-model="i.value" :placeholder="i.name"></el-input>
                </el-form-item>
                <el-form-item>
                    <kt-button icon="fa fa-search" :label="$t('action.search')" perms="member:info:view" type="primary" @click="findPage(null, 1)"/>
                    <kt-button label="查看配置" perms="sms:manager:view" type="primary" @click="tempEdit"/>
                </el-form-item>
            </el-form>
            <filter-tool :showexcel="false" :columns="columns" @setColumns="setColumns" @findPage="findPage(null)"></filter-tool>
        </div>
        <div id="main">
            <div id="tab">
                <!-- 内容区域 -->
                <el-table id="tab2" :element-loading-text="$t('action.loading')"  v-loading="fansloading"
                :data="fansData" height="598">
                    <el-table-column v-for="i in filterColumns" :key="i.id" align="center" :show-overflow-tooltip="i.showOverflowTooltip" :prop="i.prop" :label="i.label" :min-width="i.minWidth" :width="i.width">
                    <template slot-scope="scope">
                        <span v-if="i.prop === 'createDate'" v-text="dateFormat(scope.row,scope.column)"></span>
                        <span v-if="i.prop !== 'createDate'" :class="{temp_content:i.prop === 'temp_content'}">{{scope.row[i.prop] || '-'}}</span>
                    </template>
                    </el-table-column>
                    <el-table-column
                        fixed="right" header-align="center" align="center" width="110" :label="$t('action.operation')">
                        <template slot-scope="scope">
                            <kt-button icon="fa fa-edit" label="查看" perms="sms:send:record:view" :loading="viewLoading" @click="handleEdit(scope.row)"/>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div id="fenye">
                <!-- 下边分页器 -->
                <el-pagination
                    layout="prev, pager, next" :hide-on-single-page="total === 1" @current-change="currentChange" :page-size="pageSize.pageSize"
                    :total="pageSize.totalSize">
                </el-pagination>
            </div>
        </div>
		<!--查看界面-->
		<el-dialog :title="operation?'设置':'查看'" :modal="false" :visible.sync="dialogVisible" :close-on-click-modal="false">

			<div slot="footer" class="dialog-footer">
				<kt-button label="关闭" type="primary" @click.native="dialogVisible = false"/>
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
export default {
	components:{
        KtButton,
        KtTable,
		filterTool
	},
	data() {
		return {
            fansloading:false,
            fansData:[],
            filterColumns:[],
            columns:[],
            pageSize:{},
            findPageData:{
                columnFilters: {
                    tempCode: {
                        name: '模板ID',
                        value: ''
                    }
                },
                pageNum: 1,
                pageSize: 30
            },
            total: 0, // 隐藏显示分页器
			operation: false, //true 设置 false 查看
			dialogVisible: false,
            viewLoading: false,
            smsManager:{
                accesskeyid: "key",
                action: "请求方法",
                domain: "请求地址",
                id: 'ID',
                regionid: "地区编号",
                secret: "密码",
                signName: "姓名",
                version: "版本号"
            },
            manager:{
                "regionid": "地区编号",
                "domain": "请求地址",
                "version": "版本号",
                "action": "请求方法",
                "accesskeyid": "key",
                "secret": "密码",
                "signName": "签名"
            },
        }
	},
	methods: {
        // 时间格式化
      	dateFormat: function (row, column, cellValue, index){
            console.log(1111111)
          	return format(row[column.property])
      	},
        // 查看模板详情
        handleEdit(a){
            this.viewLoading = true
            this.operation = true
            console.log(a)
        },
        // 获取页面数据
        findPage(data, find){
            data = data || this.findPageData
            console.log(data)
            !find || (data.pageNum = 1)
            this.fansloading = true
            this.$api.sms.record(data).then(res=>{
                console.log(res)
                this.total = res.data.totalPages
				this.fansData = res.data.content
				this.fansloading = false
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
				{prop:"tempCode", label:"模板ID", width:160, minWidth: 0},
				{prop:"tempType", label:"模板类型", minWidth:0},
				{prop:"tempName", label:"模板名称", minWidth:160},
				{prop:"tempContent", label:"模板内容", minWidth:200},
				{prop:"variableAttr", label:"参数属性", minWidth:100},
                {prop:"createUser", label:"添加人", minWidth:130},
                {prop:"createDate", label:"创建时间", minWidth:150},
                {prop:"enable", label:"是否可用", minWidth:80}
			]
            this.filterColumns = JSON.parse(JSON.stringify(this.columns));
      	},
        // 过滤列
		setColumns(data){
			this.filterColumns = data;
        },
        // 管理模板
        tempEdit(){
            this.dialogVisible = true;
            if(!this.manageredit){
                this.manageredit = true
            }
            this.operation = true
            this.$api.sms.findSmsManager().then(res=>{
                this.managerData = res.data
                console.log(res)
            })
        },
        // 修改配置
        manEdit(){
            this.manageredit = false
        },
        // 保存配置
        saveman(){
            console.log(this.managerData)
            this.$confirm('确认保存吗？', '提示', {}).then(()=>{
                this.$api.sms.save(this.managerData).then(res=>{
                    if(res.code == 200) {
                        this.$message({ message: '操作成功', type: 'success' })
                        this.manageredit = true
                    } else {
                        this.$message({message: '操作失败, ' + res.msg, type: 'error'})
                    }
                })
            })
        },
        // 时间格式化
      	dateFormat: function (row, column, cellValue, index){
          	return format(row[column.property])
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
.temp_content{
    overflow: hidden;
    white-space: pre;
}
</style>