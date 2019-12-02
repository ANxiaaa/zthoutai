import { baseUrl } from '@/utils/global'
let refreshToken = token => {
    let ajax = new XMLHttpRequest();
    ajax.open('get',baseUrl + '/security/refreshToken');
    ajax.setRequestHeader('token', token)
    ajax.send();
    return JSON.parse(ajax.responseText)
}

export default refreshToken