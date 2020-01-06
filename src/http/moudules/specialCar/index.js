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

// 删除特价车可用标识
export const deleteData = id => {
    return axios({
        url: '/back/carSpecialInfo/delete',
        method: 'post',
        data: { id }
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
