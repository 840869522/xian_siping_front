import axios from 'axios'
import store from '@/store'
import storage from 'store'
import notification from 'ant-design-vue/es/notification'
import { VueAxios } from './axios'
import { ACCESS_TOKEN } from '@/store/mutation-types'
// axios.defaults.withCredentials = true
// document.cookie = '自动化库管理员'
// 创建 axios 实例
const request = axios.create({
  // API 请求的默认前缀
  // baseURL: 'http://192.168.4.242:9997/',
  // baseURL: 'http://192.168.6.10:16162/',
  baseURL: 'http://127.0.0.1:9999/',
  timeout: 6000 // 请求超时时间
})

// 异常拦截处理器
const errorHandler = error => {
  if (error.response) {
    const data = error.response.data
    // 从 localstorage 获取 token
    const token = storage.get(ACCESS_TOKEN)
    if (error.response.status === 403) {
      notification.error({
        message: 'Forbidden',
        description: data.message
      })
    }
    if (error.response.status === 401 && !(data.result && data.result.isLogin)) {
      notification.error({
        message: 'Unauthorized',
        description: 'Authorization verification failed'
      })
      if (token) {
        console.log(token)
        store.dispatch('Logout').then(() => {
          setTimeout(() => {
            window.location.reload()
          }, 1500)
        })
      }
    }
  }
  return Promise.reject(error)
}

// request interceptor
request.interceptors.request.use(config => {
  const token = storage.get(ACCESS_TOKEN)
  const userInfo = storage.get('userInfo')

  // 如果 token 存在
  // 让每个请求携带自定义 token 请根据实际情况自行修改
  if (token) {
    config.headers[ACCESS_TOKEN] = token
  }
  if (userInfo !== null && userInfo !== undefined && userInfo !== '') {
    const userName = encodeURIComponent(userInfo.login_name)
    // console.log(userName)
    // console.log(decodeURIComponent(userName))
    config.headers['User-Info'] = userName
  }
  return config
}, errorHandler)

// response interceptor
request.interceptors.response.use(response => {
  return response.data
}, errorHandler)

const installer = {
  vm: {},
  install(Vue) {
    Vue.use(VueAxios, request)
  }
}

export default request

export { installer as VueAxios, request as axios }
