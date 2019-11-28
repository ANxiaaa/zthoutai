import axios from '../../axios'

/*
 * 短信模板管理
 */

// 按页数查询短信列表
export const findPage = data => {
    return axios({
        url: '/back/smsTemp/findPage',
        method: 'post',
        data
    })
}

// 获取短信配置
export const findSmsManager = () => {
    return axios({
        url: '/back/smsManager/findSmsManager',
        method: 'get'
    })
}

// 修改短信配置
export const save = data => {
    return axios({
        url: '/back/smsManager/save',
        method: 'post',
        data
    })
}

// 查询短信记录
export const record = data => {
    return axios({
        url: '/back/smsSendRecord/findPage',
        method: 'post',
        data
    })
}

// 短信黑名单查询
export const blacklist = data => {
    return axios({
        url: '/back/smsBlacklist/findPage',
        method: 'post',
        data
    })
}