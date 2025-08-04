<template>
  <a-card :bordered="false">
    <!-- 检索相关 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @submit="getDataBy" :form="formBy">
        <a-row :gutter="48">
          <a-col :md="3" :sm="24">
            <a-form-item label="概述">
              <a-input v-decorator="['flow_title']" />
            </a-form-item>
          </a-col>
          <a-col :md="3" :sm="24">
            <a-form-item label="载具编号">
              <a-input v-decorator="['pallet_code']" />
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="24">
            <a-form-item label="物料编号">
              <a-input v-decorator="['material_code']" />
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="24">
            <a-form-item label="物料名称">
              <a-input v-decorator="['material_name']" />
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="24">
            <a-form-item label="批次">
              <a-input v-decorator="['batch']" />
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="24">
            <a-form-item label="订单编号">
              <a-input v-decorator="['order_id']" />
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="选择时间：">
              <a-range-picker :placeholder="['开始时间', '结束时间']" v-model="dateVar"
                              @change="onChange" />
            </a-form-item>
          </a-col>
          <a-col :md="3" :sm="24">
            <span class="table-page-search-submitButtons">
              <a-button @click="clearSelectBy">重置</a-button>
              <a-button style="margin-left: 8px" html-type="submit" type="primary">查询</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <!-- 表格 -->
    <s-table row-key="inventory_id" bordered ref="table" size="default" :columns="columns"
      :data="loadData">
      <a-tag :color="text == '启用' ? 'green' : 'red'" slot="status" slot-scope="text">{{ text }}
      </a-tag>
    </s-table>

  </a-card>
</template>

<script>
import pick from 'lodash.pick'
import { STable } from '@/components'
import { getPage } from '@/api/Flow'
import { getDropDownListBy, getDicBy } from '@/api/global'
// 表头
const columns = [
  {
    title: '概述',
    dataIndex: 'flow_title'
  },
  {
    title: '类型',
    dataIndex: 'flow_type'
  },
  {
    title: '接口',
    dataIndex: 'url'
  },
  {
    title: '物料编号',
    dataIndex: 'material_code'
  },
  {
    title: '物料名称',
    dataIndex: 'material_name'
  },
  {
    title: '批次',
    dataIndex: 'batch'
  },
  {
    title: '载具编号',
    dataIndex: 'pallet_code'
  },
  {
    title: '变更数量',
    dataIndex: 'cmd_count'
  },
  {
    title: '库存数量',
    dataIndex: 'after_count'
  },
  {
    title: '订单编号',
    dataIndex: 'order_id'
  },
  {
    title: '操作人',
    dataIndex: 'creator'
  },
  {
    title: '操作时间',
    dataIndex: 'create_time'
  }
]

export default {
  name: 'LocationMap',
  components: {
    STable
  },
  data() {
    return {
      startTime: '',
      endTime: '',
      dateVar: ['', ''],
      storageTypeDicList: [],
      // 添加模态框是否显示
      visibleAdd: false,
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
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        const storageTypeText = JSON.parse(localStorage.getItem('storageTypeText'))
        this.queryParam.warehouse = storageTypeText
        this.queryParam.startTime = this.startTime
        this.queryParam.endTime = this.endTime
        return getPage(parameter, this.queryParam).then(res => {
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
      }
    }
  },
  methods: {
    onChange(date, dateString) {
      this.startTime = dateString[0]
      this.endTime = dateString[1]
      this.dateVar = [this.startTime, this.endTime]
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
      this.queryParam = { flow_title: '', pallet_code: '', material_code: '', material_name: '', batch: '', order_id: '' }
      this.formBy.setFieldsValue(pick(this.queryParam, ['flow_title', 'pallet_code', 'material_code', 'material_name', 'batch', 'order_id']))
      this.startTime = ''
      this.endTime = ''
      this.dateVar = ['', '']
      this.$refs.table.refresh(true)
    },
    // 编辑按钮取值给模态框
    updateGetValue(record) {
      this.visibleUpdate = true
      this.$nextTick(() => {
        this.formUpdate.setFieldsValue(pick(record, ['pallet_code', 'location_code', 'status']))
      })
    },
    // 取检索条件的数据字典
    getDic() {
      getDropDownListBy('baseStatus').then(res => {
        this.statusDic = res.result.anything
      })
      getDicBy({ dic_name: 'store_classify' }).then(res => {
        this.storageTypeDicList = res.result.anything
      })
    }
  },
  created() {
    this.getDic()
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
