import request from '@/utils/request'

const api = {
  find: '/led/find',
  addOrUpdate: '/led/addOrUpdate'
}

export default api

export function getLed(queryParam) {
  return request({
    url: api.find,
    method: 'post',
    data: queryParam,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function alterLed(queryParam) {
  return request({
    url: api.addOrUpdate,
    method: 'post',
    data: queryParam,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
