import axios from '../axios'

/* 
 * 字典管理模块
 */

// 保存
export const save = (data) => {
    return axios({
        url: '/admin/dict/save',
        method: 'post',
        data
    })
}
// 删除
export const batchDelete = (data) => {
    return axios({
        url: '/admin/dict/delete',
        method: 'post',
        data
    })
}
// 分页查询
export const findPage = (data) => {
    return axios({
        url: '/admin/dict/findPage',
        method: 'post',
        data
    })
}
//获取字典树
export const findTree = () => {
    return axios({
        url: '/admin/dict/findTree',
        method: 'get'
    })
}