<template>

  <a-row style="padding:5% 0">
    <a-col :push="6" :span="12">
      <a-card :bordered="false">
        <a-form class="permission-form" :form="form">
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="出库单：">
            <a-input placeholder="出库单" @blur="queryData" v-decorator="['out_order_id']" />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="器材编号：">
            <a-input placeholder="器材编号" disabled v-decorator="['material_code']" />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="器材名称：">
            <a-input placeholder="器材名称" disabled v-decorator="['material_name']" />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="批号">
            <a-input placeholder="批号" disabled v-decorator="['batch']" />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="订单数量">
            <a-input placeholder="订单数量" disabled v-decorator="['order_count']" />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="已配盘数量">
            <a-input placeholder="已配盘数量" disabled v-decorator="['pick_count']" />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="可配数量:">
            <a-input placeholder="可配数量" disabled v-decorator="['pick_count_temp']" />
          </a-form-item>
          <a-form-item>
            <s-table bordered ref="table" size="default" :pageSize="3" :columns="columns"
              :data="loadData">
            </s-table>
          </a-form-item>

          <a-row type="flex" justify="space-around">
            <a-col :span="4">
              <a-button size="large" class="btnStyle" type="primary" @click="addOutPick">配盘
              </a-button>
            </a-col>
            <a-col :span="4">
              <a-button size="large" class="btnStyle" type="primary" @click="getData">下件物料
              </a-button>
            </a-col>
            <a-col :span="4">
              <a-button size="large" class="btnStyle" type="default" @click="clearData">取消
              </a-button>
            </a-col>
          </a-row>
        </a-form>
      </a-card>
    </a-col>
  </a-row>

</template>

<script>
import pick from 'lodash.pick'
import { STable } from '@/components'
import { getDataByInventory } from '@/api/Inventory'
import { addOutPick } from '@/api/OutPick'
import { getDataByDetail } from '@/api/OutOrderDetail'
const columns = [
  {
    title: '器材编号',
    dataIndex: 'material_code'
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
    title: '库位编号',
    dataIndex: 'location_code'
  },
  {
    title: '载具编号',
    dataIndex: 'pallet_code'
  }
]
export default {
  name: 'OutStorageDistribute',
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
      checkedData: null,
      queryParam: { material_code: 9999999999 },
      startTime: '1900-01-01',
      endTime: '3000-01-01',
      loadData: parameter => {
        parameter.startTime = this.startTime
        parameter.endTime = this.endTime
        return getDataByInventory(parameter, this.queryParam).then(res => {
          // console.log(res)
          return res.result
        })
      }
    }
  },
  methods: {
    getData(e) {
      this.queryData(e)
    },
    // 点击出库单行
    // customRow(record, index) {
    //   return {
    //     on: {
    //       // 鼠标单击行
    //       click: event => {
    //         // 点击出库单给其行设置高亮颜色
    //         event.currentTarget.parentNode.querySelectorAll('tr').forEach(item => {
    //           item.style.background = 'white'
    //         })
    //         this.checkedData = record
    //         this.$nextTick(() => {
    //           this.form.setFieldsValue(pick(record, ['material_code', 'material_name']))
    //         })
    //         event.currentTarget.style.background = '#e6f7ff'
    //       }
    //     }
    //   }
    // },
    // test_inventory_count(e) {
    //   const pickCountTemp = this.form.getFieldValue('pick_count_temp')
    //   if (Number(this.checkedData.order_count) - Number(this.checkedData.pick_count) < Number(pickCountTemp)) {
    //     this.form.setFields({
    //       pick_count_temp: { value: 0, errors: [{ message: '可配数量不能大于剩余可配数量！', field: 'pick_count_temp' }] }
    //     })
    //   } else {
    //     this.form.setFields({
    //       pick_count_temp: { value: pickCountTemp, success: [{ message: '可配数量符合！', field: 'pick_count_temp' }] }
    //     })
    //   }
    // },
    clearData() {
      this.queryParam = { material_code: '', material_name: '', out_order_id: '', pick_count: '', order_count: '', batch: '' }
      this.form.setFieldsValue(pick(this.queryParam, ['out_order_id', 'material_code', 'material_name', 'order_count', 'pick_count', 'batch']))
    },
    queryData(e) {
      e.preventDefault()
      const promise = new Promise((resolve, reject) => {
        const outOrderId = this.form.getFieldValue('out_order_id')
        // console.log(orderIdTemp)
        getDataByDetail({ pageNo: 1, pageSize: 1, startTime: '1900-01-01', endTime: '3000-01-01' }, { out_order_id: outOrderId }).then(res => {
          resolve(res)
        })
      })
      promise.then(res => {
        if (res.result.totalCount > 0) {
          this.checkedData = res.result.anything[0]
          res.result.anything[0].pick_count_temp = Number(this.checkedData.order_count) - Number(this.checkedData.pick_count)
          this.form.setFieldsValue(
            pick(res.result.anything[0], ['material_code', 'material_name', 'batch', 'pick_count', 'order_count', 'pick_count_temp'])
          )
          const temp = { material_code: res.result.anything[0].material_code, batch: res.result.anything[0].batch }
          this.queryParam = temp
          console.log(temp)
          this.$refs.table.refresh(true)
        } else {
          this.$message.warn('库存无数据！')
        }
      })
    },
    addOutPick() {
      addOutPick([this.checkedData]).then(res => {
        if (res.status) {
          this.$message.success(res.message)
        } else {
          this.$message.warn(res.message)
        }
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
