<template>
    <div id="arcticView">
        <div class="car">
            <img :src="carData.logo" style="float: right" alt="">
            <p v-for="(i, index) in field" :key="index" v-if="!i.list && !i.logo">
                <span class="name">{{i[Object.keys(i)]}} :</span>
                <span>{{carData[Object.keys(i)] || '-'}}</span>
            </p>
        </div>
        <div id="main">
            <el-collapse @change="handleChange">
                <el-collapse-item title="车体颜色">
                    <p class="showclor" v-for="i in carData.body.color.split('|')" :key="i">
                        <span>{{i.split(',')[0]}}</span>
                        <span :style="`width: 1rem;background: ${i.split(',')[1]}`"></span>
                    </p>
                </el-collapse-item>
                <el-collapse-item v-for="(i, index) in field" v-if="i.list" :key="index" :title="i[Object.keys(i)[0]]" :name="index">
                    <p v-for="(a, index) in i[Object.keys(i)[1]]" :key="index"  v-if="Object.keys(a)[0] != 'color'">
                        <span class="name">{{a[Object.keys(a)]}}</span>
                        <span>{{aaaa(carData[Object.keys(i)[0]],[Object.keys(a)[0]]) || '-'}}</span>
                    </p>
                    <div style="height: 10px;clear: both;"></div>
                </el-collapse-item>
            </el-collapse>
        </div>
    </div>
