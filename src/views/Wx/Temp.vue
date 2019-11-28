<template>
    <div class="container">
		<!--工具栏-->
		<div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;">
			<el-form @submit.native.prevent :inline="true" :model="filters" size="small">
				<el-form-item>
					<el-input v-model="filters.label" placeholder="名称"></el-input>
				</el-form-item>
				<el-form-item>
					<kt-button icon="fa fa-search" :label="$t('action.search')" perms="wx:temp:view" type="primary" @click="findPage(null)"/>
				</el-form-item>
				<el-form-item>
					<kt-button icon="fa fa-plus" :label="$t('action.add')" perms="wx:temp:add" type="primary" @click="handleAdd" />
				</el-form-item>
			</el-form>
		</div>
		<filter-tool :columns="columns" @setColumns="setColumns" @findPage="findPage(null)" :showexcel="false"></filter-tool>
		<!--表格内容栏-->
		<el-table height="600" :data="tableDdata" stripe size="mini" style="width: 100%;" row-key="id" ref="tab" border
		v-loading="loading" :element-loading-text="$t('action.loading')">
		<el-table-column v-for="i in filterColumns" :key="i.prop" sortable :formatter="i.formatter"
			:prop="i.prop" :minWidth="i.minWidth" :label="i.label" :width="i.width" :header-align="i.align" :align="i.align">
		</el-table-column>
		<el-table-column fixed="right"
			header-align="center" align="center" width="185" :label="$t('action.operation')">
			<template slot-scope="scope">
			<kt-button icon="fa fa-edit" :label="$t('action.edit')" perms="wx:temp:edit" @click="handleEdit(scope.row)"/>
			<kt-button icon="fa fa-trash" :label="$t('action.delete')" perms="wx:temp:delete" type="danger" @click="handleDelete(scope.row)"/>
			</template>
		</el-table-column>
		</el-table>
		<!--新增编辑界面-->
		<el-dialog :title="operation?'新增':'编辑'" :modal="false" :visible.sync="dialogVisible" :close-on-click-modal="false">
			<el-form :model="dataForm" label-width="80px" ref="dataForm" size="small"
				label-position="right" style="overflow: hidden">
				<!-- 新增内容 -->
				<el-form-item label="模板编号" prop="num">
					<el-input v-model="dataForm.num" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="模板标题" prop="title">
					<el-input v-model="dataForm.title" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="模板类型" prop="type">
					<el-select v-model="dataForm.type" placeholder="请选择" style="width:100%;">
						<el-option
						v-for="item in typeName"
						:key="item.value"
						:label="item.name"
						:value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="一级行业" prop="first" style="width:45%;float:left">
					<el-input v-model="dataForm.first" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="二级行业" prop="second" style="width:45%;float:right">
					<el-input v-model="dataForm.second" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="详细内容" prop="content" style="clear:both" id="tempCon">
					<el-input type="textarea" v-model="dataForm.content" style=""></el-input>
				</el-form-item>
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
				num: '',
				title: '',
				type: '',
				first: '',
				second: '',
				content: '',
			},
			dataFormRules: {},
			typeName:[
				{name: '订单支付通知1', value: 1},
				{name: '订单支付通知2', value: 2},
				{name: '订单支付通知3', value: 3},
				{name: '订单支付通知4', value: 4},
				{name: '订单支付通知5', value: 5},
				{name: '订单支付通知6', value: 6},
				{name: '订单支付通知7', value: 7},
				{name: '订单支付通知8', value: 8}
			]
        }
	},
	methods: {
		// 查找数据
		findPage(){
			this.loading = true
			axios({
                url:'/http://localhost:8010/wxtemp/findTempData/',
                method:'get'
            }).then(res=>{
				console.log(res)
				this.tableDdata = res.data.data
				this.loading = false
            })
		},
		// 显示新增
		handleAdd(){
			this.dialogVisible = true
			this.operation = true
			this.dataForm = {
				num: '',
				title: '',
				type: 2,
				first: '',
				second: '',
				content: '',
			}
		},
		// 显示编辑
		handleEdit(row){
			this.dialogVisible = true
			this.operation = false
			console.log(row)
			this.dataForm = Object.assign({}, row)
		},
		// 删除
		handleDelete(){
			console.log(this.dataForm)
		},
		// 初始化列表
		initColumns: function () {
			this.columns = [
				{prop:"id", label:"ID", minWidth: 0, width: 60, align: 'center'},
				{prop:"num", label:"编号", minWidth: 100},
				{prop:"title", label:"标题", minWidth:100},
				{prop:"first", label:"第一行业", minWidth:100},
				{prop:"second", label:"第二行业", minWidth:100},
				{prop:"type", label:"消息类型", minWidth:100},
			]
			this.filterColumns = JSON.parse(JSON.stringify(this.columns));
			this.filterColumns.forEach(a=>{
				if(a.prop === 'type'){
					a.formatter = this.typeFormat
				}
			})
      	},
		//设置过滤
		setColumns(data){
			this.filterColumns = data;
			this.filterColumns.forEach(a=>{
				if(a.prop === 'type'){
					a.formatter = this.typeFormat
				}
			})
		},
		// 提交表单
		submitForm(){
			console.log(this.dataForm)
		},
		//格式化类型
		typeFormat(row, column, cellValue, index){
			let name;
			this.typeName.forEach(i=>{
				if(cellValue == i.value){
					name = i.name
				}
			})
			return name
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
<style scoped lang="scss">

</style>
<style scoped>
#tempCon >>> textarea{
	height: 130px;
	max-height: 380px
}
</style>