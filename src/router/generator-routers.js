// eslint-disable-next-line
// import * as loginService from '@/api/login'
// eslint-disable-next-line
import { BasicLayout, BlankLayout, PageView, RouteView } from '@/layouts'

// 前端路由表 (基于动态)
const constantRouterComponents = {
  // 基础页面 layout 必须引入
  BasicLayout: BasicLayout,
  BlankLayout: BlankLayout,
  RouteView: RouteView,
  PageView: PageView,
  '403': () => import(/* webpackChunkName: "error" */ '@/views/exception/403'),
  '404': () => import(/* webpackChunkName: "error" */ '@/views/exception/404'),
  '500': () => import(/* webpackChunkName: "error" */ '@/views/exception/500'),

  // 你需要动态引入的页面组件
  analysis: () => import('@/views/dashboard/Analysis'),

  // result
  ResultSuccess: () => import(/* webpackChunkName: "result" */ '@/views/result/Success'),
  ResultFail: () => import(/* webpackChunkName: "result" */ '@/views/result/Error'),

  // exception
  Exception403: () => import(/* webpackChunkName: "fail" */ '@/views/exception/403'),
  Exception404: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404'),
  Exception500: () => import(/* webpackChunkName: "fail" */ '@/views/exception/500'),

  // 系统管理
  user: () => import('@/views/system/UserList'),
  role: () => import('@/views/system/RoleList'),
  dataDic: () => import('@/views/system/DataDic'),
  infoSetting: () => import('@/views/system/InfoSetting'),
  ledConfig: () => import('@/views/led/Led'),

  // 基础数据管理
  material: () => import('@/views/basicData/Material'),
  storage: () => import('@/views/basicData/Storage'),
  vehicle: () => import('@/views/basicData/Vehicle'),
  equip: () => import('@/views/basicData/Equip'),
  // 库存管理
  storageQuery: () => import('@/views/storage/StorageQuery'),
  callVehicle: () => import('@/views/storage/CallVehicle'),
  storageChange: () => import('@/views/storage/StorageChange'),
  storageWarn: () => import('@/views/storage/StorageWarn'),
  storageAnalyse: () => import('@/views/storage/StorageAnalyse'),
  locationMap: () => import('@/views/storage/locationMap'),
  flowPage: () => import('@/views/storage/Flow'),
  // 入库管理
  inStorageBills: () => import('@/views/inStorage/InStorageBills'),
  inStorageBillsCommit: () => import('@/views/inStorage/InStorageBillsCommit'),
  groupBracket: () => import('@/views/inStorage/GroupBracket'),
  GroupBracketNoBill: () => import('@/views/inStorage/GroupBracketNoBill'),
  // GroupBracketNoBill
  pdaGetGoods: () => import('@/views/inStorage/PdaGetGoods'),

  palletUpShelf: () => import('@/views/inStorage/PalletUpShelf'),
  X_instorage: () => import('@/views/inStorage/X_instorage'),
  cancelGroupBracket: () => import('@/views/inStorage/CancelGroupBracket'),
  cancelGetGoods: () => import('@/views/inStorage/CancelGetGoods'),
  pingkushangjia: () => import('@/views/inStorage/Pingkushangjia'),
  D_instorage: () => import('@/views/inStorage/D_instorage'),
  P_instorage: () => import('@/views/inStorage/P_instorage'),
  B_instorage: () => import('@/views/inStorage/B_instorage'),
  addInstorage: () => import('@/views/inStorage/addInstorage'),
  C_instorage: () => import('@/views/inStorage/C_instorage'),

  zidongmaduo: () => import('@/views/inStorage/zidongmaduo'),
  P_emptyPallet_instorage: () => import('@/views/inStorage/P_emptyPallet_instorage'),
  D_emptyPallet_instorage: () => import('@/views/inStorage/D_emptyPallet_instorage'),
  // 出库管理
  outStorageBills: () => import('@/views/outStorage/OutStorageBills'),
  outStorageBillsCommit: () => import('@/views/outStorage/OutStorageBillsCommit'),
  outStorageDistribute: () => import('@/views/outStorage/OutStorageDistribute'),
  outStorageSure: () => import('@/views/outStorage/OutStorageSure'),
  pdaOutStorage: () => import('@/views/outStorage/PdaOutStorage'),
  pickStoreTemporarily: () => import('@/views/outStorage/PickStoreTemporarily'),
  taskCreat: () => import('@/views/outStorage/TaskCreat'),
  // yuliaohuiku: () => import('@/views/outStorage/Yuliaohuiku'),

  chuansuobanDownShelf: () => import('@/views/outStorage/ChuansuobanDownShelf'),
  manualDownShelf: () => import('@/views/outStorage/ManualDownShelf'),
  pingkuxiajia: () => import('@/views/outStorage/Pingkuxiajia'),
  P_outstorage: () => import('@/views/outStorage/P_outstorage'),
  D_outstorage: () => import('@/views/outStorage/D_outstorage'),
  B_outstorage: () => import('@/views/outStorage/B_outstorage'),
  X_outstorage: () => import('@/views/outStorage/X_outstorage'),
  B_emptyPallet_outstorage: () => import('@/views/outStorage/B_emptyPallet_outstorage'),
  P_emptyPallet_outstorage: () => import('@/views/outStorage/P_emptyPallet_outstorage'),
  D_emptyPallet_outstorage: () => import('@/views/outStorage/D_emptyPallet_outstorage'),
  secondFloor_pick: () => import('@/views/outStorage/secondFloor_pick'),
  C_outstorage: () => import('@/views/outStorage/C_outstorage'),

  X_auto_outstorage: () => import('@/views/outStorage/X_auto_outstorage'),
  P_auto_outstorage: () => import('@/views/outStorage/P_auto_outstorage'),
  B_auto_outstorage: () => import('@/views/outStorage/B_auto_outstorage'),
  C_auto_outstorage: () => import('@/views/outStorage/C_auto_outstorage'),
  D_auto_outstorage: () => import('@/views/outStorage/D_auto_outstorage'),
  yuliao_instorage: () => import('@/views/outStorage/yuliao_instorage'),
  fenjianjiParamsDown: () => import('@/views/outStorage/FenjianjiParamsDown'),

  peipan: () => import('@/views/outStorage/peipan'),
  // 盘点管理
  storageCheck: () => import('@/views/check/StorageCheck'),
  materialCheck: () => import('@/views/check/MaterialCheck'),
  // 自动搬运
  agvTask: () => import('@/views/autoCarry/AgvTask'),
  ctuTask: () => import('@/views/autoCarry/ctuTask'),
  // 任务查询
  taskQuery: () => import('@/views/task/TaskQuery'),
  agvTaskQuery: () => import('@/views/task/agvTaskQuery'),
  CTUTaskQuery: () => import('@/views/task/CTUTaskQuery')
}

