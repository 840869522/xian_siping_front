import request from '@/utils/request'

const api = {
  getDicBy: 'Dictionary/GetAllSysDictionaryBy',
  getRoleBy: 'Role/GetAllRoleName',
  getDropDownListBy: 'Dictionary/GetDropDownList'
}
export default api

export function getDicBy(data) {
  return request({
    url: api.getDicBy,
    method: 'post',
    data: data,
    params: { pageNo: 1, pageSize: 1000 },
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function getDropDownListBy(dicDisplayName) {
  return request({
    url: api.getDropDownListBy + '?dicDisplayName=' + dicDisplayName,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function getRoleBy() {
  return request({
    url: api.getRoleBy,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
