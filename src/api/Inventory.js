import request from '@/utils/request'

const api = {
  dataBy: '/Inventory/GetInventoryBy',
  dataBind: '/Inventory/BindPallet',
  dataAdd: '/Inventory/AddReceiveMaterial',
  dataUpdate: '/Inventory/UpdateInventory',
  cancelReceiveMaterial: '/Inventory/cancelReceiveMaterial',

  AddInventory: '/Inventory/AddInventory'
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
export function getDataByInventory(parameter, values) {
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
export function addDataInventory(values) {
  return request({
    url: api.dataAdd + '?inOrderId=' + values.in_order_id,
    method: 'post',
    // params: { pageNo: 1, pageSize: 10 },
    data: values,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
export function cancelReceiveMaterial(values) {
  return request({
    url: api.cancelReceiveMaterial + '?cancelQty=' + values.cancelQty + '&pallet_code=' + values.pallet_code,
    method: 'post',
    // params: { pageNo: 1, pageSize: 10 },
    data: values,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function dataBind(values, palletCode, locationCode) {
  return request({
    url: api.dataBind + '?palletCode=' + palletCode + '&localArea=' + locationCode,
    method: 'post',
    data: values,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
export function AddInventory(values, palletCode, locationCode) {
  return request({
    url: api.AddInventory + '?palletCode=' + palletCode + '&localArea=' + locationCode,
    method: 'post',
    data: values,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
