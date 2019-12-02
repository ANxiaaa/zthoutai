<template>
    <div class="container">
        <!--工具栏-->
        <div id="top">
            <div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;">
                <el-form @submit.native.prevent :inline="true" :model="columnFilters" size="small">
                    <el-form-item>
                        <el-input v-model="columnFilters.name.value" placeholder="名称"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <kt-button icon="fa fa-search" :label="$t('action.search')" perms="car:special:info:view" type="primary" @click="findPage(null)"/>
                    </el-form-item>
                    <el-form-item>
                        <kt-button icon="fa fa-plus" :label="$t('action.add')" perms="car:special:info:add" type="primary" @click="handleAdd"/>
                    </el-form-item>
                </el-form>
            </div>
            <filter-tool :showexcel="false" :columns="columns" @setColumns="setColumns" @findPage="findPage(null)"></filter-tool>
        </div>
        <div id="main">
            <div id="tab">
                <el-table id="tab2" :element-loading-text="$t('action.loading')"  v-loading="fansloading"
                :data="fansData" height="598">
                    <el-table-column v-for="i in filterColumns" :key="i.id" align="center" :show-overflow-tooltip="i.showOverflowTooltip"
                    :prop="i.prop" :label="i.label" :min-width="i.minWidth" :width="i.width">
                    <template slot-scope="scope">
                        <img v-if="i.prop === 'img' && scope.row.img" :src="scope.row.img" style="width:200px;" class="touxiang" ondragstart="return false"/>
                        <span v-if="i.prop === 'createTime' || i.prop === 'lastEditTime' || i.prop === 'activityEndTime' || i.prop === 'activityStartTime' || i.prop === 'releaseTime'" v-text="dateFormat(scope.row,scope.column)"></span>
                        <span v-if="i.prop !== 'img' && i.prop !== 'createTime' && i.prop !== 'lastEditTime' && i.prop !== 'activityEndTime' && i.prop !== 'activityStartTime' && i.prop !== 'releaseTime'">{{scope.row[i.prop]}}</span>
                    </template>
                    </el-table-column>
                    <el-table-column
                        fixed="right" header-align="center" align="center" width="250" :label="$t('action.operation')">
                        <template slot-scope="scope">
                            <kt-button icon="fa fa-edit" label="查看" perms="car:special:info:view" @click="handleEdit(scope.row)"/>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div id="fenye">
                <!-- 下边分页器 -->
                <el-pagination layout="prev, pager, next" @current-change="currentChange" :page-size="pageSize.pageSize" :total="pageSize.totalSize"></el-pagination>
            </div>
        </div>
        <!-- 新增修改界面 -->
        <el-dialog :title="operation ? '新增' : '修改'" :model="false" :modal-append-to-body="false" :visible.sync="dialogVisible" :close-on-click-modal="false">
            <el-form :model="dataForm" ref="dataForm" @keyup.enter.native="submitForm()"
                label-width="80px" :size="size" style="text-align:left;">
                <el-form-item label="名称" prop="name">
                    <el-input v-model="dataForm.name" placeholder="名称"></el-input>
                </el-form-item>
                <el-form-item label="品牌" prop="brand">
                    <el-col :span="12">
                        <el-cascader filterable @change="oneChange" placeholder="品牌" :props="{label: 'name',value: 'id'}" :options="one"></el-cascader>
                    </el-col>
                    <el-col :span="12">
                        <el-cascader filterable placeholder="车型" :options="two"></el-cascader>
                    </el-col>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button :size="size"  @click="dialogVisible = false">{{$t('action.cancel')}}</el-button>
                <el-button :size="size"  type="primary" @click="submitForm()">{{$t('action.comfirm')}}</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import axios from 'axios'
