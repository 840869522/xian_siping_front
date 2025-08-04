import request from '@/utils/request'

const api = {
  dataBy: '/InOrderDetail/GetInOrderDetailBy',
  dataUpdate: '/InOrderDetail/EditInOrderDetail',
  dataDel: '/InOrderDetail/DelInOrderDetail',
  dataAdd: '/InOrderDetail/AddInOrderDetail',
  ImportInOrderExcel: '/InOrderDetail/ImportInOrderExcel'
}

export default api

export function getDataDetail(parameter, queryParam) {
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
export function getDataByDetail(parameter, values) {
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
export function updateDataDetail(values) {
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
export function delDataDetail(values) {
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
export function addDataDetail(values) {
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
export function ImportInOrderExcel(values) {
  return request({
    url: api.ImportInOrderExcel,
    method: 'post',
    // params: { pageNo: 1, pageSize: 10 },
    data: values,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
