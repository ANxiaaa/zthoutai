/*
 * 接口统一集成模块
 */
import * as login from './moudules/login'
import * as user from './moudules/user'
import * as dept from './moudules/dept'
import * as role from './moudules/role'
import * as menu from './moudules/menu'
import * as dict from './moudules/dict'
import * as log from './moudules/log'
import * as sysMail from './moudules/mail'
import * as backMenu from './moudules/back/menu'
import * as car from './moudules/car/car'
import * as member from './moudules/car/member'
import * as sms from './moudules/sms/sms'
import * as illegalManagerBureau from './moudules/illegal/managerBureau'
import * as illegalLicensePlateType from './moudules/illegal/licensePlateType'
import * as illegalRecord from './moudules/illegal/record'
import * as limitRowCity from './moudules/limit/limitRowCity'
import * as newsConsultation from './moudules/back/news/consultation'
import * as newsNotice from './moudules/back/news/notice'
import * as parking from './moudules/parking'
import * as oli from './moudules/oli'
import * as specialCar from './moudules/specialCar'



// 默认全部导出
export default {
    login,
    user,
    dept,
    role,
    menu,
    dict,
    log,
    sysMail,
    backMenu,
    car,
    member,
    sms,
    illegalManagerBureau,
    illegalLicensePlateType,
    illegalRecord,
    limitRowCity,
    newsConsultation, newsNotice,
    parking,
    oli,
    specialCar
}