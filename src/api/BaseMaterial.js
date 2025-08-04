import request from '@/utils/request'
const api = {
  dataBy: '/BaseMaterial/GetMaterialByFuzzy',
  dataAdd: '/BaseMaterial/AddMaterial',
  dataUpdate: '/BaseMaterial/UpdateMaterial'
}

export default api

// export function getData(parameter, queryParam) {
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

export function getMaterialBy(parameter, values) {
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
// export function delData(values) {
//   return request({
//     url: api.dataDel,
//     method: 'post',
//     // params: { pageNo: 1, pageSize: 10 },
//     data: values,
//     headers: {
//       'Content-Type': 'application/json;charset=UTF-8'
//     }
//   })
// }
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
