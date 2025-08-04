import request from '@/utils/request'

const api = {
  data: '/Role/GetAllSysRole',
  dataBy: '/Role/GetAllSysRoleBy',
  dataUpdate: '/Role/UpdateSysRole',
  modifySysRoleStatus: '/Role/ModifySysRoleStatus',
  dataDel: '/Role/DelSysRoleByRoleId',
  dataAdd: '/Role/AddSysRoleInfo',
  getMenuBysysRoleName: '/Role/GetMenuBysysRoleName',
  modifySysRoleInfo: '/Role/ModifySysRoleInfo'
}

export default api

export function getData(parameter, queryParam) {
  return request({
    url: api.dataBy,
    method: 'post',
    data: queryParam,
    params: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
export function getDataBy(parameter, values) {
  return request({
    url: api.dataBy,
    method: 'post',
    params: parameter,
    data: values,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
export function updateData(values) {
  return request({
    url: api.dataUpdate,
    method: 'post',
    // params: { pageNo: 1, pageSize: 10 },
    data: values,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
export function modifySysRoleStatus(values) {
  return request({
    url: api.modifySysRoleStatus + '?role_name=' + values.role_name + '&&status=' + values.status,
    method: 'post',
    // params: { pageNo: 1, pageSize: 10 },
    data: values,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
export function delData(values) {
  return request({
    url: api.dataDel,
    method: 'post',
    // params: { pageNo: 1, pageSize: 10 },
    data: values,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
export function addData(values) {
  return request({
    url: api.dataAdd + '?role_name=' + values.role_name + '&&storage_name=' + values.storage_name,
    method: 'post',
    // params: { pageNo: 1, pageSize: 10 },
    data: values.checkedKeysAdd,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
export function getMenuBysysRoleName(values) {
  return request({
    url: api.getMenuBysysRoleName + '?role_name=' + values.role_name,
    method: 'post',
    // params: { pageNo: 1, pageSize: 10 },
    // data: values.checkedKeysAdd,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
export function modifySysRoleInfo(values) {
  return request({
    url: api.modifySysRoleInfo + '?role_name=' + values.role_name,
    method: 'post',
    // params: { pageNo: 1, pageSize: 10 },
    data: values.checkedKeys,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
