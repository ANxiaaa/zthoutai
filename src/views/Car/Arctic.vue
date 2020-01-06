<template>
    <div class="container">
        <!--工具栏-->
        <div id="top">
            <div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;">
                <el-form @submit.native.prevent :inline="true"  size="small">
					<el-form-item>
						<kt-button icon="fa fa-plus" :label="$t('action.add')" perms="car:arctic:add" type="primary" @click="handleAdd" />
					</el-form-item>
                </el-form>
            </div>
            <filter-tool :showexcel="false" :columns="columns"  @setColumns="setColumns" @findPage="findPage(null)"></filter-tool>
        </div>
        <div id="main">
            <div id="find">
                <!-- 左边标签 -->
                <el-table @row-click="openDetails"
                    :data="tableData" row-key="id" style="height:100%;overflow-y:auto" highlight-current-row ref="singleTable" v-loading="loading" id="tab1" :tree-props="{children: 'list', hasChildren: 'hasChildren'}">
                    <el-table-column
                        prop="name" min-width="130">
						<template slot-scope="scope">
							<span>{{scope.row.fullname || scope.row.name}}</span>
							<el-tag size="mini" v-if="scope.row.id >= 40000" type="success" style="float:right;">新能源</el-tag>
						</template>
                    </el-table-column>
                </el-table>
            </div>
            <div id="tab">
                <!-- 右边表格 -->
                <el-table id="tab2" :element-loading-text="$t('action.loading')"  v-loading="fansloading" :data="arcticData" height="598">
                    <el-table-column v-for="i in filterColumns" :key="i.id" align="center" :show-overflow-tooltip="i.showOverflowTooltip" :prop="i.prop" :label="i.label" :sortable="i.sortable" :min-width="i.minWidth" :width="i.width">
                    <template slot-scope="scope">
						<div class="demo-image__preview" v-if="i.prop === 'logo'">
							<el-image
								style="height: 100px;"
								class="touxiang" fill="contain"
								:src="scope.row.logo"
								:preview-src-list="[scope.row.logo]">
							</el-image>
						</div>
                        <span :class="{stop:scope.row[i.prop] === '停产'}" v-if="i.prop !== 'logo'">{{scope.row[i.prop]}}</span>
                    </template>
                    </el-table-column>
                    <el-table-column
                        fixed="right" header-align="center" align="center" width="250" min-width="120" :label="$t('action.operation')">
                        <template slot-scope="scope">
                            <kt-button icon="fa fa-edit" :label="$t('action.edit')" perms="car:two:brand:view" @click="handleEdit(scope.row)"/>
                            <kt-button label="查看" perms="car:two:brand:view" @click="handleView(scope.row)" type="primary"/>
							<kt-button icon="fa fa-trash" :label="$t('action.delete')" perms="car:arctic:delete" type="danger" @click="handleDelete(scope.row)"/>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
		<!--新增/编辑/查看界面-->
		<el-dialog :title="operation" :modal="false" :visible.sync="dialogVisible" :close-on-click-modal="false">
			<!-- 新增/编辑内容 -->
			<div v-if="operation !== '车辆信息'">
				1
			</div>
			<!-- 查看内容 -->
			<div v-else style="height:560px;overflow-y: auto">
				<arctic-view :carData="carData"></arctic-view>
			</div>
			<div slot="footer" class="dialog-footer">
				<el-button v-if="operation !== '车辆信息'" size="small" @click.native="dialogVisible = false">{{$t('action.cancel')}}</el-button>
				<el-button v-if="operation !== '车辆信息'" size="small" type="primary" @click.native="submitForm" :loading="editLoading">{{$t('action.submit')}}</el-button>
				<el-button v-else size="small" type="primary" @click.native="dialogVisible = false" :loading="editLoading">关闭</el-button>
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
import arcticView from "../Core/ArcticView"
export default {
	components:{
        KtButton,
        KtTable,
		filterTool,
		arcticView
	},
	data() {
		return {
            tableData: [],
            loading: false,
            fansloading:false,
            arcticData:[],
            filterColumns:[],
            columns:[],
			cur: {},
			dialogVisible: false, // 新增编辑界面是否显示
			operation: '', // 新增, 编辑, 查看
			editLoading:false,
			dataForm: {
				name: '',
				fullname: '',
				logo: '',
				salestate: '',
				depth: 3
			},
			carData: {}, // 查看车辆详情
			fangdaFlag: false
        }
	},
	methods: {
        // 时间格式化
      	dateFormat: function (row, column, cellValue, index){
          	return format(row[column.property])
      	},
        // 获取页面数据
        findPage(val){
			if(val === null){
				if(Object.keys(this.cur).length == 0){
					return
				}
				if(Object.keys(this.cur).length > 0){
					val = this.cur
				}else{
					val = this.tableData[0].list[0]
				}
			}
			console.log(val)
			let { queryId } = val
			this.fansloading = true
			this.$api.car.findCarByParentId(queryId).then(res=>{
				console.log(res)
				this.arcticData = res.data.list
				console.log(this.tableData)
                this.fansloading = false
				this.$refs.singleTable.setCurrentRow(val);
            }).then(()=>{
				let imgs = document.querySelectorAll('.touxiang')
				for(let i = 0;i < imgs.length;i++){
					let max = 3 // 允许失败次数
					// 图片加载成功
					imgs[i].onload = function(){
						if(this.show == 1){
							this.title = '加载失败,点击刷新。'
						}else{
							this.title = ''
							this.onclick = null
						}
					}
					// 图片加载失败
					imgs[i].onerror = function(err){
						console.log(1)
						if(max > 3){
							this.src = this.src
							max --
						}else{
							let imgSrc = this.src
							this.show = 1
							this.src = require('@/assets/imgError.png')
							this.onclick = function(){ // 点击刷新
								console.log(1)
								this.show = 0
								this.src = imgSrc
							}
							console.log(this)
						}
					}
				}
			})
        },
        // 获取左边导航
        findTableData(){
			let id = this.$route.query.id || 1
			this.loading = true;
            this.$api.car.findTypeByParentId(id).then(res=>{
				console.log(res.data)
				this.tableData = res.data
                this.loading = false
            })
        },
        // 改变选中行
        openDetails(val) {
			console.log(val)
			if(val.list){
				return
			}
			if(this.fansloading){
				Message.error('点击太快请稍后!')
                return
			}
            if(this.cur.id === val.id){
				return
			}
			this.cur = val
            this.findPage(val)
        },
        // 初始化列表头
		initColumns: function () {
			this.columns = [
				{prop:"id", label:"ID", width:90, minWidth: 0},
				{prop:"name", label:"名称", minWidth:200},
				{prop:"logo", label:"LOGO", minWidth:260},
				{prop:"price", label:"价格", minWidth:80, sortable: true},
				{prop:"yeartype", label:"年款", minWidth:100, sortable: true},
				{prop:"productionstate", label:"生产状态", minWidth:100, sortable: true},
				{prop:"salestate", label:"销售状态", minWidth:100, sortable: true},
				{prop:"sizetype", label:"车辆等级", minWidth:90},
			]
			this.filterColumns = JSON.parse(JSON.stringify(this.columns));
      	},
        // 过滤列
		setColumns(data){
            console.log(data)
			this.filterColumns = data;
		},
		// 删除
		handleDelete(row){
			console.log(row)
		},
		// 添加
		handleAdd(){
			this.dialogVisible = true
			this.operation = '添加'
			this.dataForm = {
				name: '',
				fullname: '',
				logo: '',
				salestate: '',
				depth: 3
			}
		},
		// 编辑
        handleEdit(row){
            this.dialogVisible = true
			this.operation = '编辑'
			console.log(row)
			this.dataForm = Object.assign({}, row)
		},
		// 查看
		handleView(row){
			console.log(row)
			this.dialogVisible = true
			this.operation = '车辆信息'
			let { queryId } = row
			this.$api.car.findByCarId(queryId).then(res=>{
				console.log(res.data)
				this.carData = res.data
            })
		},
		// 提交
		submitForm(){
			console.log('提交')
		}
	},
	mounted() {
        this.findTableData();
		this.initColumns();
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
    margin: auto;
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
#fangda{
	position: fixed;
	top: 0;
	bottom: 0;
	left: 0;
	right: 0;
	background: rgba($color: #000000, $alpha: .3);
	z-index: 2555;
}
</style>
<style scoped>
#tab1 >>> .el-table__header-wrapper{
    display: none;
}
>>> #filterTool{
    float: right;
}
.stop{
	color: #c00;
	font-weight: 600
}
#tab2 >>> .el-image__inner{
	width: auto
}
.demo-image__preview >>> .el-image__error{
	display: none;
}
</style>