import axios from '../../axios'

/*
 * 违章查询管局查询模块
 */

// 分页查询
export const findPage = data => {
    return axios({
        url: '/back/illegalManagerBureau/findPage',
        method: 'post',
        data
    })
}
export const findAll = () => {
    return axios({
        url: '/back/illegalManagerBureau/findAll',
        method: 'get'
    })
}

export const syn = () => {
    return axios({
        url: '/back/illegalManagerBureau/synchroData',
        method: 'get'
    })
}
