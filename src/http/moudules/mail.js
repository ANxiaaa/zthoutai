import axios from '../axios'

/* 
 * 邮件管理模块
 */

// 保存
export const save = (data) => {
    return axios({
        url: '/admin/sysMail/save',
        method: 'post',
        data
    })
}
// 删除
export const batchDelete = (data) => {
    return axios({
        url: '/admin/sysMail/delete',
        method: 'post',
        data
    })
}
// 分页查询
export const findPage = (data) => {
    return axios({
        url: '/admin/sysMail/findPage',
        method: 'post',
        data
    })
}
