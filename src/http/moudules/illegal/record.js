import axios from '../../axios'

/*
 * 违章查询管局查询模块
 */

// 分页查询
export const findPage = data => {
    return axios({
        url: '/back/illegalRecord/findPage',
        method: 'post',
        data
    })
}

// 删除
export const findById = (id) => {
    return axios({
        url: '/back/illegalRecord/findById',
        method: 'get',
        params: { id }
    })
}

