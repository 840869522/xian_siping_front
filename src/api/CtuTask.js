import request from '@/utils/request'

const api = {
  GetCTUByPage: '/TaskCtu/GetCTUByPage',
  AddAgvTask: '/TaskCtu/TaskDownload',
  TaskCancel: '/TaskCtu/TaskCancel'
}

export default api

export function GetCTUByPage(parameter, queryParam) {
  return request({
    url: api.GetCTUByPage,
    method: 'post',
    data: queryParam,
    params: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
// export function getDataBy(parameter, values) {
//   return request({
//     url: api.dataBy,
//     method: 'post',
//     params: parameter,
//     data: values,
//     headers: {
//       'Content-Type': 'application/json;charset=UTF-8'
//     }
//   })
// }
export function TaskCancel(values) {
  return request({
    url: api.TaskCancel,
    method: 'post',
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
export function AddCtuTask(values, palletCode) {
  return request({
    url: api.AddAgvTask + '?palletCode=' + palletCode,
    method: 'post',
    // params: { pageNo: 1, pageSize: 10 },
    data: values,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
