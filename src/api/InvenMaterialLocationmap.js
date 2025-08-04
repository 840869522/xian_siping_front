import request from '@/utils/request'

const api = {

  warnStorage: '/InvenMaterialLocationmap/GetInvenMaterialLocationmapBy',
  palletUpDown: '/InvenMaterialLocationmap/PalletUpDown',
  GetBy: '/InvenMaterialLocationmap/GetBy',
  GetEmptyPalletByWarehouse: '/InvenMaterialLocationmap/GetEmptyPalletByWarehouse',
  GetLocationmap: '/InvenMaterialLocationmap/GetLocationmap'
}
export default api
export function GetLocationmap(parameter) {
  return request({
    url: api.GetLocationmap,
    method: 'post',
    params: parameter,
    // data: values,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
export function GetEmptyPalletByWarehouse(parameter, values) {
  return request({
    url: api.GetEmptyPalletByWarehouse,
    method: 'post',
    params: parameter,
    data: values,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
export function GetBy(parameter, values) {
  return request({
    url: api.GetBy,
    method: 'post',
    params: parameter,
    data: values,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
export function warnStorage(parameter, values) {
  return request({
    url: api.warnStorage,
    method: 'post',
    params: parameter,
    data: values,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
export function palletUpDown(values, type) {
  return request({
    url: api.palletUpDown + '?UpDown=' + type,
    method: 'post',
    data: values,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
