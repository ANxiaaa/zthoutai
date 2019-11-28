import axios from '@/http/axios'

/*
 * 咨询管理模块
 */

 // 保存
export const save = (data) => {
    return axios({
        url: '/back/newsConsultation/save',
        method: 'post',
        data
    })
}
// 删除
export const batchDelete = (data) => {
    return axios({
        url: '/back/newsConsultation/delete',
        method: 'post',
        data
    })
}
// 分页查询
export const findPage = data => {
    return axios({
        url: '/back/newsConsultation/findPage',
        method: 'post',
        data
    })
}