</template>
<script>
export default {
    name: 'ArcticView',
    props: {
        carData: {
            type: Object,
            default: {}
        }
    },
    data() {
        return {
            field:[
                {id: 'ID'},
                {name: '名称'},
                {initial: '首字母'},
                {parentid: '上级ID'},
                {logo: 'LOGO'},
                {price: '官方指导价'},
                {yeartype: '年款'},
                {listDate: '生产日期'},
                {productionstate: '生产状态'},
                {salestate: '销售状态'},
                {sizetype: '尺寸类型'},
                {depth: '深度'}, //1品牌 2子公司 3车型 4具体车型
                {basic: '基本信息', list: [
                    {price: '厂家指导价'},
                    {saleprice: '商家报价'},
                    {warrantypolicy: '保修政策'},
                    {vechiletax: '车船税减免'},
                    {displacement: '排量(L)'},
                    {gearbox: '变速箱'},
                    {gearnum: '变速箱档数'},
                    {geartype: '变速箱类型'},
                    {comfuelconsumption: '综合工况油耗(L/100km)'},
                    {userfuelconsumption: '网友油耗(L/100km)'},
                    {officialaccelerationtime100: '官方0-100公里加速时间(s)'},
                    {testaccelerationtime100: '实测0-100公里加速时间(s)'},
                    {maxspeed: '最高车速(km/h)'},
                    {seatnum: '乘员人数（区间）(个)'}
                ]},
                {body: '车体', list: [
                    {color: '车身颜色'},
                    {len: '车长(mm)'},
                    {width: '车宽(mm)'},
                    {height: '车高(mm)'},
                    {wheelbase: '轴距(mm)'},
                    {fronttrack: '前轮距(mm)'},
                    {reartrack: '后轮距(mm)'},
                    {weight: '整备质量(kg)'},
                    {fullweight: '满载质量(kg)'},
                    {mingroundclearance: '最小离地间隙(mm)'},
                    {approachangle: '接近角(°)'},
                    {departureangle: '离去角(°)'},
                    {luggagevolume: '行李厢容积(L)'},
                    {luggagemode: '行李厢盖开合方式'},
                    {luggageopenmode: '行李厢打开方式'},
                    {inductionluggage: '感应行李厢'},
                    {doornum: '车门数(个)'},
                    {tooftype: '车顶型式'},
                    {hoodtype: '车篷型式'},
                    {roofluggagerack: '车顶行李箱架'},
                    {sportpackage: '运动外观套件'}
                ]},
                {engine: '发动机', list: [
                    {position: '发动机位置'},
                    {model: '发动机型号'},
                    {displacement: '排量(L)'},
                    {displacementml: '排量(mL)'},
                    {intakeform: '进气形式'},
                    {cylinderarrangetype: '气缸排列型式'},
                    {cylindernum: '气缸数(个)'},
                    {valvetrain: '每缸气门数(个)'},
                    {valvestructure: '气门结构'},
                    {compressionratio: '压缩比'},
                    {bore: '缸径(mm)'},
                    {stroke: '行程(mm)'},
                    {maxhorsepower: '最大马力(Ps)'},
                    {maxpower: '最大功率(kW)'},
                    {maxpowerspeed: '最大功率转速(rpm)'},
                    {maxtorque: '最大扭矩(Nm)'},
                    {maxtorquespeed: '最大扭矩转速(rpm)'},
                    {fueltype: '燃料类型'},
                    {fuelgrade: '燃油标号'},
                    {fuelmethod: '供油方式'},
                    {fueltankcapacity: '燃油箱容积(L)'},
                    {cylinderheadmaterial: '缸盖材料'},
                    {cylinderbodymaterial: '缸体材料'},
                    {environmentalstandards: '环保标准'},
                    {startstopsystem: '启停系统'}
                ]},
                {gearbox: '变速箱', list: [
                    {gearbox: '变速箱'},
                    {gearnum: '变速箱档数'},
                    {geartype: '变速箱类型'},
                    {shiftpaddles: '换挡拨片'}
                ]},
                {chassisbrake: '底盘制动', list: [
                    {bodystructure: '车体结构'},
                    {powersteering: '转向助力'},
                    {frontbraketype: '前制动类型'},
                    {rearbraketype: '后制动类型'},
                    {parkingbraketype: '驻车制动类型'},
                    {drivemode: '驱动方式'},
                    {airsuspension: '空气悬挂'},
                    {adjustablesuspension: '可调悬挂'},
                    {frontsuspensiontype: '前悬挂类型'},
                    {rearsuspensiontype: '后悬挂类型'},
                    {centerdifferentiallock: '中央差速器锁'}
                ]},
                {safe: '安全配置', list: [
                    {airbagdrivingposition: '驾驶位安全气囊'},
                    {airbagfrontpassenger: '副驾驶位安全气囊'},
                    {airbagfrontside: '前排侧安全气囊'},
                    {airbagfronthead: '前排头部气囊(气帘)'},
                    {airbagknee: '膝部气囊'},
                    {airbagrearside: '后排侧安全气囊'},
                    {airbagrearhead: '后排头部气囊(气帘)'},
                    {safetybeltprompt: '安全带未系提示'},
                    {safetybeltlimiting: '安全带限力功能'},
                    {safetybeltpretightening: '安全带预收紧功能'},
                    {frontsafetybeltadjustment: '前安全带调节'},
                    {rearsafetybelt: '后排安全带'},
                    {tirepressuremonitoring: '胎压监测装置'},
                    {zeropressurecontinued: '零压续行(零胎压继续行驶)'},
                    {centrallocking: '中控门锁'},
                    {childlock: '儿童锁'},
                    {remotekey: '遥控钥匙'},
                    {keylessentry: '无钥匙进入系统'},
                    {keylessstart: '无钥匙启动系统'},
                    {engineantitheft: '发动机防盗保险'}
                ]},
                {wheel: '车轮', list: [
                    {fronttiresize: '前轮胎规格'},
                    {reartiresize: '后轮胎规格'},
                    {sparetiretype: '备胎类型'},
                    {hubmaterial: '轮毂材料'}
                ]},
                {drivingauxiliary: '行车辅助', list: [
                    {abs: '刹车防抱死(ABS)'},
                    {ebd: '电子制动力分配系统(EBD)'},
                    {brakeassist: '刹车辅助(EBA/BAS/BA/EVA等)'},
                    {tractioncontrol: '牵引力控制(ASR/TCS/TRC/ATC等)'},
                    {esp: '动态稳定控制系统（ESP'},
                    {eps: '随速助力转向调节(EPS)'},
                    {automaticparking: '自动驻车'},
                    {hillstartassist: '上坡辅助'},
                    {hilldescent: '陡坡缓降'},
                    {frontparkingradar: '泊车雷达(车前)'},
                    {reversingradar: '倒车雷达(车后)'},
                    {reverseimage: '倒车影像'},
                    {panoramiccamera: '全景摄像头'},
                    {cruisecontrol: '定速巡航'},
                    {adaptivecruise: '自适应巡航'},
                    {gps: 'GPS导航系统'},
                    {automaticparkingintoplace: '自动泊车入位'},
                    {ldws: '车道偏离预警系统'},
                    {activebraking: '主动刹车/主动安全系统'},
                    {integralactivesteering: '整体主动转向系统'},
                    {nightvisionsystem: '夜视系统'},
                    {blindspotdetection: '盲点检测'},
                ]},
                {doormirror: '门窗/后视镜', list: [
                    {openstyle: '开门方式'},
                    {electricwindow: '电动车窗'},
                    {uvinterceptingglass: '防紫外线/隔热玻璃'},
                    {privacyglass: '隐私玻璃'},
                    {antipinchwindow: '电动窗防夹功能'},
                    {skylightopeningmode: '天窗开合方式'},
                    {skylightstype: '天窗型式'},
                    {rearwindowsunshade: '后窗遮阳帘'},
                    {rearsidesunshade: '后排侧遮阳帘'},
                    {rearwiper: '后雨刷器'},
                    {sensingwiper: '感应雨刷'},
                    {electricpulldoor: '电动吸合门'},
                    {rearmirrorwithturnlamp: '后视镜带侧转向灯'},
                    {externalmirrormemory: '外后视镜记忆功能'},
                    {externalmirrorheating: '外后视镜加热功能'},
                    {externalmirrorfolding: '外后视镜电动折叠功能'},
                    {externalmirroradjustment: '外后视镜电动调节'},
                    {rearviewmirrorantiglare: '内后视镜防眩目功能'},
                    {sunvisormirror: '遮阳板化妆镜'}
                ]},
                {light: '灯光', list: [
                    {headlighttype: '前大灯类型'},
                    {optionalheadlighttype: '选配前大灯类型'},
                    {headlightautomaticopen: '前大灯自动开闭'},
                    {headlightautomaticclean: '前大灯自动清洗功能'},
                    {headlightdelayoff: '前大灯延时关闭'},
                    {headlightdynamicsteering: '前大灯随动转向'},
                    {headlightilluminationadjustment: '前大灯照射范围调整'},
                    {headlightdimming: '会车前灯防眩目功能'},
                    {frontfoglight: '前雾灯'},
                    {readinglight: '阅读灯'},
                    {interiorairlight: '车内氛围灯'},
                    {daytimerunninglight: '日间行车灯'},
                    {ledtaillight: 'LED尾灯'},
                    {lightsteeringassist: '转向辅助灯'}
                ]},
                {internalconfig: '内部配置', list: [
                    {steeringwheelbeforeadjustment: '方向盘前后调节'},
                    {steeringwheelupadjustment: '方向盘上下调节'},
                    {steeringwheeladjustmentmode: '方向盘调节方式'},
                    {steeringwheelmemory: '方向盘记忆设置'},
                    {steeringwheelmaterial: '方向盘表面材料'},
                    {steeringwheelmultifunction: '多功能方向盘'},
                    {steeringwheelheating: '方向盘加热'},
                    {computerscreen: '行车电脑显示屏'},
                    {huddisplay: 'HUD抬头数字显示'},
                    {interiorcolor: '内饰颜色'},
                    {rearcupholder: '后排杯架'},
                    {supplyvoltage: '车内电源电压'}
                ]},
                {seat: '座椅', list: [
                    {sportseat: '运动座椅'},
                    {seatmaterial: '座椅材料'},
                    {seatheightadjustment: '座椅高低调节'},
                    {driverseatadjustmentmode: '驾驶座座椅调节方式'},
                    {auxiliaryseatadjustmentmode: '副驾驶座椅调节方式'},
                    {driverseatlumbarsupportadjustment: '驾驶座腰部支撑调节'},
                    {driverseatshouldersupportadjustment: '驾驶座肩部支撑调节'},
                    {frontseatheadrestadjustment: '前座椅头枕调节'},
                    {rearseatadjustmentmode: '后排座椅调节方式'},
                    {rearseatreclineproportion: '后排座位放倒比例'},
                    {rearseatangleadjustment: '后排座椅角度调节'},
                    {frontseatcenterarmrest: '前座中央扶手'},
                    {rearseatcenterarmrest: '后座中央扶手'},
                    {seatventilation: '座椅通风'},
                    {seatheating: '座椅加热'},
                    {seatmassage: '座椅按摩功能'},
                    {electricseatmemory: '电动座椅记忆'},
                    {childseatfixdevice: '儿童安全座椅固定装置'},
                    {thirdrowseat: '第三排座椅'}
                ]},
                {entcom: '娱乐通讯', list: [
                    {locationservice: '定位互动服务'},
                    {bluetooth: '蓝牙系统'},
                    {externalaudiointerface: '外接音源接口'},
                    {builtinharddisk: '内置硬盘'},
                    {cartv: '车载电视'},
                    {speakernum: '扬声器数量'},
                    {audiobrand: '音响品牌'},
                    {dvd: 'DVD'},
                    {cd: 'CD'},
                    {consolelcdscreen: '中控台液晶屏'},
                    {rearlcdscreen: '后排液晶屏'}
                ]},
                {aircondrefrigerator: '空调/冰箱', list: [
                    {airconditioningcontrolmode: '空调控制方式'},
                    {tempzonecontrol: '温度分区控制'},
                    {rearairconditioning: '后排独立空调'},
                    {reardischargeoutlet: '后排出风口'},
                    {airconditioning: '空气调节/花粉过滤'},
                    {airpurifyingdevice: '车内空气净化装置'},
                    {carrefrigerator: '车载冰箱'},
                ]},
                {actualtest: '实际测试', list: [
                    {accelerationtime100: '加速时间（0—100km/h）(s)'},
                    {brakingdistance: '制动距离（100—0km/h）(m)'},
                ]},
            ]
        }
    },
    methods: {
        aaaa(a,b,c){
            if(!a){
                return
            }
            return a[b[0]]
            // return a
        },
        handleChange(){
        },
        activeNames(){},
        change(){}
    },
    mounted() {
    }
}
</script>
<style scoped lang="scss">
#arcticView{
    height: 1000px;
    text-align: left;
    .showclor{
        display: flex;
        justify-content: space-between;
        padding-right: 20px;
        box-sizing: border-box;
    }
    .car{
        margin-bottom: 30px
    }
    p{
        line-height: 30px
    }
    .name{
        width: 150px;
        display: inline-block;
    }
}
#main{
    .name{
        width: 250px;
    }
    p{
        width: 50%;
        float: left;
    }
}
.el-table::before{
    display: none
}
</style>