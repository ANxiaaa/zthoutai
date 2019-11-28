<template>
    <div class="container">
        <!--工具栏-->
        <div id="top">
            <div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;">
                <el-form @submit.native.prevent :inline="true" :model="filters" size="small">
                    <el-form-item>
                        <el-input v-model="filters.label" placeholder="名称"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <kt-button icon="fa fa-search" :label="$t('action.search')" perms="wx:fans:view" type="primary" @click="findPage(null)"/>
                    </el-form-item>
                </el-form>
            </div>
            <filter-tool :showexcel="false" :columns="columns" @setColumns="setColumns" @findPage="findPage(null)"></filter-tool>
        </div>
        <div id="main">
            <div id="find">
                <!-- 左边标签 -->
                <el-table @row-click="openDetails"
                    :data="tableData" row-key="id" style="height:100%;overflow-y:auto" highlight-current-row ref="singleTable" v-loading="loading" id="tab1" default-expand-all :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
                    <el-table-column
                        prop="name" min-width="130">
                    </el-table-column>
                </el-table>
            </div>
            <div id="tab">
                <!-- 右边表格 -->
                <el-table id="tab2" :element-loading-text="$t('action.loading')"  v-loading="fansloading"
                :data="fansData" height="598">
                    <el-table-column v-for="i in filterColumns" :key="i.id" align="center" :show-overflow-tooltip="i.showOverflowTooltip"
                    :prop="i.prop" :label="i.label" :min-width="i.minWidth" :width="i.width">
                    <template slot-scope="scope">
                        <img v-if="i.prop === 'pic'" :src="scope.row.pic" style="height:70px;width:70px;" class="touxiang" ondragstart="return false"/>
                        <span v-if="i.prop === 'time'" v-text="dateFormat(scope.row,scope.column)"></span>
                        <span v-if="i.prop !== 'pic' && i.prop !== 'time'">{{scope.row[i.prop]}}</span>
                    </template>
                    </el-table-column>
                    <el-table-column
                        fixed="right" header-align="center" align="center" width="120" min-width="120" :label="$t('action.operation')">
                        <template slot-scope="scope">
                            <kt-button icon="fa fa-edit" label="查看" perms="wx:fans:view" @click="handleEdit(scope.row)"/>
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
            filters: {
				label: ''
			},
            tableData: [],
            loading: false,
            fansloading:false,
            fansData:[],
            filterColumns:[],
            columns:[],
            pageSize:{},
            findPageData:{
                parentID: 1,
                pageNum: 1,
                pageSize: 10
            },
            cur: {}
        }
	},
	methods: {
        // 时间格式化
      	dateFormat: function (row, column, cellValue, index){
            console.log(row[column.property])
          	return format(row[column.property])
      	},
        handleEdit(a){
            console.log(a)
        },
        // 获取页面数据
        findPage(data, val){
            data = data || this.findPageData
            console.log(data)
            this.fansloading = true
            axios({
                url:'/http://localhost:8010/wxfans/findFans/',
                method:'post',
                data
            }).then(res=>{
                this.fansData = res.data.data.content
                this.pageSize = res.data.data
            }).then(()=>{
                this.fansloading = false
                !val || this.$refs.singleTable.setCurrentRow(val);
                this.findPageData = data
            })
        },
        // 获取左边导航
        findTableData(){
            this.loading = true;
            axios.get('/http://localhost:8010/wxfans/sorter/').then(res=>{
                this.tableData = res.data.data
                this.loading = false
                let data = {
                    parentID: 1,
                    pageNum: 1,
                    pageSize: 10
                }
                this.findPage(data, this.tableData[0])
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
        // 改变选中行
        openDetails(val) {
            if(this.fansloading === true){ // 在加载中
                Message.error('点击太快请稍后!')
                return
            }
            if(this.cur.id === val.id){
				return
			}
			this.cur = val
            let data = {
                parentID: val.id,
                pageNum: 1,
                pageSize: this.findPageData.pageSize
            }
            this.findPage(data, val)
        },
        // 初始化列表头
		initColumns: function () {
			this.columns = [
				{prop:"id", label:"ID", width:60, minWidth: 0},
				{prop:"name", label:"用户", minWidth:100},
				{prop:"city", label:"城市", minWidth:60},
				{prop:"parentName", label:"标签", minWidth:60},
				{prop:"pic", label:"头像", minWidth:100, width:100},
				{prop:"time", label:"关注时间", minWidth:140},
                {prop:"mark", label:"备注", minWidth:130, showOverflowTooltip: true}
			]
			this.filterColumns = JSON.parse(JSON.stringify(this.columns));
      	},
        // 过滤列
		setColumns(data){
            console.log(data)
			this.filterColumns = data;
        }
	},
	mounted() {
        this.findTableData();
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