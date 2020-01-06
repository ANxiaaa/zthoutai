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
                        <img v-if="i.prop === 'img' && scope.row.img" :src="baseUrl + scope.row.img" style="max-height:200px;" class="touxiang" ondragstart="return false"/>
                        <span v-if="i.prop === 'createTime' || i.prop === 'lastEditTime' || i.prop === 'activityEndTime' || i.prop === 'activityStartTime' || i.prop === 'releaseTime'" v-text="dateFormat(scope.row,scope.column)"></span>
                        <span v-if="i.prop !== 'img' && i.prop !== 'createTime' && i.prop !== 'lastEditTime' && i.prop !== 'activityEndTime' && i.prop !== 'activityStartTime' && i.prop !== 'releaseTime'">{{scope.row[i.prop]}}</span>
                    </template>
                    </el-table-column>
                    <el-table-column
                        fixed="right" header-align="center" align="center" width="250" :label="$t('action.operation')">
                        <template slot-scope="scope">
                            <kt-button icon="fa fa-edit" label="编辑" perms="car:special:info:view" @click="handleEdit(scope.row)"/>
                            <kt-button label="更多" perms="car:special:info:view" type="primary" @mouseenter="showmore(scope.row)" @mouseleave="hidemore(scope.row)"/>
                            <kt-button icon="fa fa-trash" label="删除" perms="car:special:info:delete" type="danger" @click="handleDelete(scope.row)"/>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div id="fenye">
                <!-- 下边分页器 -->
                <el-pagination layout="prev, pager, next" @current-change="currentChange" :page-size="pageSize.pageSize" :total="pageSize.totalSize"></el-pagination>
            </div>
        </div>
        <ul @mouseenter="morebtnEnter" @mouseleave="morebtnLeave" v-show="showMoreBtn" ref="moreBtn" class="moreBtn">
            <li><kt-button label="更多" perms="car:special:info:view"/></li>
        </ul>
        <!-- 新增修改界面 -->
        <el-dialog :title="operation ? '新增' : '修改'" :model="false" :modal-append-to-body="false" :visible.sync="dialogVisible" :close-on-click-modal="false" class="dataFormBox">
            <el-form :model="dataForm" ref="dataForm" @keyup.enter.native="submitForm()" label-width="80px" :size="size" style="text-align:left;">
                <el-form-item label="名称" prop="name">
                    <el-input v-model="dataForm.name" placeholder="名称"></el-input>
                </el-form-item>
                <el-form-item label="品牌" prop="brand">
                    <el-col :span="8">
                        <el-cascader :key="oneKey" filterable :props="props" placeholder="品牌" @change="oneChange" :options="one"></el-cascader>
                    </el-col>
                    <el-col :span="8">
                    </el-col>
                    <el-col :span="8">
                    </el-col>
                </el-form-item>
                <el-form-item label="简介" prop="intro">
                    <el-input v-model="dataForm.intro" type="textarea" placeholder="车辆信息" :autosize="{minRows: 3, maxRows: 17}"></el-input>
                </el-form-item>
                <el-form-item label="车辆售价" prop="showCost">
                    <el-col :span="10">
                        <el-input v-model="dataForm.showCost" placeholder="车辆售价"></el-input>
                    </el-col>
                    <el-col :span="3" style="padding-right: 12px; text-align: right">
                        <span>优惠金额</span>
                    </el-col>
                    <el-col :span="11">
                        <el-input v-model="dataForm.discount" placeholder="优惠金额（指导价和销售价格差）"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="库存" prop="store">
                    <el-col :span="10">
                        <el-input v-model="dataForm.store" placeholder="库存"></el-input>
                    </el-col>
                    <el-col :span="3" style="padding-right: 12px; text-align: right">
                        <span>活动时间</span>
                    </el-col>
                    <el-col :span="11">
                        <el-date-picker
                            v-model="activityTime"
                            type="daterange" @change="changeTime"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            :default-time="['00:00:00', '23:59:59']">
                        </el-date-picker>
                    </el-col>
                </el-form-item>
                <el-form-item label="属性" prop="specialAttrs">
                    <div v-for="(i, index) in dataForm.specialAttrs" :key="'a' + index">
                        <el-col :span="5" style="padding-right: 15px">
                            <el-form-item>
                                <el-input v-model="i.key" placeholder="属性名"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="5" style="padding-right: 15px">
                            <el-form-item>
                                <el-input v-model="i.value" placeholder="属性值"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="13">
                            <el-form-item>
                                <el-input v-model="i.desc" placeholder="介绍"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="1" style="text-align: center;">
                            <el-button @click.native="delattr(index)" type="danger" plain icon="el-icon-delete" circle></el-button>
                        </el-col>
                    </div>
                    <div>
                        <el-button type="success" @click="addattr" plain style="width: 100%">添加属性</el-button>
                    </div>
                </el-form-item>
                <el-form-item label="详情" prop="specialDetail">
                    <div class="edit_container">
                        <input style="position: absolute;top: 8px;right: 8px;width: 80px;height: 32px;z-index: 2;opacity: 0;" title="" @change="fwbImg" type="file" accept="image/jpeg">
                        <el-button style="position: absolute;top: 8px;right: 8px;">添加图片</el-button>
                        <quill-editor v-model="dataForm.specialDetail.detail" class="editer" :options="editorOption"> </quill-editor>
                    </div>
                </el-form-item>
                <el-form-item label="上传照片" prop="specialImgs">
                    <el-upload :limit="imgMax" :file-list="fileList" list-type="picture-card" :key="imgListKey" :before-remove="onRemove" :http-request="httpRequest" accept="image/jpeg" action="#" :on-exceed="onExceed" :on-change="changeImg" multiple>
                        <i class="el-icon-plus"></i>
                    </el-upload>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button :size="size" @click="dialogVisible = false">{{$t('action.cancel')}}</el-button>
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
import Cookies from "js-cookie"
import api from "@/http/api"
import { baseUrl } from '@/utils/global'
import { upLoaderImg } from "@/http/upImg"
export default {
	components:{
        KtButton,
        filterTool
	},
	data() {
		return {
            editorOption: {
				//定义富文本展示内容
				modules:{
					toolbar:[[
						{ 'header': 1 },
						{ 'header': 2 },
						'bold',
						'italic',
						'underline',
						'strike',
						{ 'script': 'sub'},
						{ 'script': 'super' },
						{ 'indent': '-1'},
						{ 'indent': '+1' },
						{ 'color': [] },
						{ 'background': [] },
						{ 'align': [] },
						{ 'size': ['small', false, 'large', 'huge'] }
					]],
					imageResize: {}
				}
			},
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
                "fileBeans": [],
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
                "specialAttrs": [],
                "specialDetail": {
                    "detail": "",
                    "infoId": 0
                },
                "specialImgs": [],
                "status": "",
                "store": 0,
                "tags": "",
                "twoBrand": 0,
                "vehicleType": 0
            },
            operation: false, // true 新增 false 修改
            dialogVisible: false,
            imgMax: 5,
            one: [],
            two: [],
            three: [],
            oneId: 0,
            oneKey: 0,
            twoKey: 0,
            threeKey: 0,
            activityTime: [],
            imgListKey: 0,
            baseUrl,
            fileList: [],
            fileBeans: [],
            showMoreBtn: false,
            moreBtnTime: null,
            props: {
                label: 'name',
                value: 'id',
                lazy: true,
                brandData: '',
                lazyLoad (node, resolve) {
                    const { level } = node;
                    let id = node.data.id
                    api.car.findTypeByParentId(id).then(res=>{
                        res.data.forEach(i=>{
                            i.leaf = true
                        })
                        // 通过调用resolve将子节点数据返回，通知组件数据加载完成
                        resolve(res.data);
                    })
                }
            }
        }
	},
	methods: {
        // 富文本图片
        async fwbImg(a){
			console.log(a.target.files)
			console.log((a.target.files[0].size / 1024) / 1024)
			if((a.target.files[0].size / 1024) / 1024 < 5){
				await upLoaderImg(a.target.files[0]).then(res=>{
					console.log(res)
					this.dataForm.specialDetail.detail += `<img src="${baseUrl}${res.data.data.filePath}"/>`
				})
			}else{
				Message.error('最大上传 5M 图片')
			}
		},
        // 添加
        handleAdd(){
            ++this.oneKey
            ++this.twoKey
            ++this.threeKey
            ++this.imgListKey
            this.fileList = []
            this.fileBeans = []
            this.dataForm = {
                "activityEndTime": "",
                "activityStartTime": "",
                "brand": 0,
                "carInfo": 0,
                "createTime": "",
                "creator": "",
                "discount": 0,
                "enable": false,
                "fileBeans": [],
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
                "specialAttrs": [],
                "specialDetail": {
                    "detail": "",
                    "infoId": 0
                },
                "specialImgs": [],
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
          	return format(row[column.property])
      	},
        // 编辑
        handleEdit(data){
            console.log(data)
            this.$api.specialCar.findById(data.id).then(res=>{
                ++this.oneKey
                ++this.twoKey
                ++this.threeKey
                ++this.imgListKey
                this.fileBeans = []
                this.fileList = []
                console.log(res.data)
                this.dialogVisible = true
                this.operation = false
                this.dataForm = Object.assign(this.dataForm,res.data)
                res.data.specialImgs.forEach(i=>{
                    this.fileList.push({
                        url: baseUrl + i.img,
                        id: i.id
                    })
                })
            })
        },
        // 删除
        handleDelete(data){
            console.log(data)
            this.$confirm('确认删除选中记录吗？', '提示', {
				type: 'warning'
			}).then(() => {
                let { id } = data
                this.$api.specialCar.deleteData(id).then(res=>{
                    if(res.code == 200)
                    Message.success('删除成功')
                })
			})
        },
        // 获取页面数据
        findPage(data){
            data = data || this.findPageData
            this.fansloading = true
            data.columnFilters = this.columnFilters
            this.$api.specialCar.findPage(data).then(res=>{
                this.fansloading = false
                this.fansData = res.data.content
                this.pageSize = Object.assign({},res.data)
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
        // 一级品牌变更
        oneChange(a){
            console.log(a)
            if(a.length === 2){
                console.log(this.props.brandData)
            }
        },
        // 时间变更
        changeTime(a){
            console.log(a)
            this.$set(this.dataForm, 'activityStartTime', a[0])
            this.$set(this.dataForm, 'activityEndTime', a[1])
        },
        // 表单提交
        submitForm(){
            let a = this.dataForm.specialAttrs.every(i => {
                return (Boolean(i.key) && Boolean(i.value))
            })
            this.dataForm.fileBeans = this.fileBeans
            this.dataForm.specialImgs = this.fileList.map(i=>{
                return {
                    img: i.url
                }
            })
            if(!a){
                Message.error('属性名或属性值不能为空!')
            }else{
                console.log(this.dataForm)
                this.$api.specialCar.save(this.dataForm).then(res => {
                    console.log(res)
                    this.dialogVisible = false
                    this.findPage(null)
                })
            }
        },
        // 添加属性
        addattr(){
            this.dataForm.specialAttrs.push({
                "desc": "",
                "id": 0,
                "infoId": 0,
                "key": "",
                "sn": 0,
                "value": ""
            })
        },
        // 删除属性
        delattr(index){
            this.dataForm.specialAttrs.splice(index, 1)
        },
        // 改变图片
        changeImg(file, fileList){
            console.log(file)
            console.log(fileList)
            if(fileList.length >= this.imgMax){
                document.querySelector('.el-upload.el-upload--picture-card').style.display = 'none'
            }else{
                document.querySelector('.el-upload.el-upload--picture-card').style.display = 'inline-block'
            }
        },
        // 删除图片
        onRemove(file, fileList){
            console.log(file)
            console.log(fileList)
            let newList = fileList.filter((i, index)=>{
                return i.id !== file.id || i.name !== file.name
            })
            console.log(this.fileList)
            this.$confirm('确认删除选中图片吗？', '提示', {
				type: 'warning'
			}).then(() => {
                if(file.id){
                    this.$api.specialCar.deleteImg(file.id).then(res=>{
                        Message.success('删除成功')
                        this.fileBeans.forEach((i, index)=>{
                            if(i.originalFileName == file.name)
                                this.fileBeans.splice(index, 1)
                        })
                        this.fileList = newList
                        console.log(this.fileList)
                        console.log(this.dataForm)
                    }).catch(err=>{
                        this.fileList = fileList
                    })
                }else{
                    this.fileList = newList
                }
			})
            if(fileList.length >= this.imgMax){
                document.querySelector('.el-upload.el-upload--picture-card').style.display = 'none'
            }else{
                document.querySelector('.el-upload.el-upload--picture-card').style.display = 'inline-block'
            }
            return false
        },
        // 最多张数
        onExceed(){
            Message.error('最多上传5张图片')
        },
        // 上传图片
        async httpRequest(a){
            console.log(a)
            let file = a.file
            await upLoaderImg(file).then(res=>{
                console.log(res.data)
                this.fileBeans.push(res.data.data)
                console.log(this.fileList);
                console.log(this.fileBeans);
                console.log(this.dataForm.specialImgs);
            })
        },
        // 显示更多按钮
        showmore(row){
            clearTimeout(this.moreBtnTime)
            let top = event.path[0].getBoundingClientRect().bottom + 10
            let left = event.path[0].getBoundingClientRect().left - 12
            let box = this.$refs.moreBtn
            this.showMoreBtn = true
            box.style.top = top + 'px'
            box.style.left = left + 'px'
        },
        // 隐藏更多按钮
        hidemore(row){
            this.moreBtnTime = setTimeout(()=>{
                this.showMoreBtn = false
            }, 600)
        },
        // 显示更多按钮
        morebtnEnter(){
            clearTimeout(this.moreBtnTime)
        },
        // 隐藏更多按钮
        morebtnLeave(){
            this.moreBtnTime = setTimeout(()=>{
                this.showMoreBtn = false
            }, 600)
        }
	},
	mounted() {
		this.findPage()
        this.initColumns()
        this.$api.car.findAll().then(res=>{
            ++this.oneKey
            console.log(res)
            this.one = res.data
        })
    },
    computed:{
        token(){
            let tokenlen = Number(Cookies.get('tokenlen'))
			let token = ''
			for(let i = 0;i < tokenlen;i ++){
				token += Cookies.get('token' + i)
            }
            return token
        }
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
.moreBtn{
    position: fixed;
    top: 0;left: 0;
    height: 150px;
    background: #fff;
    width: 80px;
    border: 1px solid #ececec;
    border-radius: 15px;
    box-shadow: 0 0 12px 0 #666;
    z-index: 9999;
}
</style>
<style scoped>
>>> .el-date-editor--daterange.el-input__inner{
    width: 100% ;
}
.quill-editor >>> .ql-container{
	height: 400px;
}
#tab1 >>> .el-table__header-wrapper{
    display: none;
}
>>> #filterTool{
    float: right;
}
>>> .dataFormBox .el-dialog{
    overflow-y: auto;
}
>>> td{
    height: 225px;
}
</style>