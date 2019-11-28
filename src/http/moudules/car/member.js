import axios from '../../axios'

/*
 * 手机用户管理
 */

// 按页数查询用户列表
export const findPage = data => {
    return axios({
        url: '/member/memberInfo/findPage',
        method: 'post',
        data
    })
}

// 查询用户行驶证信息
export const findDrivingPermit = memberId => {
    return axios({
        url: '/member/memberDrivingPermit/findAll',
        method: 'post',
        params: { memberId }
    })
}

// 查询用户车辆信息
export const findCarInfo = memberId => {
    return axios({
        url: '/member/memberCarInfo/findAll',
        method: 'post',
        params: { memberId }
    })
}