import KtButton from "@/views/Core/KtButton"
import { hasPermission } from '@/permission/index.js'
import { Message } from 'element-ui'
import { format } from "@/utils/datetime"
import filterTool from "@/components/filterTool"
export default {
	components:{
        KtButton,
        filterTool
	},
	data() {
		return {
            size: 'small',
            columnFilters: {
				name: {
					value: ''
				}
			},
            tableData: [],
            fansloading:false,
            fansData:[],
            filterColumns:[],
            columns:[],
            pageSize:{},
            findPageData:{
                pageNum: 1,
                pageSize: 10
            },
            dataForm: {
                "activityEndTime": "",
                "activityStartTime": "",
                "brand": 0,
                "carInfo": 0,
                "createTime": "",
                "creator": "",
                "discount": 0,
                "enable": false,
                "fileBeans": [
                    {
                    "bytes": "",
                    "fileName": "",
                    "filePath": "",
                    "fileType": "",
                    "onePath": "",
                    "originalFileName": "",
                    "size": 0,
                    "twoPath": ""
                    }
                ],
                "id": 0,
                "img": "",
                "intro": "",
                "lastEditTime": "",
                "lastEditor": "",
                "name": "",
                "rejectReason": "",
                "releaseTime": "",
                "showCost": 0,
                "sn": 0,
                "specialAttrs": [
                    {
                        "desc": "",
                        "id": 0,
                        "infoId": 0,
                        "key": "",
                        "sn": 0,
                        "value": ""
                    }
                ],
                "specialDetail": {
                    "detail": "",
                    "infoId": 0
                },
                "specialImgs": [
                    {
                    "id": 0,
                    "img": "",
                    "infoId": 0,
                    "sn": 0
                    }
                ],
                "status": "",
                "store": 0,
                "tags": "",
                "twoBrand": 0,
                "vehicleType": 0
            },
            operation: false, // true 新增 false 修改
            dialogVisible: false,
            one: [],
            two: []
        }
	},
	methods: {
        // 添加
        handleAdd(){
            this.dataForm = {
                "activityEndTime": "",
                "activityStartTime": "",
                "brand": 0,
                "carInfo": 0,
                "createTime": "",
                "creator": "",
                "discount": 0,
                "enable": false,
                "fileBeans": [
                    {
                    "bytes": "",
                    "fileName": "",
                    "filePath": "",
                    "fileType": "",
                    "onePath": "",
                    "originalFileName": "",
                    "size": 0,
                    "twoPath": ""
                    }
                ],
                "id": 0,
                "img": "",
                "intro": "",
                "lastEditTime": "",
                "lastEditor": "",
                "name": "",
                "rejectReason": "",
                "releaseTime": "",
                "showCost": 0,
                "sn": 0,
                "specialAttrs": [
                    {
                        "desc": "",
                        "id": 0,
                        "infoId": 0,
                        "key": "",
                        "sn": 0,
                        "value": ""
                    }
                ],
                "specialDetail": {
                    "detail": "",
                    "infoId": 0
                },
                "specialImgs": [
                    {
                    "id": 0,
                    "img": "",
                    "infoId": 0,
                    "sn": 0
                    }
                ],
                "status": "",
                "store": 0,
                "tags": "",
                "twoBrand": 0,
                "vehicleType": 0
            }
            this.dialogVisible = true
            this.operation = true
        },
        // 时间格式化
      	dateFormat: function (row, column, cellValue, index){
            console.log(row[column.property])
          	return format(row[column.property])
      	},
        handleEdit(a){
            console.log(a)
        },
        // 获取页面数据
        findPage(data){
            data = data || this.findPageData
            this.fansloading = true
            this.$api.specialCar.findPage(data).then(res=>{
				console.log(res)
                this.fansloading = false
				this.fansData = res.data.content
			})
        },
        //获取页数的数据
        currentChange(a){
            console.log(a)
            let data = {
                parentID: this.findPageData.parentID,
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
				{prop:"name", label:"名称", minWidth:100},
				{prop:"brand", label:"品牌", minWidth:60},
				{prop:"twoBrand", label:"二级品牌", minWidth:60},
				{prop:"vehicleType", label:"车型", minWidth:100, width:100},
				{prop:"carInfo", label:"车辆信息", minWidth:140},
                {prop:"intro", label:"简介", minWidth:130},
                {prop:"img", label:"主图片", minWidth:250},
                {prop:"showCost", label:"车辆售价", minWidth:130},
                {prop:"discount", label:"优惠金额（指导价和销售价格差）", minWidth:180},
                {prop:"store", label:"库存", minWidth:70},
                {prop:"tags", label:"标签", minWidth:130},
                {prop:"status", label:"状态", minWidth:130},
                {prop:"releaseTime", label:"发布时间", minWidth:180},
                {prop:"activityStartTime", label:"活动开始时间", minWidth:180},
                {prop:"activityEndTime", label:"活动结束时间", minWidth:180},
                {prop:"creator", label:"创建人", minWidth:130},
                {prop:"createTime", label:"创建时间", minWidth:180},
                {prop:"lastEditTime", label:"最后修改时间", minWidth:180},
                {prop:"lastEditor", label:"最后修改人", minWidth:130},
                {prop:"sn", label:"排序", minWidth:130},
                {prop:"enable", label:"是否启用", minWidth:130},
                {prop:"rejectReason", label:"退回原因", minWidth:130}
			]
			this.filterColumns = JSON.parse(JSON.stringify(this.columns));
			this.filterColumns.forEach(a=>{
				if(a.prop === 'createTime' || a.prop === 'lastEditTime' || a.prop === 'activityEndTime' || a.prop === 'activityStartTime' || a.prop === 'releaseTime'){
					a.formatter = this.dateFormat
				}
			})
      	},
        // 过滤列
		setColumns(data){
            console.log(data)
			this.filterColumns = data;
        },
        // 一级品牌变化
        oneChange(a){
            console.log(a[0])
            let oneId = a[0]
        }
	},
	mounted() {
		this.findPage()
        this.initColumns()
        this.$api.car.findAll().then(res=>{
            console.log(res)
            this.one = res.data
        })
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
#find{
    height: 600px;
    width: 200px;
    box-sizing: border-box;
    border: 1px solid #ececec;
    button{
        width: 100%;
        border-radius: 0;
    }
}
#tab{
    flex:1;
    width: calc(100% - 200px);
    margin-left: -1px;
    box-sizing: border-box;
    border: 1px solid #ececec
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