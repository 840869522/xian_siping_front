import request from '@/utils/request'

const api = {
  data: '/InOrder/GetAllInOrder',
  dataBy: '/InOrder/GetInOrderByFuzzy',
  dataUpdate: '/InOrder/EditInOrder',
  dataDel: '/InOrder/DelInOrder',
  dataAdd: '/InOrder/AddInOrder',
  submitStatus: '/InOrder/SubmitInOrder',
  create_in_order_id: '/InOrder/GenerateInOrderNo'
}

export default api

// export function getData(parameter, queryParam) {
//   return request({
//     url: api.data,
//       method: 'post',
//       params: parameter,
//     data: queryParam,
//     headers: {
//       'Content-Type': 'application/json;charset=UTF-8'
//     }
//   })
// }
export function createInOrderId() {
  return request({
    url: api.create_in_order_id,
    method: 'post',
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
    url: api.submitStatus,
    method: 'post',
    // params: { pageNo: 1, pageSize: 10 },
    data: values,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
