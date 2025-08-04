import request from '@/utils/request'

const api = {
  checkPage: '/check/page',
  checkPageDetail: '/check/detail/page',
  checkAdd: '/check/add',
  checkAddDetail: '/check/detail/add',
  checkUpdate: '/check/update',
  deleteCheck: '/check/delete',
  checkEdit: '/check/edit',
  checkUpdateDetail: '/check/detail/update',
  checkEditDetail: '/check/detail/edit',
  checkDetailDelete: '/check/detail/delete',
  queryMaterial: '/check/query/material',
  checkPick: '/check/pick',
  callbackApi: '/check/up/send'
}

export default api

export function getPage(parameter, queryParam) {
  return request({
    url: api.checkPage,
    method: 'post',
    data: queryParam,
    params: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
export function getMaterial(queryParam) {
  return request({
    url: api.queryMaterial,
    method: 'post',
    data: queryParam,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function getPageDetail(parameter, queryParam) {
  return request({
    url: api.checkPageDetail,
    method: 'post',
    data: queryParam,
    params: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function saveCheck(values) {
  return request({
    url: api.checkAdd,
    method: 'post',
    data: values,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function saveCheckDetail(values) {
  return request({
    url: api.checkAddDetail,
    method: 'post',
    data: values,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function updateCheck(values) {
  return request({
    url: api.checkUpdate,
    method: 'post',
    // params: { pageNo: 1, pageSize: 10 },
    data: values,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function editCheck(values) {
  return request({
    url: api.checkEdit,
    method: 'post',
    // params: { pageNo: 1, pageSize: 10 },
    data: values,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function updateCheckDetail(values) {
  return request({
    url: api.checkUpdateDetail,
    method: 'post',
    // params: { pageNo: 1, pageSize: 10 },
    data: values,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
export function editCheckDetail(values) {
  return request({
    url: api.checkEditDetail,
    method: 'post',
    // params: { pageNo: 1, pageSize: 10 },
    data: values,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function deleteCheckDetail(values) {
  return request({
    url: api.checkDetailDelete,
    method: 'post',
    // params: { pageNo: 1, pageSize: 10 },
    data: values,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function checkDelete(values) {
  return request({
    url: api.deleteCheck,
    method: 'post',
    // params: { pageNo: 1, pageSize: 10 },
    data: values,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function checkOutPick(values, jianxuankou) {
  return request({
    url: api.checkPick + '?ports=' + jianxuankou,
    method: 'post',
    data: values,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function callbackUp() {
  return request({
    url: api.callbackApi,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
