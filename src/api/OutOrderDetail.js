import request from '@/utils/request'

const api = {
  // data: '/OutOrderDetail/GetAllOutOrderDetail',
  dataBy: '/OutOrderDetail/GetOutOrderDetailBy',
  dataUpdate: '/OutOrderDetail/EditOutOrderDetail',
  dataDel: '/OutOrderDetail/DelOutOrderDetail',
  dataAdd: '/OutOrderDetail/AddOutOrderDetail',
  ImportOutOrderExcel: '/OutOrderDetail/ImportOutOrderExcel '
}

export default api

// export function getDataDetail(parameter, queryParam) {
//   return request({
//     url: api.dataBy,
//     method: 'post',
//     data: queryParam,
//     params: parameter,
//     headers: {
//       'Content-Type': 'application/json;charset=UTF-8'
//     }
//   })
// }
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
export function ImportOutOrderExcel(values) {
  return request({
    url: api.ImportOutOrderExcel,
    method: 'post',
    // params: { pageNo: 1, pageSize: 10 },
    data: values,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
