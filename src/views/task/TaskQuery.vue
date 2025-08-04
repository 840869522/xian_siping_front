<template>
  <a-card :bordered="false">
    <!-- 检索相关 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" :form="formBy">
        <a-row :gutter="48">
          <a-col :md="6" :sm="24">
            <a-form-item label="任务号">
              <a-input v-decorator="['task_no']" />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="货位号">
              <a-input v-decorator="['location_code']" />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item :label="storageTypeText!=='B库'?'托盘编号':'料箱编号'">
              <a-input v-decorator="['pallet_code']" />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="状态">
              <a-select placeholder="请选择" v-decorator="['status']">
                <a-select-option v-for="item in statusDic" :key="item" :value="item">
                  {{ item }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <!-- <a-col :md="6" :sm="24">
            <a-form-item label="选择时间：">
              <a-range-picker :placeholder="['开始时间', '结束时间']" :value="dateVar" @change="onChange" />
            </a-form-item>
          </a-col> -->
          <a-col :md="4" :sm="24">
            <span class="table-page-search-submitButtons">
              <a-button @click="getDataBy" type="primary">查询</a-button>
              <a-button style="margin-left: 8px" @click="clearSelectBy">重置</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <!-- 表格 -->
    <s-table row-key="id" bordered ref="table" size="default"
      :columns="storageTypeText==='X库'? columnsX:columns" :data="loadData">
      <span slot="action" slot-scope="text, record">
        <a @click="updateTask(record)">任务更改</a>
        <a-divider type="vertical" />
        <a @click="updateSure(record)">强制完成</a>
      </span>
    </s-table>
    <!-- 编辑 -->
    <a-modal title="编辑" style="top: 20px" :width="800" v-model="visibleUpdate" @ok="updateSureTask">
      <a-form class="permission-form" :form="formUpdate">
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="任务编号">
          <a-input disabled v-decorator="['taskId']" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="货位号">
          <a-input placeholder="货位号" v-decorator="['endNode']" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="任务状态">
          <a-input disabled v-decorator="['status']" />
        </a-form-item>
      </a-form>
    </a-modal>
  </a-card>
</template>

<script>
import pick from 'lodash.pick'
import { STable } from '@/components'
import {
  getData,
  updateData,
  GetTaskDByPage,
  UpdateTaskDStatusByTaskNo,
  GetTaskPByPage,
  UpdateTaskZStatusByTaskNo,
  XZKCmdopt,
  GetTaskBByPage
  // DJKtaskChange
} from '@/api/TaskX'
import { getDropDownListBy } from '@/api/global'
import storage from 'store'
// 表头
const columns = [
  {
    title: 'ID',
    dataIndex: 'id'
  },
  {
    title: '任务号',
    dataIndex: 'task_no'
  },
  {
    title: '货位号',
    dataIndex: 'location_code'
  },
  {
    title: '任务类型',
    dataIndex: 'task_type'
  },
  {
    title: '载具编号',
    dataIndex: 'pallet_code'
  },
  {
    title: '站台编号',
    dataIndex: 'prot_no'
  },
  {
    title: '状态',
    dataIndex: 'status'
  },
  {
    title: '创建人',
    dataIndex: 'creator'
  },
  {
    title: '创建时间',
    dataIndex: 'create_time'
  },
  {
    title: '操作',
    dataIndex: 'action',
    scopedSlots: { customRender: 'action' }
  }
]
const columnsX = [
  {
    title: 'ID',
    dataIndex: 'id'
  },
  {
    title: '任务号',
    dataIndex: 'task_no'
  },
  {
    title: '货位号',
    dataIndex: 'location_code'
  },
  {
    title: '任务类型',
    dataIndex: 'task_type'
  },
  {
    title: '载具编号',
    dataIndex: 'pallet_code'
  },
  {
    title: '站台编号',
    dataIndex: 'prot_no'
  },
  {
    title: '叉车号',
    dataIndex: 'car_no'
  },
  {
    title: '状态',
    dataIndex: 'status'
  },
  {
    title: '创建人',
    dataIndex: 'creator'
  },
  {
    title: '创建时间',
    dataIndex: 'create_time'
  },
  {
    title: '操作',
    dataIndex: 'action',
    scopedSlots: { customRender: 'action' }
  }
]
export default {
  name: 'TaskQuery',
  components: {
    STable
  },
  data() {
    return {
      // 更新模态框是否显示
      visibleUpdate: false,
      // 编辑form
      formUpdate: this.$form.createForm(this),
      // 条件查询form
      formBy: this.$form.createForm(this),
      // 新增form
      formAdd: this.$form.createForm(this),
      // 查询参数
      queryParam: {},
      // 表头
      columns,
      columnsX,
      // startTime: '1900-01-01',
      // endTime: '3000-01-01',
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        // parameter.startTime = this.startTime
        // parameter.endTime = this.endTime
        if (this.storageTypeText === 'X库') {
          return getData(parameter, this.queryParam).then(res => {
            return res.result
          })
        } else if (this.storageTypeText === 'D库') {
          return GetTaskDByPage(parameter, this.queryParam).then(res => {
            return res.result
          })
        } else if (this.storageTypeText === 'P库') {
          return GetTaskPByPage(parameter, this.queryParam).then(res => {
            console.log(res)
            return res.result
          })
        } else if (this.storageTypeText === 'B库') {
          return GetTaskBByPage(parameter, this.queryParam).then(res => {
            console.log(res)
            return res.result
          })
        }
      },
      // 状态字典列表
      statusDic: [],
      // 动态栅格
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
      dateVar: ['', '']
    }
  },
  methods: {
    // 此处到时候做移库
    updateSureTask(e) {
      e.preventDefault()
      this.formUpdate.validateFields((err, values) => {
        if (!err) {
          this.$message.warn('这个接口后边用于满入处理')
          // DJKtaskChange(values).then(res => {
          //   if (res.status) {
          //     this.visibleUpdate = false
          //     this.$message.success(res.message)
          //   } else {
          //     this.$message.warn(res.message)
          //   }
          // })
        }
      })
    },
    updateTask(values) {
      this.visibleUpdate = true
      this.$nextTick(() => {
        const temp = { endNode: values.location_code, taskId: values.task_no, status: '待执行' }
        this.formUpdate.setFieldsValue(pick(temp, ['endNode', 'taskId', 'status']))
      })
    },
    // 确定更新数据
    updateSure(values) {
      values.status = '已取消'
      values.updater = this.userInfo.user_name
      if (this.storageTypeText === 'X库') {
        updateData(values).then(res => {
          if (res.status) {
            this.$refs.table.refresh(true)
            this.$message.success(res.message)
          } else {
            this.$message.warn(res.message)
          }
        })
        // 清空穿梭板wcs任务指令集
        XZKCmdopt(values).then(res => {
          console.log(values, res)
          if (!res.status) {
            this.$message.warn(res.data.message)
          }
        })
      } else if (this.storageTypeText === 'D库') {
        UpdateTaskDStatusByTaskNo(values).then(res => {
          if (res.status) {
            this.$refs.table.refresh(true)
            this.$message.success(res.message)
          } else {
            this.$message.warn(res.message)
          }
          console.log(res)
        })
      } else if (this.storageTypeText === 'P库' || this.storageTypeText === 'B库') {
        UpdateTaskZStatusByTaskNo(values).then(res => {
          if (res.status) {
            this.$refs.table.refresh(true)
            this.$message.success(res.message)
          } else {
            this.$message.warn(res.message)
          }
          console.log(res)
        })
      }
    },
    // 条件查询按钮点击事件
    getDataBy(e) {
      e.preventDefault()
      const params = {}
      params.pallet_code = this.formBy.getFieldValue('pallet_code')
      params.location_code = this.formBy.getFieldValue('location_code')
      params.task_no = this.formBy.getFieldValue('task_no')
      params.status = this.formBy.getFieldValue('status')
      this.queryParam = params
      this.$refs.table.refresh(true)
    },
    // 重置检索条件
    clearSelectBy() {
      this.startTime = '1900-01-01'
      this.endTime = '3000-01-01'
      this.dateVar = ['', '']
      this.queryParam = { task_no: '', material_name: '', pallet_code: '', location_code: '', status: '' }
      this.formBy.setFieldsValue(pick(this.queryParam, ['task_no', 'material_name', 'pallet_code', 'location_code', 'status']))
      this.$refs.table.refresh(true)
    },
    onChange(date, dateString) {
      this.startTime = dateString[0]
      this.endTime = dateString[1]
      this.dateVar = [this.startTime, this.endTime]
      // console.log(date, string)
    },
    // 取检索条件的数据字典
    getDic() {
      getDropDownListBy('t_task_status').then(res => {
        this.statusDic = res.result.anything
      })
    }
  },
  created() {
    this.getDic()
    this.userInfo = storage.get('userInfo')
    this.storageTypeText = storage.get('storageTypeText')
  },
  watch: {}
}
</script>

<style lang="less" scoped>
.permission-form {
  :deep(.permission-group) {
    margin-top: 0;
    margin-bottom: 0;
  }
}
</style>
