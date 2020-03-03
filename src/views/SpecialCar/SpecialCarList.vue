<template>
    <div class="container" style="height: 100%">
        <!--工具栏-->
        <div id="top">
            <div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;">
                <el-form @submit.native.prevent :inline="true" :model="columnFilters" size="small">
                    <el-form-item>
                        <el-input v-model="columnFilters.name.value" placeholder="名称"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-cascader filterable :props="props" placeholder="品牌" :value="searchBrand" @change="searchBrandChange" :options="one"></el-cascader>
                    </el-form-item>
                    <el-form-item>
                        <el-cascader filterable :props="statusprops" placeholder="审核状态" :value="statuCur" @change="statuChange" :options="statusArr"></el-cascader>
                    </el-form-item>
                    <el-form-item>
                        <el-cascader filterable placeholder="是否启用" :value="enableCur" @change="enableChange" :options="enableArr"></el-cascader>
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
        <div id="main" style="height: 75%">
            <div id="tab">
                <el-table id="tab2" :element-loading-text="$t('action.loading')"  v-loading="fansloading" @cell-mouse-enter="currentChange"
                :data="fansData" height="100%" @selection-change="selectionChange">
                    <el-table-column type="selection" width="50"></el-table-column>
                    <el-table-column v-for="i in filterColumns" :key="i.id" align="center" :show-overflow-tooltip="i.showOverflowTooltip"
                    :prop="i.prop" :label="i.label" :min-width="i.minWidth" :width="i.width">
                    <template slot-scope="scope">
                        <img v-if="i.prop === 'img' && scope.row.img" :src="baseUrl + scope.row.img" style="max-height:50px;" class="touxiang" ondragstart="return false"/>
                        <span v-else-if="i.prop === 'brand'" v-text="formatBrand(scope.row,scope.column)"></span>
                        <span v-else-if="i.prop === 'status'" v-text="formatStatus(scope.row,scope.column)"></span>
                        <span v-else-if="i.prop === 'createTime' || i.prop === 'lastEditTime' || i.prop === 'activityEndTime' || i.prop === 'activityStartTime' || i.prop === 'releaseTime'" v-text="dateFormat(scope.row,scope.column)"></span>
                        <span v-else>{{scope.row[i.prop]}}</span>
                    </template>
                    </el-table-column>
                    <el-table-column
                        fixed="right" header-align="center" align="center" width="250" :label="$t('action.operation')">
                        <template slot-scope="scope">
                            <kt-button icon="fa fa-edit" label="编辑" perms="car:special:info:view" @click="handleEdit(scope.row)"/>
                            <kt-button label="更多" perms="car:special:info:view" type="primary" @mouseenter="showmore(scope.row)" @mouseleave="hidemore(scope.row)"/>
                            <kt-button icon="fa fa-trash" label="删除" perms="car:special:info:delete" type="danger" @click="handleDelete(scope.row)"/>
                            <ul @mouseenter="morebtnEnter(scope.row)" @mouseleave="morebtnLeave(scope.row)" ref="moreBtn" class="moreBtn">
                                <li v-if="scope.row.status == 'SHELF'"><kt-button label="审核" perms="car:special:info:audit" @click="handleAudit"/></li>
                                <li v-if="scope.row.status == 'TO_AUDITED' || scope.row.status == 'LOWER_SHELF'"><kt-button label="上架" perms="car:special:info:audit" @click="upper"/></li>
                                <li v-if="scope.row.status == 'AUDITED'"><kt-button label="下架" perms="car:special:info:audit" @click="lower"/></li>
                            </ul>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div id="fenye">
                <kt-button :label="$t('action.batchDelete')" perms="car:special:info:delete" :size="size" type="danger" @click="handleBatchDelete()" style="float:left;" v-if="showBatchDelete"/>
                <!-- 下边分页器 -->
                <el-pagination layout="prev, pager, next" @current-change="pageCurrentChange" :page-size="pageSize.pageSize" :total="pageSize.totalSize"></el-pagination>
            </div>
        </div>
        
        <!-- 新增修改界面 -->
        <el-dialog :title="operation" :model="false" :modal-append-to-body="false" :visible.sync="dialogVisible" :close-on-click-modal="false" class="dataFormBox">
            <div v-if="addAndEdit">
                <el-form :model="dataForm" ref="dataForm" label-width="80px" :size="size" style="text-align:left;">
                    <el-form-item label="名称" prop="name">
                        <el-col :span="12">
                            <el-input v-model="dataForm.name" placeholder="名称"></el-input>
                        </el-col>
                        <el-col :span="3" style="padding-right: 12px; text-align: right">
                            <span>推荐</span>
                        </el-col>
                        <el-col :span="7">
                            <el-cascader :key="extKey" clearable :props="extprops" placeholder="推荐" :value="extCur" @change="extChange" :options="ext"></el-cascader>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="品牌" prop="brand">
                        <el-col :span="6">
                            <el-cascader filterable :key="oneKey" :props="props" placeholder="品牌" :value="oneCur" @change="oneChange" :options="one"></el-cascader>
                        </el-col>
                        <el-col :span="6">
                            <el-cascader :key="twoKey" :props="props" placeholder="车系" :value="twoCur" @change="twoChange" :options="two"></el-cascader>
                        </el-col>
                        <el-col :span="6">
                            <el-cascader :key="threeKey" :props="threeprops" placeholder="车型" :value="threeCur" @change="threeChange" :options="three"></el-cascader>
                        </el-col>
                        <el-col :span="6">
                            <el-cascader :key="fourKey" :props="fourprops" placeholder="车辆" :value="fourCur" @change="fourChange" :options="four"></el-cascader>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="简介" prop="intro">
                        <el-input v-model="dataForm.intro" type="textarea" placeholder="车辆信息" :autosize="{minRows: 3, maxRows: 17}"></el-input>
                    </el-form-item>
                    <el-form-item label="车辆售价" prop="showCost">
                        <el-col :span="6">
                            <el-input @input="showCostChange" v-model="dataForm.showCost" placeholder="车辆售价">
                                <span slot="suffix" style="margin-right: 15px;">{{suffixCost}}</span>
                            </el-input>
                        </el-col>
                        <el-col :span="3" style="padding-right: 12px; text-align: right">
                            <span>指导价</span>
                        </el-col>
                        <el-col :span="6">
                            <el-input @input="showCostChange" v-model="carPrice" placeholder="指导价">
                                <span slot="suffix" style="margin-right: 15px;">{{suffixPrice}}</span>
                            </el-input>
                        </el-col>
                        <el-col :span="3" style="padding-right: 12px; text-align: right">
                            <span>优惠金额</span>
                        </el-col>
                        <el-col :span="6">
                            <el-input disabled v-model="dataForm.discount" placeholder="优惠金额">
                                <span slot="suffix" style="margin-right: 15px;">{{suffixDiscount}}</span>
                            </el-input>
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
                            <el-date-picker v-model="activityTime" type="daterange" @change="changeTime" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['00:00:00', '23:59:59']"></el-date-picker>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="标签" prop="tags">
                        <el-input v-model="dataForm.tags" placeholder="标签"></el-input>
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
                        <div style="width: 423px;margin: auto;" class="edit_container">
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
                    <el-button :size="size" type="primary" @click="submitForm()">{{$t('action.comfirm')}}</el-button>
                </span>
            </div>
            <div v-else>
                <div class="audit">
                    <div class="top">
                        <p><b>名称: </b><span>{{dataForm.name}}</span></p>
                        <p><b>库存: </b><span>{{dataForm.store}}</span></p>
                        <p><b>品牌: </b><span>{{showBrand}}</span></p>
                        <p><b>型号: </b><span>{{showCarInfo}}</span></p>
                        <p><b>推广: </b><span>{{showExtension}}</span></p>
                        <p><b>指导价: </b><span>{{dataForm.price}}元</span></p>
                        <p><b>车辆售价: </b><span>{{dataForm.showCost}}元</span></p>
                        <p><b>优惠金额: </b><span>{{dataForm.discount}}元</span></p>
                        <p><b>活动开始时间: </b><span>{{dateFormat(dataForm.activityStartTime)}}</span></p>
                        <p><b>活动结束时间: </b><span>{{dateFormat(dataForm.activityEndTime)}}</span></p>
                        <p><b>标签: </b><span>{{dataForm.tags}}</span></p>
                        <p><b>状态: </b><span>{{dataForm.status}}</span></p>
                    </div>
                    <div class="center">
                        <p class="attrlist" v-for="(i, index) in dataForm.specialAttrs" :key="index">
                            <b>{{i.key}}:</b>
                            <em>{{i.value}}</em>
                            <span>{{i.desc}}</span>
                        </p>
                        <p><b>简介: </b><span class="jianjie">{{dataForm.intro}}</span></p>
                    </div>
                    <div class="bottom">
                        <div class="sDetail">
                            <b>详情: </b>
                            <div style="width: 423px;margin: auto;" class="edit_container">
                                <quill-editor v-model="dataForm.specialDetail.detail" class="editer" disabled :options="editorOption"></quill-editor>
                            </div>
                        </div>
                        <div class="showimgs">
                            <b>图片: </b>
                            <div class="showImg">
                                <img v-for="i in dataForm.specialImgs" :key="i.id" :src="baseUrl + i.img" ondragstart="return false">
                            </div>
                        </div>
                    </div>
                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button :size="size" @click="dialogVisible = false">{{$t('action.cancel')}}</el-button>
                    <el-button :size="size" type="danger">拒绝</el-button>
                    <el-button :size="size" type="success" @click="toAudit">通过</el-button>
                </span>
            </div>
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
        let _this = this
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
						{ 'color': [] },
						{ 'background': [] },
						{ 'align': [] },
					]],
					// imageResize: {}
				}
            },
            statusArr: [{
                name: 'TO_AUDITED',
                title: '未上架'
            },{
                name: 'SHELF',
                title: '已上架'
            },{
                name: 'LOWER_SHELF',
                title: '已下架'
            },{
                name: 'AUDITED',
                title: '已审核'
            },{
                name: 'BACK',
                title: '已退回'
            }],
            enableArr: [{
                name: '启用',
                value: true
            },{
                name: '未启用',
                value: false
            }],
            size: 'small',
            columnFilters: {
				name: {
                    name: "name",
					value: ''
				},
				brand: {
                    name: "brand",
					value: 0
				},
				status: {
                    name: "status",
					value: ''
				},
				enable: {
                    name: "enable",
					value: true
				},
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
            showBrand: '',
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
                "price": 0,
                "extension": undefined,
                "specialImgs": [],
                "status": "",
                "store": 0,
                "tags": "",
                "twoBrand": 0,
                "vehicleType": 0
            },
            operation: '',
            addAndEdit: false,
            carPrice: '',
            showCarInfo: '',
            curRow: {},
            dialogVisible: false,
            imgMax: 5,
            showBatchDelete: false,
            one: [],
            two: [],
            three: [],
            four: [],
            ext: [],
            oneCur: [],
            twoCur: [],
            threeCur: [],
            fourCur: [],
            extCur: [],
            oneKey: 0,
            twoKey: 0,
            threeKey: 0,
            fourKey: 0,
            extKey: 0,
            timeKey: 0,
            activityTime: [],
            imgListKey: 0,
            baseUrl,
            fileList: [],
            fileBeans: [],
            showMoreBtn: false,
            showExtension: '',
            moreBtnTime: {},
            props: {
                label: 'name',
                value: 'id'
            },
            threeprops: {
                label: 'fullname',
                value: 'queryId'
            },
            fourprops: {
                label: 'name',
                value: 'queryId'
            },
            extprops: {
                label: 'title',
                value: 'name'
            },
            statusprops: {
                label: 'title',
                value: 'name'
            },
            suffixCost: '',
            suffixDiscount: '',
            suffixPrice: '',
            searchBrand: [],
            statuCur: [],
            enableCur: [],
            selections: []
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
            this.reshData()
            this.addAndEdit = true;
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
                "specialAttrs": [{
                    "desc": "",
                    "id": 0,
                    "infoId": 0,
                    "key": "车体颜色",
                    "sn": 0,
                    "value": ""
                },{
                    "desc": "",
                    "id": 0,
                    "infoId": 0,
                    "key": "内饰颜色",
                    "sn": 0,
                    "value": ""
                },{
                    "desc": "",
                    "id": 0,
                    "infoId": 0,
                    "key": "是否现车",
                    "sn": 0,
                    "value": ""
                },{
                    "desc": "",
                    "id": 0,
                    "infoId": 0,
                    "key": "排放标准",
                    "sn": 0,
                    "value": ""
                },{
                    "desc": "",
                    "id": 0,
                    "infoId": 0,
                    "key": "质保情况",
                    "sn": 0,
                    "value": ""
                },{
                    "desc": "",
                    "id": 0,
                    "infoId": 0,
                    "key": "车源所在地",
                    "sn": 0,
                    "value": ""
                },{
                    "desc": "",
                    "id": 0,
                    "infoId": 0,
                    "key": "提车地点",
                    "sn": 0,
                    "value": ""
                },{
                    "desc": "",
                    "id": 0,
                    "infoId": 0,
                    "key": "其他说明",
                    "sn": 0,
                    "value": ""
                },],
                "specialDetail": {
                    "detail": "",
                    "infoId": 0
                },
                "price": 0,
                "extension": undefined,
                "specialImgs": [],
                "status": "",
                "store": 1,
                "tags": "",
                "twoBrand": 0,
                "vehicleType": 0
            }
            this.dialogVisible = true
            this.operation = '新增'
        },
        // 时间格式化
      	dateFormat: function (row, column, cellValue, index){
            if(typeof row == 'string'){
                return format(row)
            }else{
                if(column){
                    return format(row[column.property])
                }
            }
      	},
        // 搜索栏品牌变更
        searchBrandChange(a){
            this.columnFilters.brand.value = a[0]
            console.log(this.columnFilters)
        },
        // 选项发生变化
        selectionChange(cur){
            console.log(cur)
            // cur.length > 0?this.showBatchDelete = true:;
            this.showBatchDelete = cur.length ? true : false
            this.selections = cur
        },
        // 通用重置
        reshData(){
            ++this.oneKey
            ++this.twoKey
            ++this.threeKey
            ++this.imgListKey
            ++this.fourKey
            ++this.extKey
            ++this.timeKey
            this.oneCur = []
            this.twoCur = []
            this.threeCur = []
            this.fourCur = []
            this.extCur = []
            this.activityTime = []
            this.fileBeans = []
            this.fileList = []
            this.carPrice = ''
        },
        // 编辑
        handleEdit(data){
            console.log(data)
            this.$api.specialCar.findById(data.id).then(res=>{
                this.reshData()
                if(res.data.activityEndTime){
                    this.activityTime = [res.data.activityStartTime, res.data.activityEndTime]
                }
                this.oneCur = [res.data.brand]
                this.$api.car.findTypeByParentId(res.data.brand).then(twoRes=>{
                    this.two = twoRes.data
                    this.twoCur = [res.data.twoBrand]
                    this.three = (this.two.filter(i => i.id == res.data.twoBrand))[0].list
                    this.threeCur = [res.data.vehicleType]
                    this.$api.car.findCarByParentId(res.data.vehicleType).then(fourRes=>{
                        this.four = fourRes.data.list
                        this.fourCur = [res.data.carInfo]
                        this.four.forEach(i => {
                            if(i.queryId == res.data.carInfo){
                                console.log(i)
                                this.carPrice = Math.round(Number(i.price.slice(0,-1)) * 10000)
                                this.suffixPrice = i.price
                            }
                        })
                    })
                })
                this.addAndEdit = true;
                console.log(res.data)
                this.dialogVisible = true
                this.operation = '编辑'
                this.dataForm = Object.assign(this.dataForm, res.data)
                if(res.data.extension){
                    this.ext.forEach(i=>{
                        if(i.title == res.data.extension.title){
                            this.extCur = [i.name]
                            this.$set(this.dataForm, 'extension', i.name)
                        }
                    })
                }
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
                console.log(id)
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
        pageCurrentChange(a){
            console.log(a)
            this.$set(this.findPageData, 'pageNum', a)
            this.fansloading = true
            this.findPage(this.findPageData)
        },
        // 格式化品牌
        formatBrand(row){
            let id = row.brand
            for(let i = 0;i < this.one.length;i ++){
                if(this.one[i].id == id){
                    return this.one[i].name
                }
            }
        },
        // 格式化状态显示
        formatStatus(row){
            let res = '';
            this.statusArr.forEach(i=>{
                if(row.status == i.name)
                    res = i.title
            })
            return res
        },
        // 初始化列表头
		initColumns: function () {
			this.columns = [
				{prop:"id", label:"ID", width:60, minWidth: 0},
				{prop:"name", label:"名称", minWidth:170},
				{prop:"brand", label:"品牌", minWidth:170},
				// {prop:"twoBrand", label:"二级品牌", minWidth:60},
				// {prop:"vehicleType", label:"车型", minWidth:100, width:100},
				// {prop:"carInfo", label:"车辆信息", minWidth:140},
                // {prop:"intro", label:"简介", minWidth:130},
                {prop:"img", label:"主图片", minWidth:250},
                {prop:"showCost", label:"车辆售价(元)", minWidth:130},
                {prop:"discount", label:"优惠金额(元)", minWidth:130},
				{prop:"price", label:"指导价(元)", minWidth:130},
                {prop:"store", label:"库存", minWidth:70},
                // {prop:"tags", label:"标签", minWidth:130},
                {prop:"status", label:"状态", minWidth:130},
                // {prop:"releaseTime", label:"发布时间", minWidth:180},
                // {prop:"activityStartTime", label:"活动开始时间", minWidth:180},
                // {prop:"activityEndTime", label:"活动结束时间", minWidth:180},
                {prop:"creator", label:"创建人", minWidth:130},
                // {prop:"createTime", label:"创建时间", minWidth:180},
                // {prop:"lastEditTime", label:"最后修改时间", minWidth:180},
                // {prop:"lastEditor", label:"最后修改人", minWidth:130},
                // {prop:"sn", label:"排序", minWidth:130},
                {prop:"enable", label:"是否启用", minWidth:130},
                {prop:"rejectReason", label:"退回原因", minWidth:130}
			]
			this.filterColumns = JSON.parse(JSON.stringify(this.columns));
			this.filterColumns.forEach(a=>{
				if(a.prop === 'createTime' || a.prop === 'lastEditTime' || a.prop === 'activityEndTime' || a.prop === 'activityStartTime' || a.prop === 'releaseTime'){
					a.formatter = this.dateFormat
				}else if(a.prop === 'brand'){
                    a.formatter = this.formatBrand
                }
            })
      	},
        // 过滤列
		setColumns(data){
            console.log(data)
			this.filterColumns = data;
        },
        // 品牌变更
        oneChange(a){
            this.$set(this.dataForm, 'brand', a[0])
            this.oneCur = [a[0]]
            this.$set(this.dataForm, 'discount', 0)
            this.carPrice = ''
            this.twoCur = []
            this.threeCur = []
            this.fourCur = []
            this.$api.car.findTypeByParentId(a[0]).then(res=>{
                console.log(res)
                this.two = res.data
            })
        },
        // 车系变更
        twoChange(a){
            this.twoCur = [a[0]]
            this.threeCur = []
            this.fourCur = []
            this.carPrice = ''
            this.$set(this.dataForm, 'discount', 0)
            let three = this.two.filter(i => i.id == a[0])
            console.log(three)
            this.three = three[0].list
            this.$set(this.dataForm, 'twoBrand', a[0])
        },
        // 车型变更
        threeChange(a){
            this.threeCur = [a[0]]
            this.fourCur = []
            this.carPrice = ''
            this.$set(this.dataForm, 'discount', 0)
            this.$set(this.dataForm, 'vehicleType', a[0])
            this.$api.car.findCarByParentId(a[0]).then(res=>{
                this.four = res.data.list
            })
        },
        // 车辆信息变更
        fourChange(a){
            this.four.forEach(i => {
                if(i.queryId == a[0]){
                    console.log(i)
                    if(i.price == '暂无' || i.price == null){
                        this.carPrice = 0
                    }else{
                        this.carPrice = Math.round(Number(i.price.slice(0,-1)) * 10000)
                    }
                    // this.suffixPrice = i.price
                    this.fourCur = [a[0]]
                    this.$set(this.dataForm, 'carInfo', a[0])
                    this.showCostChange()
                }
            })
            console.log(this.fourCur)
        },
        // 车辆售价变更
        showCostChange(){
            let val = this.dataForm.showCost
            this.suffixCost = (val / 10000) + '万'
            let price = this.carPrice
            this.suffixPrice = (price / 10000) + '万'
            let cost = Number(this.dataForm.showCost)
            console.log(price, cost)
            let discount = price - cost
            this.suffixDiscount = (discount / 10000) + '万'
            this.$set(this.dataForm, 'discount', discount)
        },
        // 推荐变更
        extChange(a){
            this.extCur = [a[0]]
            this.$set(this.dataForm, 'extension', a[0])
            console.log(this.extCur)
        },
        // 时间变更
        changeTime(a){
            console.log(a)
            // this.$set(this.dataForm, 'activityStartTime', a[0])
            // this.$set(this.dataForm, 'activityEndTime', a[1])
        },
        // 搜索状态变更
        statuChange(a){
            this.columnFilters.status.value = a[0]
        },
        // 搜索是否启用变更
        enableChange(a){
            this.columnFilters.enable.value = a[0]
        },
        // 删除
        handleBatchDelete(){
            let ids = this.selections.map(item => item.id)
            console.log(ids)
            this.$confirm('确认删除选中记录吗？', '提示', {
				type: 'warning'
			}).then(() => {
                ids.forEach(i=>{
                    this.$api.specialCar.deleteData(i).then(res=>{
                        if(res.code == 200)
                        Message.success('删除成功')
                    })
                })
			})
        },
        // 表单提交
        submitForm(){
            if(this.activityTime[0]){
                this.$set(this.dataForm, 'activityStartTime', this.activityTime[0])
                this.$set(this.dataForm, 'activityEndTime', this.activityTime[1])
            }
            this.$set(this.dataForm, 'price', this.carPrice)
            this.dataForm.fileBeans = this.fileBeans
            this.dataForm.specialImgs = this.fileList.map(i=>{
                return {
                    img: i.url
                }
            })
            this.dataForm.showCost = Number(this.dataForm.showCost)
            console.log(this.dataForm)
            let a = this.dataForm.specialAttrs.every(i => {
                return (Boolean(i.key) && Boolean(i.value))
            })
            // 表单验证
            if(!this.dataForm.name){
                Message.error('请输入名称!')
            }else if(!a){
                Message.error('属性名或属性值不能为空!')
            }else{
                this.$confirm('确认要提交吗？').then(()=>{
                    this.$api.specialCar.save(this.dataForm).then(res => {
                        console.log(res)
                        this.dialogVisible = false
                        this.findPage(null)
                    })
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
            clearTimeout(this.moreBtnTime['a' + row.id])
            event.path.forEach(i=>{
                if(i.tagName == 'TD')
                    i.classList.add("showmoreBtn")
            })
        },
        // 隐藏更多按钮
        hidemore(row){
            let e = event
            this.moreBtnTime['a' + row.id] = setTimeout(()=>{
                e.path.forEach(i=>{
                if(i.tagName == 'TD')
                    i.classList.remove("showmoreBtn")
                })
            }, 300)
        },
        // 显示更多按钮
        morebtnEnter(row){
            clearTimeout(this.moreBtnTime['a' + row.id])
        },
        // 隐藏更多按钮
        morebtnLeave(row){
            let e = event
            this.moreBtnTime['a' + row.id] = setTimeout(()=>{
                e.path.forEach(i=>{
                if(i.tagName == 'TD')
                    i.classList.remove("showmoreBtn")
                })
            }, 300)
        },
        // 改变选中行
        currentChange(row){
            this.curRow = row
        },
        // 审核
        handleAudit(){
            this.addAndEdit = false;
            this.operation = '审核';
            this.$api.specialCar.findById(this.curRow.id).then(res=>{
                this.showMoreBtn = false
                this.dataForm = Object.assign({}, res.data)
                if(res.data.extension){
                    this.showExtension = res.data.extension.title
                }else{
                    this.showExtension = '无'
                }
                if(res.data.extension){
                    this.ext.forEach(i=>{
                        if(i.title == res.data.extension.title){
                            this.extCur = [i.name]
                            this.$set(this.dataForm, 'extension', i.name)
                        }
                    })
                }
            }).then(()=>{
                this.dialogVisible = true
                if(this.dataForm.brand && this.dataForm.twoBrand){
                    this.auditBrand()
                }else{
                    this.showBrand = ''
                }
            })
        },
        // 审核显示品牌
        auditBrand(){
            let a = this.dataForm
            let oneBrand = this.one.filter(i => i.id == a.brand)
            this.$api.car.findTypeByParentId(a.brand).then(res=>{
                let twoBrand = res.data.filter(i => i.id == a.twoBrand)
                let oneName = oneBrand[0].name || ''
                let twoName = twoBrand[0].name || ''
                let threeBrand = twoBrand[0].list.filter(i => i.queryId == a.vehicleType)
                let threeName = threeBrand[0].fullname
                this.showBrand = oneName + ' / ' + twoName + ' / ' + threeName
                return a
            }).then(a=>{
                this.$api.car.findCarByParentId(a.vehicleType).then(res=>{
                    console.log(res.data.list)
                    let fourBrand = res.data.list.filter(i=>i.queryId == a.carInfo)
                    console.log(fourBrand)
                    this.showCarInfo = fourBrand[0].name
                })
            })
        },
        // 通过审核
        toAudit(){
            this.$confirm('确认通过审核吗？', '提示').then(()=>{
                this.$set(this.dataForm, 'status', 'AUDITED')
                this.$api.specialCar.audit(this.dataForm).then(res=>{
                    console.log(res)
                    if(res.code == 200){
                        this.dialogVisible = false
                        Message.success('操作成功')
                        this.findPage()
                    }else{
                        Message.error('操作失败')
                    }
                })
            })
        },
        // 上架
        upper(){
            console.log(this.curRow.id)
            this.$confirm('确认上架吗？', '提示').then(()=>{
                this.$api.specialCar.upper(this.curRow.id).then(res=>{
                    console.log(res)
                    if(res.code == 200){
                        Message.success('操作成功')
                        this.findPage()
                    }else{
                        Message.error('操作失败')
                    }
                })
            })
        },
        // 下架
        lower(){
            console.log(this.curRow.id)
            this.$confirm('确认下架吗？', '提示').then(()=>{
                this.$api.specialCar.lower(this.curRow.id).then(res=>{
                    console.log(res)
                    if(res.code == 200){
                        Message.success('操作成功')
                        this.findPage()
                    }else{
                        Message.error('操作失败')
                    }
                })
            })
        },
	},
	mounted() {
		this.findPage()
        this.initColumns()
        // 所有品牌
        this.$api.car.findAll().then(res=>{
            // ++this.oneKey
            console.log(res)
            this.one = res.data
        })
        // 推广
        this.$api.specialCar.getExtensionEnum().then(res=>{
            console.log(res)
            this.ext = res.data
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
.audit{
    height: 580px;
    overflow-y: auto;
    font-size: 18px;
    text-align: left;
    margin-bottom: 20px;
    .top{
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        border-bottom: #ececec solid 1px;
        padding: 20px 0;
        p{
            box-sizing: border-box;
            width: 50%;
            padding: 0 70px;
            display: flex;
            line-height: 40px;
            justify-content: space-between;
        }
    }
    .center{
        padding: 20px 70px;
        border-bottom: #ececec solid 1px;
        p{
            display: flex;
            justify-content: space-between;
            line-height: 40px;
            b{
                width: 80px;
            }
            span{
                flex: 1
            }
            .jianjie{
                margin-top: 8px;
                line-height: 24px;
            }
            em{
                font-style: inherit;
                width: 300px
            }
        }
        .attrlist{
            b{
                width: 300px
            }
            span{
                color: #999;
            }
        }
    }
    .bottom{
        padding: 20px 70px;
        b{
            width: 100px;
        }
        .sDetail{
            display: flex;
            justify-content: space-between;
        }
        .showimgs{
            padding: 40px 0;;
            display: flex;
            justify-content: space-between;
            div{
                flex: 1;
            }
            .showImg{
                display: flex;
                flex-wrap: wrap;
            }
            img{
                width: 146px;
                height: 146px;
                margin: 0 10px;
            }
        }
    }
}
</style>
<style scoped>
>>> .el-date-editor--daterange.el-input__inner{
    width: 100% ;
}
>>> .ql-editor{
    overflow-y: scroll;
}
>>> .ql-editor p{
    line-height: 1.2 !important;
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
#main >>> td{
    height: 75px;
}
>>> .el-form-item__content{
    
}
</style>