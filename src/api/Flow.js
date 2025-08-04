import request from '@/utils/request'

const api = {
  FlowPage: '/Flow/GetFlowBy'
}

export default api

export function getPage(parameter, queryParam) {
  return request({
    url: api.FlowPage,
    method: 'post',
    data: queryParam,
    params: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
