import request from '@/utils/request'

const api = {
  dataBy: '/OutPick/GetOutPickBy',
  dataAdd: '/OutPick/AddOutPick',
  OrderPick: '/OutPick/OrderPick',
  pickPallet: '/OutPick/PickPallet',
  checkOut: '/OutPick/Checkout'
}

export default api

export function checkOut(values) {
  return request({
    url: api.checkOut,
    method: 'post',
    data: values,
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
// export function updateData(values) {
//   return request({
//     url: api.dataUpdate,
//     method: 'post',
//     // params: { pageNo: 1, pageSize: 10 },
//     data: values,
//     headers: {
//       'Content-Type': 'application/json;charset=UTF-8'
//     }
//   })
// }
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
export function addOutPick(values) {
  return request({
    url: api.dataAdd,
    method: 'post',
    data: values,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
export function OrderPick(values, jianxuankou) {
  return request({
    url: api.OrderPick + '?ports=' + jianxuankou,
    method: 'post',
    data: values,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
export function pickPallet(values, palletCode) {
  return request({
    url: api.pickPallet + '?palletCode=' + palletCode,
    method: 'post',
    data: values,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
