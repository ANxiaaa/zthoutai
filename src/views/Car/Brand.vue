<template>
    <div class="container">
		<!--工具栏-->
		<div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;">
			<el-form @submit.native.prevent :inline="true" :model="filters" size="small">
				<el-form-item>
					<el-input v-model="filters.label" placeholder="名称"></el-input>
				</el-form-item>
				<el-form-item>
					<kt-button icon="fa fa-search" :label="$t('action.search')" perms="car:brand:view" type="primary" @click="findPage(null)"/>
				</el-form-item>
				<el-form-item>
					<kt-button icon="fa fa-plus" :label="$t('action.add')" perms="car:brand:add" type="primary" @click="handleAdd" />
				</el-form-item>
			</el-form>
		</div>
		<filter-tool :columns="columns" @setColumns="setColumns" @findPage="findPage(null)" :showexcel="false"></filter-tool>
		<!--表格内容栏-->
		<el-table height="600" :data="tableDdata" stripe size="mini" style="width: 100%;" row-key="id" ref="tab" border v-loading="loading" :element-loading-text="$t('action.loading')">
            <el-table-column v-for="i in filterColumns" :key="i.prop" :sortable="i.sortable" :prop="i.prop" :minWidth="i.minWidth" :label="i.label" :width="i.width" header-align="center" align="center">
                <template slot-scope="scope">
                    <img v-if="i.prop === 'logo'" class="carLogo" :src="scope.row.logo" ondragstart="return false"/>
                    <span v-if="i.prop !== 'logo'">{{scope.row[i.prop]}}</span>
                </template>
            </el-table-column>
            <el-table-column fixed="right" class-name="btnbox"
                header-align="center" align="center" width="250" :label="$t('action.operation')">
                <template slot-scope="scope">
                <kt-button icon="fa fa-edit" :label="$t('action.edit')" perms="car:brand:edit" @click="handleEdit(scope.row)"/>
                <kt-button label="车型" perms="car:two:brand:view" type="primary" @click="toArctic(scope.row)"/>
                <kt-button icon="fa fa-trash" :label="$t('action.delete')" perms="car:brand:delete" type="danger" @click="handleDelete(scope.row)"/>
                </template>
            </el-table-column>
		</el-table>
		<ul id="zimu">
			<li v-for="i in 26" :key="i" @click.stop="zimu(String.fromCharCode((64+i)))">{{String.fromCharCode((64+i))}}</li>
		</ul>
		<!--新增编辑界面-->
		<el-dialog :title="operation?'新增':'编辑'" :modal="false" :visible.sync="dialogVisible" :close-on-click-modal="false">
			<el-form :model="dataForm" label-width="80px" ref="dataForm" size="small"
				label-position="right" style="overflow: hidden">
				<!-- 新增内容 -->

			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button size="small" @click.native="dialogVisible = false">{{$t('action.cancel')}}</el-button>
				<el-button size="small" type="primary" @click.native="submitForm" :loading="editLoading">{{$t('action.submit')}}</el-button>
			</div>
		</el-dialog>
	</div>
</template>
<script>
import KtButton from "@/views/Core/KtButton"
import filterTool from "@/components/filterTool"
import { hasPermission } from '@/permission/index.js'
import axios from 'axios'
export default {
	components:{
		KtButton,
		filterTool
	},
	data() {
		return {
			filters: {
				label: ''
			},
			columns: [],
			filterColumns: [],
			tableDdata: [],
			loading: false,
			operation: false, // true:新增, false:编辑
			dialogVisible: false, // 新增编辑界面是否显示
			editLoading: false,
			dataForm: {
				name: '',
				initial: '',
				logo: '',
				depth: 1,
			},
			all: []
        }
	},
	methods: {
		// 查找数据
		findPage(){
			this.loading = true
			this.$api.car.findAll().then(res=>{
				this.tableDdata = res.data
				this.all = this.tableDdata
                this.loading = false
            }).then(()=>{
                let imgs = document.querySelectorAll('.carLogo')
                for(let i = 0;i < imgs.length;i++){
					let max = 0
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
                        if(max > 3){ // 允许失败次数
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
		// 显示新增
		handleAdd(){
			this.dialogVisible = true
			this.operation = true
			this.dataForm = {
				name: '',
				initial: '',
				logo: '',
				depth: 1,
			}
		},
		// 显示编辑
		handleEdit(row){
			this.dialogVisible = true
			this.operation = false
			this.dataForm = Object.assign({}, row)
		},
		// 删除
		handleDelete(){
			console.log(this.dataForm)
		},
		// 初始化列表
        initColumns: function () {
            this.columns = [
                {prop:"initial", label:"首字母", width: 100, minWidth:0, sortable: true},
                {prop:"id", label:"ID", width:80, minWidth: 0},
                {prop:"name", label:"名称", minWidth:120},
                {prop:"logo", label:"LOGO", minWidth: 200}
            ]
            this.filterColumns = JSON.parse(JSON.stringify(this.columns));
        },
		// 设置过滤
		setColumns(data){
			this.filterColumns = data;
		},
		// 提交表单
		submitForm(){

		},
		// 页面跳转
		toArctic(row){
			this.$router.push(`/car/arctic?id=${row.id}`)
		},
		// 字母筛选
		zimu(a){
			this.tableDdata = this.all.filter(i=>i.initial == a)
		},
		// 图片放大
		fangda(a){
			console.log(a)
		}
	},
	mounted() {
		this.initColumns()
		this.findPage()
    },
    computed:{

    }
}
</script>
<style scoped>
>>>.btnbox .cell {
	word-spacing: -3px;
}
</style>
<style scoped lang="scss">
.carLogo{
    display:block;
    margin:auto;
    height: 65px;
}
</style>
<style lang="scss">
#zimu{
	display: flex;
	justify-content: center;
	margin-top: 20px;
	color: #999;
	flex-wrap: wrap;
	li{
		margin: 10px;
		font-family: Arial, Helvetica, sans-serif;
		font-weight: 600;
		cursor: pointer;
		&:hover{
			color: #000
		}
	}
}
</style>