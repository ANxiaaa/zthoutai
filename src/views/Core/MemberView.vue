<template>
    <div id="memberView">
        <el-collapse accordion>
            <el-collapse-item title="会员信息" name="1">
                <p v-for="(value , key , index) in memberInfo" :key="index">
                    <span>{{value}}</span>
                    <span>123</span>
                </p>
                <div style="clear: both;height: 10px"></div>
            </el-collapse-item>
            <el-collapse-item title="车辆信息" name="2">
                <p v-for="(value , key , index) in memberDrivingPermit" :key="index">
                    <span>{{value}}</span>
                    <span>123</span>
                </p>
                <div style="clear: both;height: 10px"></div>
            </el-collapse-item>
        </el-collapse>
    </div>
</template>
<script>
export default {
    name: 'MemberView',
    props: {
        userData: {
            type: Object,
            default: {}
        }
    },
    data() {
        return {
            memberInfo: {
                id: 'ID',
                wxOpenid: '微信Openid',
                phone: '手机号',
                account: '帐号',
                password: '密码',
                nickName: '昵称',
                headImg: '头像',
                province: '省份',
                city: '城市',
                sign: '签名',
                authentication: '是否认证',
                referralCode: '推荐码',
                source: '注册来源',
                inviter: '邀请人id',
                createDate: '创建时间',
                status: '状态',
                lastLoginDate: '最后登录时间',
                defaultCarInfoId: '用户默认车辆ID',
            },
            memberDrivingPermit: {
                id: 'ID',
                memberId: '会员ID',
                carNumber: '车牌号',
                owner: '所有人',
                carBrand: '品牌型号',
                frameNumber: '车辆识别码',
                engineNumber: '发动机号',
                regDate: '注册日期',
                issueDate: '发证日期',
                carType: '车辆类型',
                address: '住址',
                useNature: '使用性质',
                createDate: '创建时间',
                lastEditDate: '最后修改时间',
                enable: '是否可用'
            }
        }
    },
    methods: {
        
    },
    mounted() {
    }
}
</script>
<style scoped lang="scss">
#memberView{
    text-align: left;
    p{
        float: left;
        width: 50%;
        line-height: 30px;
        display: flex;
        span:first-child{
            width: 170px;
            text-indent: 2em
        }
    }
}
</style>