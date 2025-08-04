import request from '@/utils/request'

const api = {
  data: '/OutOrder/GetAllOutOrder',
  dataBy: '/OutOrder/GetOutOrderByFuzzy',
  dataUpdate: '/OutOrder/SubmitOutOrder',
  editOutOrder: '/OutOrder/EditOutOrder',
  dataDel: '/OutOrder/DelOutOrder',
  dataAdd: '/OutOrder/AddOutOrder',
  generateOutOrderNo: '/OutOrder/GenerateOutOrderNo'
}

export default api
export function createOutOrderId() {
  return request({
    url: api.generateOutOrderNo,
    method: 'post',
    // params: parameter,
    // data: values,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
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
    url: api.editOutOrder,
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
    url: api.dataAdd,
    method: 'post',
    // params: { pageNo: 1, pageSize: 10 },
    data: values,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
export function submitStatus(values) {
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
