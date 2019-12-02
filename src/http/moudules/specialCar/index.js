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
