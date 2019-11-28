<template>
    <div>
        <el-button plain :icon="iconName" @click="iconChange" style="width:100%">{{!iconName? '选择图标' : ''}}</el-button>
        <el-card class="box-card" shadow="never" :style="iconStyle">
            <div v-for="(i,index) in iconData" :key="index" class="text item">
                <i class="iconfont" :class="i" @click="changeMenuIcon(i)"></i>
            </div>
        </el-card>
    </div>
</template>
<script>
export default {
    name:'icon-tool',
    components:{

    },
    props:['iconName'],
    data (){
        return {
            iconStyle:{
				opacity:0,
				height:0
			},
            iconFlag:false,
            iCon:''
        }
    },
    methods:{
        iconChange(){
			this.iconFlag = !this.iconFlag;
			if(this.iconFlag){
				this.iconStyle.opacity=1;
				this.iconStyle.height='300px';
			}else{
				this.hideIcon()
			}
		},
		hideIcon(){
			this.iconStyle.opacity=0;
			this.iconStyle.height=0;
		},
		changeMenuIcon(icon){
			this.iCon = 'iconfont ' + icon;
            this.$emit('changeIcon', this.iCon)
			this.hideIcon();
			this.iconFlag = !this.iconFlag;
        }
    },
    mounted(){
        this.iCon = this.iconName
    },
    computed:{
		iconData(){
			return this.$store.state.app.iconList
		}
	}
}
</script>
<style scoped>
>>> div.el-card__body{
	display: flex;
	flex-wrap: wrap;
	height:100%;
	overflow-y: auto;
	padding: 10px 43px;
	align-content: start;
}
>>> div.el-card__body .text{
	width: 50px ;
	height: 50px;
}
>>> div.el-card__body .text i{
	display: block;
	height: 100%;
	width: 100%;
	line-height: 50px;
	cursor: pointer;
	text-align: center;
	font-size: 25px
}
>>> div.el-card__body .text i:hover{
	background: #eee;
}
</style>

