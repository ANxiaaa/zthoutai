import axios from '../../axios'

/*
 * 加油站查询模块
 */

// 加油站查询
export const findPage = data => {
    return axios({
        url: '/back/oilstationInfo/findPage',
        method: 'post',
        data
    })
}

// 加油站查询记录
export const recordfindPage = data => {
    return axios({
        url: '/back/oilstationRecord/findPage',
        method: 'post',
        data
    })
}