<template>
  <a-card :bordered="false">
    <!-- 检索相关 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" :form="form">
        <a-row :gutter="48">
          <a-col :md="6" :sm="24">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="载具/暂存号：">
              <a-input placeholder="载具/暂存号" @blur="queryData" v-decorator="['pallet_code']" />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="器材名称：">
              <a-input placeholder="器材名称" @blur="queryData" v-decorator="['material_name']" />
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="24">
            <span class="table-page-search-submitButtons">
              <a-button type="primary" @click="queryData">
                查询
              </a-button>

              <a-button style="margin-left: 8px" @click="clearSelectBy">重置</a-button>
              <a-button style="margin-left: 8px" @click="bindData" type="primary">确认出库
              </a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <!-- 表格 -->
    <s-table :row-selection="{selectedRowKeys:selectedRowKeys,onChange:onSelectChange}"
      :customRow="customRow" bordered row-key="material" ref="table" :pageSize="20" size="default"
      :columns="columns" :data="loadData">
    </s-table>
  </a-card>
</template>

<script>
import pick from 'lodash.pick'
import { STable } from '@/components'
// import { addData } from '@/api/Task'
import { checkOut } from '@/api/OutPick'
import { getDataByInventory } from '@/api/Inventory'
const columns = [
  {
    title: '载具编号',
    dataIndex: 'pallet_code'
  },
  {
    title: '器材名称',
    dataIndex: 'material_name'
  },
  {
    title: '库存数量',
    dataIndex: 'inventory_count'
  },
  {
    title: '批号',
    dataIndex: 'batch'
  },
  {
    title: '出库订单ID',
    dataIndex: 'out_order_id'
  },
  {
    title: '出库单明细ID',
    dataIndex: 'out_order_detail_id'
  }
]
export default {
  name: 'OutStorageSure',
  components: {
    STable
  },
  data() {
    return {
      columns,
      // 编辑form
      form: this.$form.createForm(this),
      // 动态栅格
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
      startTime: '1900-01-01',
      endTime: '3000-01-01',
      queryParam: {},
      loadData: parameter => {
        parameter.startTime = this.startTime
        parameter.endTime = this.endTime
        return getDataByInventory(parameter, this.queryParam).then(res => {
          console.log(res)
          if (res.result.anything.length > 0) {
            this.checkedData = res.result.anything[0]
          }
          return res.result
        })
      },
      checkedData: null,
      selectedRowKeys: [],
      selectedData: []
    }
  },
  methods: {
    clearSelectBy() {
      this.queryParam = { material_name: '', pallet_code: '' }
      this.form.setFieldsValue(pick(this.queryParam, ['material_name', 'pallet_code']))
      this.$refs.table.refresh(true)
    },
    onSelectChange(selectedRowKeys, selectedData) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedData = selectedData
    },
    // 点击入库单行
    customRow(record, index) {
      return {
        on: {
          // 鼠标单击行
          click: event => {
            // 点击入库单给其行设置高亮颜色
            event.currentTarget.parentNode.querySelectorAll('tr').forEach(item => {
              item.style.background = 'white'
            })
            event.currentTarget.style.background = '#e6f7ff'
            this.form.setFieldsValue(pick(record, ['pallet_code']))
          }
        }
      }
    },
    clearData() {
      this.queryParam = { material_code: '', material_name: '', pallet_code: '', location_code: '', status: '' }
      this.formBy.setFieldsValue(pick(this.queryParam, ['material_code', 'material_name', 'pallet_code', 'location_code', 'status']))
    },
    bindData() {
      if (this.selectedData.length !== 1) {
        this.$message.warn('每次只能选择一条数据')
        return
      }
      checkOut(this.selectedData[0]).then(res => {
        if (res.status) {
          this.$message.success(res.message)
        } else {
          this.$message.warn(res.message)
        }
      })
    },
    queryData(e) {
      e.preventDefault()
      const palletId = this.form.getFieldValue('pallet_code')
      const materialName = this.form.getFieldValue('material_name')
      this.queryParam.pallet_code = palletId
      this.queryParam.material_name = materialName
      this.$refs.table.refresh()
    }
  },
  created() {},
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
.btnStyle {
  width: 100%;
}
</style>
