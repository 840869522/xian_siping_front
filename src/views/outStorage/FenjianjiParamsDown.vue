<template>
  <a-card :bordered="false">
    <!-- 检索相关 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @submit="getDataBy" :form="formBy">
        <a-row :gutter="48">
          <a-col :md="6" :sm="24">
            <a-form-item label="出库单号">
              <a-input v-decorator="['out_order_id']" />
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

          <a-col :md="6" :sm="24">
            <span class="table-page-search-submitButtons">
              <a-button @click="clearSelectBy">重置</a-button>
              <a-button style="margin-left: 8px" html-type="submit" type="primary">查询</a-button>
              <a-button style="margin-left: 8px" @click="creatTask"
                type="primary">分拣机任务下发</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <!-- 表格 -->
    <s-table row-key="id" :customRow="customRow" bordered ref="table" size="default"
      :columns="columns" :data="loadData">
      <a-tag :color="text == '启用' ? 'green' : 'red'" slot="status" slot-scope="text">{{ text }}
      </a-tag>
      <span slot="createTime" slot-scope="text">{{ text | moment }}</span>
    </s-table>
  </a-card>
</template>

<script>
import pick from 'lodash.pick'
import { STable } from '@/components'
import { getDataBy } from '@/api/OutPick'
import { ZDKtaskSorter } from '@/api/TaskX'
import { getDropDownListBy } from '@/api/global'
import storage from 'store'
// 表头
const columns = [
  {
    title: 'ID',
    dataIndex: 'id'
  },
  {
    title: '拣选方式',
    dataIndex: 'out_pick_type'
  },
  {
    title: '载具编号',
    dataIndex: 'pallet_code'
  },
  {
    title: '格子号',
    dataIndex: 'cell_id'
  },
  {
    title: '配盘数量',
    dataIndex: 'pick_qty'
  },
  {
    title: '出库单号',
    dataIndex: 'out_order_id'
  },
  {
    title: '出库明细ID',
    dataIndex: 'out_order_detail_id'
  },
  {
    title: '库存ID',
    dataIndex: 'inventory_id'
  },
  {
    title: '器材编号',
    dataIndex: 'material_code'
  },
  {
    title: '器材名称',
    dataIndex: 'material_name'
  },
  {
    title: '拣货台编号',
    dataIndex: 'pickstation_no'
  },
  {
    title: '拣货目标编号',
    dataIndex: 'target_no'
  },
  {
    title: '批号',
    dataIndex: 'batch'
  },
  {
    title: '创建人',
    dataIndex: 'creator'
  },
  {
    title: '创建时间',
    dataIndex: 'create_time'
  }
]

export default {
  name: 'TaskCreat',
  components: {
    STable
  },
  data() {
    return {
      // 条件查询form
      formBy: this.$form.createForm(this),

      // 查询参数
      queryParam: {},
      // 表头
      columns,
      // startTime: '1900-01-01',
      // endTime: '3000-01-01',
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        // parameter.startTime = this.startTime
        // parameter.endTime = this.endTime
        return getDataBy(parameter, this.queryParam).then(res => {
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
      dateVar: ['', ''],
      storageTypeText: ''
    }
  },
  methods: {
    // 点击出库单行
    customRow(record, index) {
      return {
        on: {
          // 鼠标单击行
          click: event => {
            // 点击出库单给其行设置高亮颜色
            event.currentTarget.parentNode.querySelectorAll('tr').forEach(item => {
              item.style.background = 'white'
            })
            this.checkedData = record
            event.currentTarget.style.background = '#e6f7ff'
            this.formBy.setFieldsValue(pick(record, ['out_order_id']))
          }
        }
      }
    },
    creatTask() {
      const outOrderId = this.formBy.getFieldValue('out_order_id')
      if (outOrderId == null || outOrderId === '' || outOrderId === undefined) {
        this.$message.warn('请输入出库单号！')
        return
      }
      ZDKtaskSorter(outOrderId).then(res => {
        if (res.status) {
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
      getDropDownListBy('baseStatus').then(res => {
        this.statusDic = res.result.anything
      })
    }
  },
  created() {
    this.getDic()
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
