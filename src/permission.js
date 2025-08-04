import router, { resetRouter } from './router'
import store from './store'
import storage from 'store'
import NProgress from 'nprogress' // progress bar
import notification from 'ant-design-vue/es/notification'
import { setDocumentTitle, domTitle } from '@/utils/domUtil'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { i18nRender } from '@/locales'
NProgress.configure({ showSpinner: false }) // NProgress Configuration

const allowList = ['login', 'register', 'registerResult'] // no redirect allowList
const loginRoutePath = '/user/login'
const defaultRoutePath = '/dashboard/analysis'
router.beforeEach((to, from, next) => {
  NProgress.start() // start progress bar
  to.meta && typeof to.meta.title !== 'undefined' && setDocumentTitle(`${i18nRender(to.meta.title)} - ${domTitle}`)
  /* has token */
  const token = storage.get(ACCESS_TOKEN)
  // console.log(from.path + '=======' + to.path)
  // if (from.path === '/user/login' && to.path === '/dashboard/analysis') {
  //   debugger
  // }
  if (token) {
    if (to.path === loginRoutePath) {
      console.log(3)
      next({ path: defaultRoutePath })
      NProgress.done()
    } else {
      // check login user.roles is null
      if (store.getters.roles.length === 0) {
        // request login userInfo
        store.dispatch('GetInfo').then(result => {
          const res = [...result]
          console.log('根据角色获取权限成功')
          console.log(res)
          if (res.length === 1 && res[0].parent_id === 0) {
            res[0].redirect = '/' + res[0].children[0].component_id + '/' + res[0].children[0].children[0].component_id
            // this.$router.push({ path: res[0].redirect })
            // res[0].redirect = '/dashboard/analysis'
          }
          console.log(res[0].redirect)
          // 根据用户权限信息生成可访问的路由表
          store.dispatch('GenerateRoutes', res).then((res) => {
            console.log('权限数据处理完成')
            // 动态添加可访问路由表
            // VueRouter@3.5.0+ New API
            resetRouter() // 重置路由 防止退出重新登录或者 token 过期后页面未刷新，导致的路由重复添加
            store.getters.addRouters.forEach(r => {
              router.addRoute(r)
            })

            console.log('路由添加完成,如果没有出现页面请检查权限表配置')
            // 请求带有 redirect 重定向时，登录自动重定向到该地址
            const redirect = decodeURIComponent(from.query.redirect || to.path)
            if (to.path === redirect) {
              // set the replace: true so the navigation will not leave a history record
              next({ ...to, replace: true })
            } else {
              // 跳转到目的路由
              next({ path: redirect })
            }
          })
        })
          .catch((e) => {
            notification.error({
              message: '错误',
              description: '请求用户信息失败，请重试'
            })
            // 失败时，获取用户信息失败时，调用登出，来清空历史保留信息
            store.dispatch('Logout').then(() => {
              next({ path: loginRoutePath, query: { redirect: to.fullPath } })
            })
          })
      } else {
        next()
      }
    }
  } else {
    if (allowList.includes(to.name)) {
      // 在免登录名单，直接进入
      next()
    } else {
      next({ path: loginRoutePath, query: { redirect: to.fullPath } })
      NProgress.done() // if current page is login will not trigger afterEach hook, so manually handle it
    }
  }
})

router.afterEach(() => {
  NProgress.done() // finish progress bar
})
