import request from '@/utils/request'

const api = {
  dataBy: '/LocationMap/GetAllLocationMapByFuzzy',
  dataUpdate: '/LocationMap/UpdateLocationMapByLocation',
  // dataDel: '/LocationMap/DelSysUserByLoginName',
  dataAdd: '/LocationMap/AddLocationMap',
  getEmptyLocationB: '/LocationMap/getEmptyOutLocationB',
  getEmptyLocationP: '/LocationMap/getEmptyLocationP',
  getLocationByPalletcodeB: '/LocationMap/getLocationByPalletcodeB'
}
export default api
export function getEmptyLocationP(row, farNear, lowHigh) {
  return request({
    url: api.getEmptyLocationP + '?row=' + row + '&farNear=' + farNear + '&lowHigh=' + lowHigh,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
export function getLocationByPalletcodeB(value) {
  return request({
    url: api.getLocationByPalletcodeB,
    method: 'post',
    params: value,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
export function getEmptyOutLocationB(floor, farNear) {
  return request({
    url: api.getEmptyLocationB + '?floor=' + floor + '&farNear=' + farNear,
    method: 'post',
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
    url: api.dataUpdate,
    method: 'post',
    // params: { pageNo: 1, pageSize: 10 },
    data: values,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
// export function delData (values) {
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
