import axios from '../../axios'

/*
 * 菜单管理模块
 */

 // 保存
export const save = (data) => {
    return axios({
        url: '/back/backMenu/save',
        method: 'post',
        data
    })
}
// 删除
export const batchDelete = (data) => {
    return axios({
        url: '/back/backMenu/delete',
        method: 'post',
        data
    })
}
// 分页查询
export const findTree = data => {
    return axios({
        url: '/back/backMenu/findTree',
        method: 'get',
        data
    })
}
// 获取类型
export const getType = data => {
    return axios({
        url: '/back/backMenu/getMenuType',
        method: 'post',
        data
    })
}
// 获取图标类名
export const getIcon = data => {
    return axios({
        url: '/back/pub/icon',
        method: 'post',
        data
    })
}