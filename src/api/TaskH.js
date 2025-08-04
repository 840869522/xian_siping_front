import request from '@/utils/request'

const api = {
  GetStorageEmpty: '/TaskH/GetStorageEmpty',
  InTask: '/TaskH/InTask',
  OutTask: '/TaskH/OutTask',
  GetStorageOut: '/TaskH/GetStorageOut'
}

export default api

export function GetStorageEmpty(value) {
  return request({
    url: api.GetStorageEmpty,
    method: 'post',
    data: value,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
export function InTask(value) {
  return request({
    url: api.InTask,
    method: 'post',
    params: value,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
export function GetStorageOut(value) {
  return request({
    url: api.GetStorageOut,
    method: 'post',
    params: value,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
