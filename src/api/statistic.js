import request from '@/utils/request'

const api = {
  materialChartData: '/statistic/material/chart',
  dayChartData: '/statistic/day/chart',
  libraryStatementData: '/statistic/library/statement',
  pieChartData: '/statistic/pie/chart'
}

export function materialChart(values) {
  return request({
    url: api.materialChartData,
    method: 'post',
    // params: { pageNo: 1, pageSize: 10 },
    data: values,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
export function dayChart(values) {
  return request({
    url: api.dayChartData,
    method: 'post',
    // params: { pageNo: 1, pageSize: 10 },
    data: values,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
export function libraryStatement(values) {
  return request({
    url: api.libraryStatementData,
    method: 'post',
    // params: { pageNo: 1, pageSize: 10 },
    data: values,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
export function pieChart(values) {
  return request({
    url: api.pieChartData,
    method: 'post',
    // params: { pageNo: 1, pageSize: 10 },
    data: values,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
