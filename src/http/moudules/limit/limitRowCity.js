import axios from '../../axios'

/*
 * 城市列表查询模块
 */

// 分页查询
export const findPage = data => {
    return axios({
        url: '/back/limitRowCity/findPage',
        method: 'post',
        data
    })
}

// 同步城市
export const syn = () => {
    return axios({
        url: '/back/limitRowCity/synchroData',
        method: 'get'
    })
}

// 根据城市查询限行
export const findByCityAndDate = params => {
    return axios({
        url: '/back/limitRowPlan/findByCityAndDate',
        method: 'post',
        params
    })
}


// 查询记录分页查询
export const recordFindPage = data => {
    return axios({
        url: '/back/limitRowRecord/findPage',
        method: 'post',
        data
    })
}