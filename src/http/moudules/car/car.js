import axios from '../../axios'

/*
 * 车辆管理模块
 */

// 查找所有品牌
export const findAll = () => {
    return axios({
        url: '/back/carBrand/findAll',
        method: 'get'
    })
}

// 查询品牌下所有车型
export const findTypeByParentId = parentId => {
    return axios({
        url: '/back/carTwoBrand/findTypeByParentId',
        method: 'get',
        params: { parentId }
    })
}

// 查询车型下所有车辆
export const findCarByParentId = parentId => {
    return axios({
        url: '/back/carInfo/findCarByParentId',
        method: 'get',
        params: { parentId }
    })
}

// 查询车辆下详细信息
export const findByCarId = carId => {
    return axios({
        url: '/back/carInfoParameter/findByCarId',
        method: 'get',
        params: { carId }
    })
}