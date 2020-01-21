import axios from '../../axios'

/*
 * 特价车模板管理
 */

// 按页数查询列表
export const findPage = data => {
    return axios({
        url: '/back/carSpecialInfo/findPage',
        method: 'post',
        data
    })
}

// 保存特价车
export const save = data => {
    return axios({
        url: '/back/carSpecialInfo/save',
        method: 'post',
        data
    })
}

// 推荐列表
export const getExtensionEnum = () => {
    return axios({
        url: '/back/carSpecialInfo/getExtensionEnum',
        method: 'get'
    })
}

// 删除特价车
export const deleteData = id => {
    return axios({
        url: '/back/carSpecialInfo/delete',
        method: 'post',
        params: { id }
    })
}

// 删除特价车图片
export const deleteImg = imgId => {
    return axios({
        url: '/back/carSpecialInfo/deleteImg',
        method: 'get',
        params: { imgId }
    })
}

// 根据主键查询特价车
export const findById = id => {
    return axios({
        url: '/back/carSpecialInfo/findById',
        method: 'get',
        params: { id }
    })
}

// 查询审核类型
export const getspecialStatusEnum = () => {
    return axios({
        url: '/back/carSpecialInfo/getspecialStatusEnum',
        method: 'get'
    })
}

// 审核成功特价车
export const audit = data => {
    return axios({
        url: '/back/carSpecialInfo/audit',
        method: 'post',
        data
    })
}

// 上架特价车
export const upper = id => {
    return axios({
        url: '/back/carSpecialInfo/upperShelf',
        method: 'post',
        params: { id }
    })
}

// 下架特价车
export const lower = id => {
    return axios({
        url: '/back/carSpecialInfo/lowerShelf',
        method: 'post',
        params: { id }
    })
}