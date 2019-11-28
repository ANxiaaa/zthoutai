import axios from '@/http/axios'

/*
 * 通知管理模块
 */

 // 保存
export const save = (data) => {
    return axios({
        url: '/back/newsNotice/save',
        method: 'post',
        data
    })
}
// 删除
export const batchDelete = (data) => {
    return axios({
        url: '/back/newsNotice/delete',
        method: 'post',
        data
    })
}
// 分页查询
export const findPage = data => {
    return axios({
        url: '/back/newsNotice/findPage',
        method: 'post',
        data
    })
}
