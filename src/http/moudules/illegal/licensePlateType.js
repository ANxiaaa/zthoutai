import axios from '../../axios'

/*
 * 违章查询管局查询模块
 */

// 分页查询
export const findPage = data => {
    return axios({
        url: '/back/illegalLicensePlateType/findPage',
        method: 'post',
        data
    })
}
export const syn = () => {
    return axios({
        url: '/back/illegalLicensePlateType/synchroData',
        method: 'get'
    })
}
