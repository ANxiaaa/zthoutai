<template>
    <div class="container">
        <div class="phone" v-if="hasPerms('wx/wxMenu/view')">
            <div class="foot">
                <div class="btnbox" v-for="(i, index) in btnData" :key="index" @click.stop="changeBtn(index, btnData, i)" :class="{btnActive:i.focus}">
                    <el-button>{{i.name}}</el-button>
                    <div class="child" v-if="i.focus">
                        <el-button v-for="(a, childIndex) in i.children" :key="a.childId" :class="{childFocus: a.focus}" @click.stop="changeBtn(childIndex, i.children, a)">{{a.name}}</el-button>
                        <el-button style="font-size: 20px;" class="addBtn" @click.stop="addChild(i.children, i.btnId)" v-if="i.children.length < 5" v-show="hasPerms('wx/wxMenu/add')">+</el-button>
                    </div>
                </div>
                <kt-button perms="wx/wxMenu/add" class="btnbox addBtn" v-if="btnData.length < 3" @click="addBtn" label="添加菜单" icon="iconfont icon-huazhuangshui">
                </kt-button>
            </div>
        </div>
        <div id="editBox" v-if="Object.keys(activeData).length > 0">
            <h5>菜单编辑</h5>
            <el-form ref="form" :model="activeData" label-width="80px" size="small">
                <el-form-item label="菜单名称" prop="name">
                    <el-input v-model="activeDataName"></el-input>
                    <p style="text-align: left">最多 8 个字符(汉字两个字符)</p>
                </el-form-item>
            </el-form>
            <div>
                <el-button size="small" @click.native="reBtn">重置</el-button>
                <kt-button perms="wx/wxMenu/delete" size="small" type="danger" @click.native="delBtn" :loading="editLoading" label="删除"></kt-button>
                <kt-button perms="wx/wxMenu/edit" size="small" type="primary" :loading="editLoading" @click.native="saveBtn" label="保存"></kt-button>
            </div>
        </div>
    </div>
</template>
<script>
import KtButton from "@/views/Core/KtButton"
import { hasPermission } from '@/permission/index.js'
export default {
	components:{
        KtButton
	},
	data() {
		return {
            btnData: [],
            activeData: {},
            editLoading: false,
            reActiveData: {},
        }
	},
	methods: {
        focusBtn(index, arr){
            console.log('改变聚焦')
            let a = index;
            arr = arr || this.btnData;
            arr.forEach(i=>{
                i.focus = false
                if(i.children){
                    i.children.forEach(c => {
                        c.focus = false
                    })
                }
            })
            if (index === undefined){
                a = arr.length - 1
            }
            arr[a].focus = true
        },
        addBtn(){
            console.log('添加菜单')
            this.btnData.push({
                name: '自定义菜单',
                focus: false,
                btnId: this.btnData.length,
                children: []
            })
            if(Object.keys(this.activeData).length == 0){
                this.focusBtn();
            }
        },
        addChild(i, id){
            console.log('添加子菜单')
            i.push({
                name: '自定义菜单',
                focus: false,
                childId: i.length,
                parentId: id
            })
        },
        changeBtn(index, arr, data){
            console.log('改变选中')
            this.focusBtn(index, arr)
            this.activeData = Object.assign({}, data)
            this.reActiveData = Object.assign({}, this.activeData)
        },
        saveBtn(){
            console.log('保存菜单')
            this.$confirm('确认保存吗？', '提示', {}).then(()=>{
                this.editLoading = true
                this.activeData.parentId === undefined?this.btnData.forEach(i=>i.btnId == this.activeData.btnId?this.btnData[this.activeData.btnId]=Object.assign(this.btnData[this.activeData.btnId], this.activeData):''):this.btnData.forEach(i=>this.activeData.parentId === i.btnId?i.children[this.activeData.childId] = Object.assign(i.children[this.activeData.childId], this.activeData):'')
                this.reActiveData = Object.assign({}, this.activeData)
            }).then(()=>{
                this.editLoading = false
            })
        },
        delBtn(){
            console.log('删除菜单');
        },
        reBtn(){
            console.log('重置修改')
            this.activeData = Object.assign({}, this.reActiveData)
        },
        getByteLen(val) {
            var len = 0;
            let res = '';
            for (var i = 0; i < val.length; i++) {
                var a = val.charAt(i);
                if (a.match(/[^\x00-\xff]/ig) != null) {
                    if(len >= 7){
                        break
                    }
                    len += 2;
                }
                else {
                    if(len >= 8){
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
        }
	},
	mounted() {

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
    .phone{
        margin: 70px 30px 0 45px;
        width: 317px;
        height: 580px;
        border: 1px solid #ececec;
        background: url(../../assets/mvh.png) no-repeat;
        background-size: contain;
        position: relative;
        float: left;
        .foot{
            height: 50px;
            border-top: 1px solid #ececec;
            padding-left: 43px;
            position: absolute;
            bottom: 0;
            width:100%;
            box-sizing: border-box;
            background: url(../../assets/mvf.png) no-repeat;
            background-size: 100% 100%;
            display: flex;
            .btnbox{
                flex:1;
                margin: -1px 0 -1px -1px;
                position: relative;
            }
            .btnbox:hover{
                z-index: 2
            }
            .btnbox.btnActive,.childFocus{
                background-color: #e8f3f5;
            }
            button{
                padding: 0;
                background:none;
                font-size: 12px;
                height: 100%;
                flex: 1;
                width:100%;
                border-radius: 0;
                margin: 0;
            }
            .child{
                position: absolute;
                bottom: 140%;
                border: 1px solid #eaeaea ;
                width: 100%;
                box-sizing: border-box;
                background: #f3f3f3;
            }
            .child:after{
                content: '';
                display: block;
                height: 0;
                width: 0;
                border: 6px solid transparent;
                border-bottom-width: 0;
                border-top-color: #f3f3f3;
                border-top-style: solid;
                bottom: -6px;
                position: absolute;
                left: 0;
                right: 0;
                margin: auto;
            }
            .child button{
                height: 42px;
                border: none;
                border-top: 1px solid #eaeaea;
            }
        }
    }
    #editBox{
        position: absolute;
        top: 76px;
        background: #fcfcfc;
        border: 1px solid #eee;
        box-sizing: border-box;
        right: 50px;
        height: 580px;
        left: 450px;
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
    .btnbox{
        height: auto !important;
    }
    .btnbox >>> i {
        vertical-align: text-bottom !important;
    }
</style>