// 前端未找到页面路由（固定不用改）
// const notFoundRouter = {
//   path: '*',
//   redirect: '/404',
//   hidden: true
// }

// 根级菜单
// const rootRouter = {
//   key: '',
//   name: 'index',
//   path: '',
//   component: 'BasicLayout',
//   redirect: '/dashboard/analysis',
//   meta: {
//     title: '首页'
//   },
//   children: []
// }

/**
 * 动态生成菜单
 * @param token
 * @returns {Promise<Router>}
 */
export const generatorDynamicRouter = data => {
  const childrenNav = []
  // 后端数据, 根级树数组,  根级 PID
  return new Promise((resolve, reject) => {
    listToTree(data, childrenNav, 0)
    // rootRouter.children = childrenNav
    const routers = generator(childrenNav)
    // console.log(routers)
    // routers.push(notFoundRouter)
    resolve(routers)
  })
}

/**
 * 格式化树形结构数据 生成 vue-router 层级路由表
 *
 * @param routerMap
 * @param parent
 * @returns {*}
 */
export const generator = (routerMap, parent) => {
  return routerMap.map(item => {
    const { title, icon } = item
    item.component_name = item.component_name === null ? item.component_name = '' : item.component_name
    const currentRouter = {
      // 如果路由设置了 path，则作为默认 path，否则 路由地址 动态拼接生成如 /dashboard/workplace
      path: item.path || `${(parent && parent.path) || ''}/${item.component_name}`,
      // 路由名称，建议唯一
      name: item.component_id || item.component_name || '',
      // 该路由对应页面的 组件 :方案1
      component: constantRouterComponents[item.component || item.component_name],

      // meta: 页面标题, 菜单图标, 页面权限(供指令权限用，可去掉)
      meta: {
        title: title,
        icon: icon || undefined
      }
    }

    // 为了防止出现后端返回结果不规范，处理有可能出现拼接出两个 反斜杠
    if (!currentRouter.path.startsWith('http')) {
      currentRouter.path = currentRouter.path.replace('//', '/')
    }
    // 重定向
    item.redirect && (currentRouter.redirect = item.redirect)
    // 是否有子菜单，并递归处理
    if (item.children && item.children.length > 0) {
      // Recursion
      currentRouter.children = generator(item.children, currentRouter)
    }
    return currentRouter
  })
}

/**
 * 数组转树形结构
 * @param list 源数组
 * @param tree 树
 * @param parentId 父ID
 */
const listToTree = (list, tree, parentId) => {
  // console.log(list)
  list.forEach(item => {
    // 判断是否为父级菜单
    if (item.parent_id === parentId) {
      item.component_name = item.component_name === null ? item.component_name = '' : item.component_name
      const child = {
        ...item,
        key: item.component_name || item.component_id,
        children: item.children
      }
      // 迭代 list， 找到当前菜单相符合的所有子菜单
      listToTree(list, child.children, item.role_id)
      // 删掉不存在 children 值的属性
      if (child.children.length <= 0) {
        delete child.children
      }
      // 加入到树中
      tree.push(child)
    }
  })
}
