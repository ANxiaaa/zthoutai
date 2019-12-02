import axios from 'axios';
import config from './config';
import Cookies from "js-cookie";
import router from '@/router'
import { Message } from 'element-ui'

import refreshToken from './refreshToken'
// 使用vuex做全局loading时使用
// import store from '@/store'
export default function $axios(options) {
  return new Promise((resolve, reject) => {
    const instance = axios.create({
      baseURL: config.baseUrl,
      headers: config.headers,
      timeout: config.timeout,
      withCredentials: config.withCredentials
    })
    //console.log("-----------"+config.headers.token);
    // request 拦截器
    instance.interceptors.request.use(
      config => {
        let tokenlen = Number(Cookies.get('tokenlen'))
        let token = ''
        for(let i = 0;i < tokenlen;i ++){
          token += Cookies.get('token' + i)
        }
        let expirationDate = Cookies.get('expirationDate')
        let user = sessionStorage.getItem('user')
        let nowDate = new Date().getTime()
        // 1. 请求开始的时候可以结合 vuex 开启全屏 loading 动画
        // console.log(store.state.loading)
        // console.log('准备发送请求...')

        //1.取出cookie中的token过期时间
        //2.使用当前时间和token时间进行比对
        //3.如果token过期时间达到设定值,请求后台获取新的token和过期时间,存入cookie中替换原有的数据, 否则直接请求
        if(expirationDate - nowDate < 0){
          Message.error('登录状态超时, 请退出重新登录!')
          sessionStorage.removeItem('user')
          router.push('/login')
        }else if(expirationDate - nowDate <= 300000 && user){
          let res = refreshToken(token)
          token = res.data.refreshToken
          let len = Math.ceil(token.length / 4000)
          Cookies.set('tokenlen', len)
          for(let i = 0;i < len;i ++){ // 放置token到Cookie
            let a = token.substr(i * 4000, (i * 4000) + 4000)
            Cookies.set('token' + i, a)
          }
          Cookies.set('expirationDate', res.data.expirationDate)
        }
        // 2. 带上token
        if (token) {
          config.headers.token = token
        } else {
          // 重定向到登录页面
          router.push('/login')
        }
        // 3. 根据请求方法，序列化传来的参数，根据后端需求是否序列化
        if (config.method === 'post') {
          // if (config.data.__proto__ === FormData.prototype
          //   || config.url.endsWith('path')
          //   || config.url.endsWith('mark')
          //   || config.url.endsWith('patchs')
          // ) {

          // } else {
            // config.data = qs.stringify(config.data)
          // }
        }

        return config
      },

      error => {
        // 请求错误时
        console.log('request:', error)
        // 1. 判断请求超时
        if (error.code === 'ECONNABORTED' && error.message.indexOf('timeout') !== -1) {
          console.log('timeout请求超时')
          // return service.request(originalRequest);// 再重复请求一次 
        }
        // 2. 需要重定向到错误页面
        const errorInfo = error.response
        console.log(errorInfo)
        if (errorInfo) {
          error = errorInfo.data  // 页面那边catch的时候就能拿到详细的错误信息,看最下边的Promise.reject
          const errorStatus = errorInfo.status; // 404 403 500 ...
          router.push({
            path: `/error/${errorStatus}`
          })
        }
        return Promise.reject(error) // 在调用的那边可以拿到(catch)你想返回的错误信息
      }
    )

    // response 拦截器
    instance.interceptors.response.use(
      response => {
        let data;
        // IE9时response.data是undefined，因此需要使用response.request.responseText(Stringify后的字符串)
        if (response.data == undefined) {
          data = JSON.parse(response.request.responseText)
        } else {
          data = response.data
        }
        console.log(data);
        // 根据返回的code值来做不同的处理
        switch (data.rc) {
          case 1:
            console.log(data.desc)
            break;
          case 0:
            store.commit('changeState')
            // console.log('登录成功')
          default:
        }
        // 若不是正确的返回code，且已经登录，就抛出错误
        // const err = new Error(data.desc)
        // err.data = data
        // err.response = response
        // throw err

        return data
      },
      err => {
        if (err && err.response) {
          switch (err.response.status) {
            case 400:
              err.message = '请求错误'
              break
            case 401:
              err.message = '未授权'
              // sessionStorage.setItem('user', '')
              // router.push('/login')
              break
            case 403:
              err.message = '拒绝访问'
              // sessionStorage.setItem('user', '')
              Message.error('没有权限')
              // router.push('/login')
              break
            case 404:
              err.message = `请求地址出错: ${err.response.config.url}`
              break
            case 408:
              err.message = '请求超时'
              //重新发起请求
              return axios(err.config);
              break
            case 500:
              err.message = '服务器内部错误'
              break
            case 501:
              err.message = '服务未实现'
              break
            case 502:
              err.message = '网关错误'
              break
            case 503:
              err.message = '服务不可用'
              break
            case 504:
              err.message = '网关超时'
              break
            case 505:
              err.message = 'HTTP版本不受支持'
              break
            default:
          }
        }
        if(!err.response){
          err.message = '其他错误'
          Message.error('未知错误')
          sessionStorage.removeItem('user')
          router.push('/login')
        }
        console.log(err.config)
        console.error(err)
        return Promise.reject(err) // 返回接口返回的错误信息
      }
    )

    // 请求处理
    instance(options).then(res => {
      resolve(res)
      return false
    }).catch(error => {
      reject(error)
    })
  })
}