import request from '@/utils/request'

const api = {
  pick2TaskX: '/TaskX/Pick2TaskX',
  TaskXInsert: '/TaskX/TaskXInsert',
  dataBy: '/TaskX/GetTaskXByPage',
  xzkIn: '/TaskX/XZKIn',
  xzkOut: '/TaskX/XZKOut',
  xzkStatus: '/TaskX/XZKstatus',
  dataUpdate: '/TaskX/UpdateTaskXStatusByTaskNo',
  XZKCmdopt: '/TaskX/XZKCmdopt',
  getTaskInfo: 'TaskX/CarGetFirstTask',

  TaskXFinish: '/TaskX/TaskXFinish',
  // 大件库
  TaskDInsert: '/TaskD/TaskDInsert',
  pick2TaskD: '/TaskD/Pick2TaskD',
  GetTaskDByPage: '/TaskD/GetTaskDByPage',
  UpdateTaskDStatusByTaskNo: '/TaskD/UpdateTaskDStatusByTaskNo',
  DJKtaskChange: '/TaskD/DJKtaskChange',
  // 自动化库
  GetTaskPByPage: '/TaskP/GetTaskPByPage',
  UpdateTaskZStatusByTaskNo: '/TaskP/UpdateTaskPStatusByTaskNo',
  TaskPInsert: '/TaskP/TaskPInsert',
  trussBoxTask: '/TaskZ/trussBoxTask',
  pick2TaskP: '/TaskP/Pick2TaskP',

  TaskBInsert: '/TaskB/TaskBInsert',
  GetTaskBByPage: '/TaskB/GetTaskBByPage',
  TaskSortInsert: '/TaskB/TaskSortInsert',
  pick2TaskB: '/TaskB/Pick2TaskB',
  ZDKtaskSorter: '/TaskZ/ZDKtaskSorter'
}

export default api
export function ZDKtaskSorter(data) {
  return request({
    url: api.ZDKtaskSorter,
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
export function pick2TaskB(data) {
  return request({
    url: api.pick2TaskB,
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
export function pick2TaskP(data) {
  return request({
    url: api.pick2TaskP,
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
export function trussBoxTask(data) {
  return request({
    url: api.trussBoxTask,
    data: data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
export function TaskSortInsert(data) {
  return request({
    url: api.TaskSortInsert,
    data: data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
export function TaskXFinish(data) {
  return request({
    url: api.TaskXFinish,
    data: data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
export function getTaskInfo(parameter) {
  return request({
    url: api.getTaskInfo + '?carNo=' + parameter,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
export function pick2TaskX(data) {
  return request({
    url: api.pick2TaskX,
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
export function getData(parameter, queryParam) {
  return request({
    url: api.dataBy,
    method: 'post',
    data: queryParam,
    params: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
export function xzkIn(values) {
  return request({
    url: api.xzkIn,
    method: 'post',
    // params: parameter,
    data: values,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
export function xzkOut(values) {
  return request({
    url: api.xzkOut,
    method: 'post',
    data: values,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
export function xzkStatus(values) {
  return request({
    url: api.xzkStatus,
    method: 'post',
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
export function XZKCmdopt(values) {
  return request({
    url: api.XZKCmdopt,
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
export function TaskXInsert(values) {
  return request({
    url: api.TaskXInsert,
    method: 'post',
    // params: { pageNo: 1, pageSize: 10 },
    data: values,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
export function addDataConfim(values) {
  return request({
    url: api.addDataConfim,
    method: 'post',
    // params: { pageNo: 1, pageSize: 10 },
    data: values,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
//
//
//
//
// 大件库
//
//
//
//
export function DJKtaskChange(data) {
  return request({
    url: api.DJKtaskChange,
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
export function TaskDInsert(data) {
  return request({
    url: api.TaskDInsert,
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
export function pick2TaskD(data) {
  return request({
    url: api.pick2TaskD,
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
export function GetTaskDByPage(parameter, queryParam) {
  return request({
    url: api.GetTaskDByPage,
    method: 'post',
    data: queryParam,
    params: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
export function UpdateTaskDStatusByTaskNo(values) {
  return request({
    url: api.UpdateTaskDStatusByTaskNo,
    method: 'post',
    // params: { pageNo: 1, pageSize: 10 },
    data: values,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
//
//
//
//
// 自动化库
//
//
//
export function GetTaskPByPage(parameter, queryParam) {
  return request({
    url: api.GetTaskPByPage,
    method: 'post',
    data: queryParam,
    params: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
export function UpdateTaskZStatusByTaskNo(values) {
  return request({
    url: api.UpdateTaskZStatusByTaskNo,
    method: 'post',
    // params: { pageNo: 1, pageSize: 10 },
    data: values,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
export function TaskPInsert(data) {
  return request({
    url: api.TaskPInsert,
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
// 料箱库

export function TaskBInsert(data) {
  return request({
    url: api.TaskBInsert,
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
export function GetTaskBByPage(parameter, queryParam) {
  return request({
    url: api.GetTaskBByPage,
    method: 'post',
    data: queryParam,
    params: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
