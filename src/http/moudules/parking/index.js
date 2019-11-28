import axios from '../../axios'

/*
 * 停车场查询模块
 */

// 停车场查询
export const findPage = data => {
    return axios({
        url: '/back/parkingInfo/findPage',
        method: 'post',
        data
    })
}

// 停车场查询记录
export const recordfindPage = data => {
    return axios({
        url: '/back/parkingRecord/findPage',
        method: 'post',
        data
    })
}