/**
 * 全局常量、方法封装模块
 * 通过原型挂载到Vue属性
 * 通过 this.Global 调用
 */

 // 后台管理系统服务器地址
//export const baseUrl = 'http://139.196.87.48:8001'
export const baseUrl = 'http://localhost:8010'
// export const baseUrl = 'http://39.98.253.42:8010'
 // 系统数据备份还原服务器地址
//export const backupBaseUrl = 'http://139.196.87.48:8002'
// export const backupBaseUrl = 'http://localhost:8002'

export default {
    baseUrl
    // ,
    // backupBaseUrl
}