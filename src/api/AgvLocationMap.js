import request from '@/utils/request'

const api = {

  GetAGVMapByPage: '/AgvLocationMap/GetAGVMapByPage',
  UpdateAGVMapByLocation: '/AgvLocationMap/UpdateAGVMapByLocation',
  GetCTUMapByPage: '/CtuLocationMap/GetCTUMapByPage',
  UpdateCTUMapByLocation: '/CtuLocationMap/UpdateCTUMapByLocation'

}
export default api
export function GetAGVMapByPage(parameter, data) {
  return request({
    url: api.GetAGVMapByPage,
    method: 'post',
    params: parameter,
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
export function GetCTUMapByPage(parameter, data) {
  return request({
    url: api.GetCTUMapByPage,
    method: 'post',
    params: parameter,
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
export function UpdateAGVMapByLocation(data) {
  return request({
    url: api.UpdateAGVMapByLocation,
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
export function UpdateCTUMapByLocation(data) {
  return request({
    url: api.UpdateCTUMapByLocation,
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
