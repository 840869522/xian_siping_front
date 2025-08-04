import request from '@/utils/request'

const userApi = {
  Login: '/User/Login',
  Logout: '/auth/logout',
  // get my info
  UserInfo: 'Role/GetSysRoleByRoleName',
  Role: 'Role/GetStoreName'
}

/**
 * @param parameter
 * @returns {*}
 */
export function login (sysUser) {
  return request({
    url: userApi.Login + '?storeClassifyValue=' + sysUser.storageTypeDic,
    method: 'post',
    data: sysUser
  })
}
export function getStoreName (sysUser, storeClassifyValue) {
  return request({
    url: userApi.Role + '?storeClassifyValue=' + storeClassifyValue,
    method: 'post',
    data: sysUser
  })
}
export function getInfo (sysUser, storageTypeDic) {
  console.log(sysUser, storageTypeDic)
  return request({
    url: userApi.UserInfo + '?storeClassifyValue=' + storageTypeDic,
    method: 'post',
    data: sysUser
  })
}
