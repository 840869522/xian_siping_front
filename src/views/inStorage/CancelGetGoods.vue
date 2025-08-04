<template>

  <a-row style="padding:5% 0">
    <a-col :push="6" :span="12">
      <a-card :bordered="false">
        <a-form class="permission-form" :form="form" @submit="addData">
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="入库单号">
            <a-input placeholder="入库单号"
              v-decorator="['in_order_id', { rules: [{ required: true,message: '入库单号不能为空！'}] }]" />
          </a-form-item>
          <a-form-item :labelCol="labelCol" hidden :wrapperCol="wrapperCol" label="入库单明细ID">
            <a-input placeholder="入库单明细ID" disabled v-decorator="['in_order_detail_id']" />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="器材编号">
            <a-input placeholder="器材编号" @blur="queryData"
              v-decorator="['material_code', { rules: [{ required: true,message: '器材编号不能为空！'}] }]" />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="器材名称">
            <a-input placeholder="器材名称" disabled v-decorator="['material_name']" />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="可取消数量">
            <a-input placeholder="可取消数量" disabled v-decorator="['actual_count']" />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="批号">
            <a-input placeholder="批号" disabled v-decorator="['batch']" />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="取消数量">
            <a-input placeholder="取消数量" @blur="test_inventory_count"
              v-decorator="['inventory_count', { rules: [{ required: true,message: '取消数量不能为空！'}] }]" />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol"
            :label="storageTypeText == 'B库' ? '料箱编号:' : '托盘编号:'">
            <a-input :placeholder="storageTypeText == 'B库' ? '料箱编号:' : '托盘编号:'"
              v-decorator="['pallet_code', { rules: [{ required: true,message: '载具编号不能为空！'}] }]" />
          </a-form-item>
          <!-- <a-form-item :labelCol="labelCol" hidden :wrapperCol="wrapperCol" label="区域号">
            <a-input placeholder="区域号" v-decorator="['location_code']" />
          </a-form-item> -->
          <a-row>
            <a-col :push="2" :span="6">
              <a-button size="large" class="btnStyle" html-type="submit" type="primary">收货
              </a-button>
            </a-col>
            <a-col :span="8"></a-col>
            <a-col :span="6">
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
import { getDataByDetail } from '@/api/InOrderDetail'
import { addDataInventory } from '@/api/Inventory'
export default {
  name: 'PdaGetGoods',
  components: {
    STable
  },
  data() {
    return {
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
      queryParam: { pageNo: 1, pageSize: 1, startTime: '1900-01-01', endTime: '3000-01-01' }
    }
  },
  methods: {
    test_inventory_count(e) {
      const inventoryCount = this.form.getFieldValue('inventory_count')
      const orderCountTemp = this.form.getFieldValue('order_count_temp')
      if (Number(inventoryCount) > orderCountTemp) {
        this.form.setFields({
          inventory_count: { value: '', errors: [{ message: '收货数量不能大于待收数量！', field: 'inventory_count' }] }
        })
      }
    },
    clearData() {
      const temp = {
        in_order_id: '',
        in_order_detail_id: '',
        material_code: '',
        material_name: '',
        batch: '',
        order_count_temp: '',
        inventory_count: '',
        pallet_code: ''
      }
      this.form.setFieldsValue(
        pick(temp, [
          'in_order_id',
          'in_order_detail_id',
          'material_name',
          'material_code',
          'batch',
          'order_count_temp',
          'inventory_count',
          'pallet_code',
          'location_code'
        ])
      )
    },
    addData(e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log(values)
          values.location_code = values.pallet_code
          addDataInventory(values, values.in_order_id).then(res => {
            if (res.status) {
              this.$message.success(res.message)
              this.clearData()
            } else {
              this.$message.warn(res.message)
            }
          })
        }
      })
    },
    queryData(e) {
      const materialCodeTemp = this.form.getFieldValue('material_code')
      const orderIdTemp = this.form.getFieldValue('order_id')
      getDataByDetail(
        { pageNo: 1, pageSize: 1, startTime: '1900-01-01', endTime: '3000-01-01' },
        { material_code: materialCodeTemp, orderId: orderIdTemp }
      ).then(res => {
        if (res.status) {
          console.log(res)
          this.$nextTick(() => {
            this.form.setFieldsValue(pick(res.result.anything[0], ['material_name']))
            this.form.setFieldsValue(pick(res.result.anything[0], ['batch']))
            this.form.setFieldsValue(pick(res.result.anything[0], ['in_order_detail_id']))
            this.form.setFieldsValue(pick(res.result.anything[0], ['actual_count']))
          })
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
