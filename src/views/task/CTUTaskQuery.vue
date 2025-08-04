<template>
  <a-card :bordered="false">
    <!-- 检索相关 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @submit="getDataBy" :form="formBy">
        <a-row :gutter="48">
          <a-col :md="6" :sm="24">
            <a-form-item label="任务号">
              <a-input v-decorator="['task_no']" />
            </a-form-item>
          </a-col>
          <!-- <a-col :md="6" :sm="24">
            <a-form-item label="货位号">
              <a-input v-decorator="['location_code']" />
            </a-form-item>
          </a-col> -->
          <a-col :md="6" :sm="24">
            <a-form-item label="料箱编号">
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
              <a-button html-type="submit" type="primary">查询</a-button>
              <a-button style="margin-left: 8px" @click="clearSelectBy">重置</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <!-- 表格 -->
    <s-table row-key="id" bordered ref="table" size="default" :columns="columns" :data="loadData">
      <span slot="action" slot-scope="text, record">
        <a @click="updateSure(record)"
          :disabled="record.status=='已完成'||record.status=='已取消'">强制取消</a>
      </span>
    </s-table>
  </a-card>
</template>

<script>
import pick from 'lodash.pick'
import { STable } from '@/components'
import {
  GetCTUByPage,
  TaskCancel
  // DJKtaskChange
} from '@/api/CtuTask'
import { getDropDownListBy } from '@/api/global'
import storage from 'store'
// 表头
const columns = [
  {
    title: '任务号',
    dataIndex: 'task_no'
  },
  {
    title: '任务类型',
    dataIndex: 'task_type'
  },
  {
    title: '料箱编号',
    dataIndex: 'pallet_code'
  },
  {
    title: '起点',
    dataIndex: 'org_position'
  },
  {
    title: '终点',
    dataIndex: 'target_position'
  },
  {
    title: '状态',
    dataIndex: 'status'
  },
  {
    title: '创建时间',
    dataIndex: 'create_time'
  },
  {
    title: '更新时间',
    dataIndex: 'update_time'
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
      // startTime: '1900-01-01',
      // endTime: '3000-01-01',
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return GetCTUByPage(parameter, this.queryParam).then(res => {
          console.log(res)
          return res.result
        })
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
    updateSure(value) {
      value.id = value.task_no
      TaskCancel(value).then(res => {
        console.log(res)
        if (res.status) {
          this.visibleUpdate = false
          this.$refs.table.refresh(true)
          this.$message.success(res.message)
        } else {
          this.$message.warn(res.message)
        }
      })
    },
    // 条件查询按钮点击事件
    getDataBy(e) {
      e.preventDefault()
      this.formBy.validateFields((err, values) => {
        if (!err) {
          this.queryParam = values
          this.$refs.table.refresh(true)
        }
      })
    },
    // 重置检索条件
    clearSelectBy() {
      this.startTime = '1900-01-01'
      this.endTime = '3000-01-01'
      this.dateVar = ['', '']
      this.queryParam = { material_code: '', material_name: '', pallet_code: '', location_code: '', status: '' }
      this.formBy.setFieldsValue(pick(this.queryParam, ['material_code', 'material_name', 'pallet_code', 'location_code', 'status']))
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
