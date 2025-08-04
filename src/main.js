// with polyfills
// import 'core-js/stable'
import 'regenerator-runtime/runtime'

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/'
import i18n from './locales'
import { VueAxios } from './utils/request'
import ProLayout, { PageHeaderWrapper } from '@ant-design-vue/pro-layout'

import themePluginConfig from '../config/themePluginConfig'

import bootstrap from './core/bootstrap'
import './core/lazy_use' // use lazy load components
import './permission' // permission control
import './utils/filter' // global filter
import './global.less'
import { Tree } from 'ant-design-vue'
import Print from 'vue-print-nb'
import * as XLSX from 'xlsx'
import validate from './utils/validate'
Vue.prototype.validate = validate
// import QRCode from 'qrcode' // global style
Vue.config.productionTip = false
Vue.use(Tree)
// mount axios to `Vue.$http` and `this.$http`
Vue.use(VueAxios)

// use pro-layout components
Vue.component('pro-layout', ProLayout)
Vue.component('page-container', PageHeaderWrapper)
Vue.component('page-header-wrapper', PageHeaderWrapper)

window.umi_plugin_ant_themeVar = themePluginConfig.theme
// Global instruction
Vue.use(Print)
// Vue.use(QRCode)

// 封装xlsx导出方法
const ToDoExcel = (excelName, titleArr, dataArr) => {
  console.log(titleArr, dataArr)
  // 文件名称
  const filename = excelName + '.xlsx'
  // 数据，一定注意需要时二维数组
  const data = [titleArr, ...dataArr]
  // Excel第一个sheet的名称
  const wsName = 'Sheet1'
  const wb = XLSX.utils.book_new()
  const ws = XLSX.utils.aoa_to_sheet(data)
  // 将数据添加到工作薄
  XLSX.utils.book_append_sheet(wb, ws, wsName)
  XLSX.writeFile(wb, filename)
}

Vue.prototype.$ToDoExcel = ToDoExcel
new Vue({
  router,
  store,
  i18n,
  // init localstorage, vuex, Logo message
  created: bootstrap,
  render: h => h(App)
}).$mount('#app')
