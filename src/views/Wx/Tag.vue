<template>
    <div class="container">
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
			<!-- v-if="Object.keys(activeData).length > 0" -->
			<div id="editBox">
				<h5>标签编辑</h5>
				<el-form ref="form" :model="activeData" label-width="80px" size="small">
					<el-form-item label="标签名称" prop="name">
						<el-input v-model="activeDataName" :disabled="!activeData.id"></el-input>
						<p style="text-align: left">最多 10 个字符(汉字两个字符)</p>
					</el-form-item>
				</el-form>
				<div v-if="activeData.id">
					<el-button size="small" @click.native="reBtn">重置</el-button>
					<kt-button perms="wx/tag/delete" size="small" type="danger" @click.native="delBtn" :loading="editLoading" label="删除"></kt-button>
					<kt-button perms="wx/tag/edit" size="small" type="primary" :loading="editLoading" @click.native="saveBtn" label="保存"></kt-button>
				</div>
			</div>
		</div>
    </div>
</template>
<script>
import axios from 'axios'
import KtButton from "@/views/Core/KtButton"
import { hasPermission } from '@/permission/index.js'
export default {
	components:{
		KtButton
	},
	data() {
		return {
			loading: false,
			editLoading: false,
			tableData: [],
			cur: {},
			activeData: {
				name: '请选择标签'
			},
        }
	},
	methods: {
		findTableData(){
            this.loading = true;
            axios.get('/http://localhost:8010/wxfans/sorter/').then(res=>{
				console.log(res)
                this.tableData = res.data.data[0].children
				this.loading = false
            })
        },
		openDetails(val){
			if(this.cur.id === val.id){
				return
			}
			this.cur = val
			console.log(val)
			this.activeData = Object.assign({}, val)
			this.reActiveData = Object.assign({}, this.activeData)
		},
		getByteLen(val) {
            var len = 0;
            let res = '';
            for (var i = 0; i < val.length; i++) {
                var a = val.charAt(i);
                if (a.match(/[^\x00-\xff]/ig) != null) {
                    if(len >= 9){
                        break
                    }
                    len += 2;
                }
                else {
                    if(len >= 10){
                        break
                    }
                    len += 1;
                }
                res += val[i]
            }
            return res;
		},
		hasPerms: function (perms) {
            // 根据权限标识和外部指示状态进行权限判断
            return hasPermission(perms) & !this.disabled
		},
		delBtn(){
            console.log('删除菜单');
		},
		reBtn(){
            console.log('重置修改')
            this.activeData = Object.assign({}, this.reActiveData)
        },
		saveBtn(){
			console.log('保存菜单')
			this.$confirm('确认保存吗？', '提示', {}).then(()=>{
                this.editLoading = true
				this.tableData.forEach(i => {
					i.id === this.activeData.id?i = Object.assign(i, this.activeData):''
				});
				this.reActiveData = Object.assign({}, this.activeData)
            }).then(()=>{
				this.editLoading = false
			})
		}
	},
	mounted() {
		this.findTableData();
    },
    computed:{
        activeDataName:{
            get(){
                return this.activeData.name
            },
            set(a){
                let res = this.getByteLen(a)
                this.activeData.name = res
            }
        }
    }
}
</script>
<style scoped lang="scss">
.container{
	display: flex;
	padding: 30px 0 80px;
	position: relative;
	.el-table::before{
		display: none
	}
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
#editBox{
	background: #fcfcfc;
	box-sizing: border-box;
	height: 100%;
	min-width: 300px;
	padding: 20px;
	h5{
		font-size: 18px;
		font-weight: normal;
		font-family: '黑体';
		line-height: 26px;
		padding-bottom: 15px;
		margin-bottom: 25px;
		border-bottom: 1px solid #eee;
	}
}
</style>
<style scoped>
#tab1 >>> .el-table__header-wrapper{
    display: none;
}
</style>