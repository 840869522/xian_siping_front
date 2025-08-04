import request from '@/utils/request'

const api = {
  data: '/Dictionary/GetAllSysDictionary',
  dataBy: '/Dictionary/GetAllSysDictionaryBy',
  dataUpdate: '/Dictionary/UpdateSysDictionaryByDicId',
  dataDel: '/Dictionary/DelSysDictionaryByDicId',
  dataAdd: '/Dictionary/AddSysDictionary'
}

export default api

export function getData (parameter) {
  return request({
    url: api.data + '?isDedup=true',
    method: 'post',
    data: parameter,
    // params: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
export function getDataBy (parameter, values) {
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
export function updateData (values) {
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
export function delData (values) {
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
export function addData (values) {
  return request({
    url: api.dataAdd,
    method: 'post',
    // params: { pageNo: 1, pageSize: 10 },
    data: values,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
