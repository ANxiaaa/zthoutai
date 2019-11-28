import axios from '../axios'

/* 
 * 系统登录模块
 */

// 登录
export const login = data => {
    return axios({
        url: 'security/login',
        method: 'post',
        data
    })
}

// 登出
export const logout = () => {
    return axios({
        url: 'security/logout',
        method: 'get'
    })
}

// 登录
export const register = data => {
    return axios({
        url: 'login/sendCode',
        method: 'get',
        params: {
            phone: data
        }
    })
}