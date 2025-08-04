import storage from 'store'
import { resetRouter } from '../../router'
import expirePlugin from 'store/plugins/expire'
import { login, getInfo, getStoreName } from '@/api/login'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { welcome } from '@/utils/util'
import md5 from 'md5'
storage.addPlugin(expirePlugin)
const user = {
  state: {
    token: '',
    name: '',
    welcome: '',
    avatar: '',
    roles: [],
    info: {},
    roleName: ''
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, { name, welcome }) => {
      state.name = name
      state.welcome = welcome
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_INFO: (state, info) => {
      state.info = info
    },
    SET_ROLENAME: (state, roleName) => {
      state.roleName = roleName
    }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        login(userInfo)
          .then(response => {
            console.log(response)
            if (!response.status) {
              reject(response)
              return
            }
            if (response.result.anything.length > 0) {
              const token = md5(JSON.stringify(response.result.anything[0]))
              storage.set(ACCESS_TOKEN, token, new Date().getTime() + 7 * 24 * 60 * 60 * 1000)
              sessionStorage.setItem('token', token)
              storage.set('role_name', response.result.anything[0].role_name)
              storage.set('storageTypeDic', userInfo.storageTypeDic)
              // storage.set('storageTypeDicList', userInfo.storageTypeDicList)
              storage.set('userInfo', response.result.anything[0])
              commit('SET_TOKEN', token)
              commit('SET_INFO', response.result.anything[0])
              commit('SET_ROLENAME', response.result.anything[0].role_name)
              resolve()
            } else {
              reject(response)
            }
          })
          .catch(error => {
            reject(error)
          })
      })
    },

    // 获取用户信息
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        // 请求后端获取用户信息 /api/user/info
        const roleName = (state.roleName === '' || state.roleName === undefined) ? storage.get('role_name') : state.roleName
        const storageTypeDic = storage.get('storageTypeDic')
        console.log(roleName, storageTypeDic)
        getInfo({ role_name: roleName }, storageTypeDic).then(response => {
          console.log(response)
          if (response.status && response.result.anything.length === 1) {
            const menu = [...response.result.anything]
            commit('SET_ROLES', [state.roleName])
            commit('SET_INFO', state.info)
            commit('SET_NAME', { name: state.info.userName, welcome: welcome() })
            commit('SET_AVATAR', state.info.userName)
            // 下游
            resolve(menu)
          } else {
            reject(new Error('获取用户信息失败！'))
          }
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 获取当前用户所拥有的库权限
    GetStoreName() {
      return new Promise((resolve, reject) => {
        const roleName = storage.get('role_name')
        const storageTypeDic = storage.get('storageTypeDic')
        console.log(roleName, storageTypeDic)
        getStoreName({ role_name: roleName }, storageTypeDic).then(response => {
          console.log(response)
          if (response.status) {
            const storageList = response.result.anything
            storage.set('storageTypeDicList', storageList)
            resolve(storageList)
          } else {
            reject(new Error('获取当前用户所拥有的库权限失败！'))
          }
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 登出
    Logout({ commit, state }) {
      console.log(state.token)
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      commit('SET_ROUTERS', [])
      state = user
      resetRouter()
      storage.remove(ACCESS_TOKEN)
      storage.remove('role_name')
      storage.remove('role_name')
      storage.remove('storageTypeDic')
      storage.remove('storageTypeDicList')
      storage.remove('userInfo')
      storage.remove('store')
      sessionStorage.setItem('token', '')
    }
  }
}
export default user
