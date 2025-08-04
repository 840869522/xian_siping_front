<template>
  <a-card :bordered="false">
    <!-- 检索相关 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" :form="form">
        <a-row :gutter="48">
          <a-col :md="4" :sm="24">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="出库单：">
              <a-input placeholder="出库单"
                v-decorator="['out_order_id', { rules: [{ required: false}] }]" />
            </a-form-item>

          </a-col>
          <a-col :md="4" :sm="24">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="器材编号：">
              <a-input placeholder="器材编号"
                v-decorator="['material_code', { rules: [{ required: false}] }]" />
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="24">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="器材名称：">
              <a-input placeholder="器材编号"
                       v-decorator="['material_name', { rules: [{ required: false}] }]" />
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="24">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="批次">
              <a-input placeholder="批次" v-decorator="['batch', { rules: [{ required: false}] }]" />
            </a-form-item>
          </a-col>
          <a-col :md="3" :sm="24">
            <span class="table-page-search-submitButtons">
              <a-button type="primary" @click="queryData">
                查询
              </a-button>
              <a-button style="margin-left: 8px" @click="clearData">重置</a-button>
            </span>
          </a-col>
          <a-col :md="4" :sm="24">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="拣选数量">
              <a-input placeholder="拣选数量"
                v-decorator="['pick_count', { rules: [{ required: false}] }]" />
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="24">
            <a-button type="primary" style="margin-left: 8px" @click="TaskSortInsert">
              拣选完成
            </a-button>
          </a-col>

        </a-row>
      </a-form>
    </div>
    <!-- 表格 -->
    <s-table bordered row-key="material" ref="table" :pageSize="20" size="default"
      :columns="columns" :data="loadData"
      :row-selection="{selectedRowKeys:selectedRowKeys,onChange:onSelectChange}">
    </s-table>
  </a-card>
</template>

<script>
import pick from 'lodash.pick'
import { STable } from '@/components'
import { getDataBy } from '@/api/OutPick'
import { TaskSortInsert } from '@/api/TaskX'
const columns = [
  {
    title: '出库单号',
    dataIndex: 'out_order_id'
  },
  {
    title: '明细id',
    dataIndex: 'out_order_detail_id'
  },
  {
    title: '料箱编号',
    dataIndex: 'pallet_code'
  },
  {
    title: '配盘数量',
    dataIndex: 'pick_qty'
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
    title: '批号',
    dataIndex: 'batch'
  },
  {
    title: '库存数量',
    dataIndex: 'inventory_count'
  }
]
export default {
  name: 'SecondFloorPick',
  components: {
    STable
  },
  data() {
    return {
      selectedRowKeys: [],
      selectedData: [],
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
      validator: (rule, value, cbfn) => {
        // console.log(rule, value, cbfn)
        if (!value) {
          cbfn('请输入有效值')
        } else if (!value.trim().length) {
          cbfn('请输入有效值')
        }
        cbfn()
      },
      checkedData: null,
      queryParam: {},
      loadData: parameter => {
        return getDataBy(parameter, this.queryParam).then(res => {
          console.log(res)
          return res.result
        })
      }
    }
  },
  methods: {
    // nextTask(e) {
    //   const outOrderId = this.form.getFieldValue('pallet_code')
    //   if (outOrderId === '' || outOrderId === undefined) {
    //     this.$message.warn('请扫描托盘编号！')
    //     return
    //   }
    //   this.queryData(e)
    // },
    onSelectChange(selectedRowKeys, selectedData) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedData = selectedData
    },
    clearData() {
      this.queryParam = { material_code: '', material_name: '', pallet_code: '', location_code: '', out_order_id: '' }
      this.form.setFieldsValue(pick(this.queryParam, ['material_code', 'material_name', 'pallet_code', 'location_code', 'out_order_id']))
    },
    queryData(e) {
      this.selectedRowKeys = []
      this.selectedData = []
      this.queryParam.out_order_id = this.form.getFieldValue('out_order_id')
      this.queryParam.material_code = this.form.getFieldValue('material_code')
      this.queryParam.batch = this.form.getFieldValue('batch')
      this.queryParam.material_name = this.form.getFieldValue('material_name')
      this.$refs.table.refresh()
      // e.preventDefault()
      // const outOrderId = this.form.getFieldValue('out_order_id')
      // const materialCode = this.form.getFieldValue('material_code')
      // const batch = this.form.getFieldValue('batch')
      // getDataBy({ pageSize: 1, pageNo: 1 }, { out_order_id: outOrderId, material_code: materialCode, batch: batch }).then(res => {
      //   if (res.status) {
      //     this.checkedData = res.result.anything[0]
      //     this.form.setFieldsValue(pick(res.result.anything[0], ['material_code', 'material_name', 'batch', 'pick_qty', 'out_order_id']))
      //   } else {
      //     this.$message.warn(res.message)
      //   }
      // })
    },
    TaskSortInsert() {
      if (this.selectedData.length !== 1) {
        this.$message.warn('只能选择一条数据！')
        return
      }
      const pickCount = this.form.getFieldValue('pick_count')
      const params = {}
      params.material_name = this.selectedData[0].material_name
      params.material_code = this.selectedData[0].material_code
      params.order_count = this.selectedData[0].pick_qty
      params.out_order_detail_id = this.selectedData[0].out_order_detail_id
      params.out_order_id = this.selectedData[0].out_order_id
      params.pick_count = parseInt(pickCount)
      params.status = '待执行'
      console.log(params)
      TaskSortInsert([params]).then(res => {
        this.$message.warn('后台没给返回消息')
      })
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
