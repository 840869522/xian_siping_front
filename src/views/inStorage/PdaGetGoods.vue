<template>

  <a-row style="padding:5% 0">
    <a-col :push="6" :span="12">
      <a-card :bordered="false">
        <a-form class="permission-form" :form="form" @submit="addData">
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="入库单号">
            <a-input placeholder="入库单号"
              v-decorator="['in_order_id', { rules: [{ required: true,message: '入库单号不能为空！'}] }]" />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="器材编号">
            <a-input placeholder="器材编号" @blur="queryData"
              v-decorator="['material_code', { rules: [{ required: true,message: '器材编号不能为空！'}] }]" />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="器材名称">
            <a-input placeholder="器材名称" disabled v-decorator="['material_name']" />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="批号">
            <a-input placeholder="批号" disabled v-decorator="['batch']" />
          </a-form-item>
          <!-- <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="质量等级">
            <a-input placeholder="质量等级" v-decorator="['zhiliangdengji']" />
          </a-form-item> -->
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="待收数量">
            <a-input placeholder="待收数量" disabled v-decorator="['order_count_temp']" />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="收货数量">
            <a-input placeholder="收货数量" @blur="test_inventory_count"
              v-decorator="['inventory_count', { rules: [{ required: true,message: '收货数量不能为空！'}] }]" />
          </a-form-item>
          <!-- <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="暂存区号">
            <a-input placeholder="暂存区号"
              v-decorator="['location_code', { rules: [{ required: true,message: '暂存区号不能为空'}] }]" />
          </a-form-item> -->
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol"
            :label="storageTypeText == 'B库' ? '料箱编号:' : '托盘编号:'">
            <a-input :placeholder="storageTypeText == 'B库' ? '料箱编号' : '托盘编号'"
              v-decorator="['pallet_code', { rules: [{ required: true,message: '载具编号不能为空'}] }]" />
          </a-form-item>
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
import storage from 'store'
import { addDataInventory } from '@/api/Inventory'
import { getMaterialBy } from '@/api/BaseMaterial'
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
      storageTypeText: '',
      queryParam: { pageNo: 1, pageSize: 1, startTime: '1900-01-01', endTime: '3000-01-01' }
    }
  },
  methods: {
    test_inventory_count(e) {
      const inventoryCount = this.form.getFieldValue('inventory_count')
      const orderCountTemp = this.form.getFieldValue('order_count_temp')
      if (inventoryCount < 0 || !(!isNaN(parseFloat(inventoryCount)) && isFinite(inventoryCount)) || inventoryCount % 1 !== 0) {
        this.form.setFields({
          inventory_count: { value: '', errors: [{ message: '请输入正整数', field: 'inventory_count' }] }
        })
        return
      }
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
        zhiliangdengji: '',
        order_count_temp: '',
        inventory_count: '',
        pallet_code: ''
      }
      this.form.setFieldsValue(
        pick(temp, [
          'in_order_id',
          'material_name',
          'material_code',
          'batch',
          'order_count_temp',
          'inventory_count',
          'zhiliangdengji',
          'pallet_code',
          'location_code'
        ])
      )
    },
    addData(e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          // console.log(values.pallet_code)
          // if (values.pallet_code == null || values.pallet_code === undefined || values.pallet_code === '') {
          //   values.pallet_code = values.location_code
          // } else {
          const validatePalletCode = this.validate.validatePalletCode(this.storageTypeText, values.pallet_code)
          if (!validatePalletCode.status) {
            this.form.setFields({
              pallet_code: { value: '', errors: [validatePalletCode] }
            })
            return
          }
          // }
          // values.pallet_code = values.location_code
          values.updater = this.userInfo.user_name
          values.creator = this.userInfo.user_name
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
    // 输入器材编号后先查询该物料是否属于该库，然后再收货
    queryData(e) {
      e.preventDefault()
      const materialCodeTemp = this.form.getFieldValue('material_code')
      const orderIdTemp = this.form.getFieldValue('in_order_id')
      console.log(orderIdTemp)
      const promise = new Promise((resolve, reject) => {
        getMaterialBy({ pageNo: 1, pageSize: 1, startTime: '1900-01-01', endTime: '3000-01-01' }, { material_code: materialCodeTemp }).then(res => {
          if (res.status) {
            if (res.result.totalCount === 1) {
              if (res.result.anything[0].material_storage_area === this.storageTypeText) {
                resolve(res)
              } else {
                res.message = '该物料不属于' + this.storageTypeText
                this.$message.warn(res.message)
                reject(res)
              }
            } else {
              res.message = '该编码存在多条物料！'
              this.$message.warn(res.message)
              reject(res)
            }
          } else {
            res.message = '该编码的物料不存在！'
            this.$message.warn(res.message)
            reject(res)
          }
        })
      })
      promise.then((resolve, reject) => {
        getDataByDetail(
          { pageNo: 1, pageSize: 1, startTime: '1900-01-01', endTime: '3000-01-01' },
          { material_code: materialCodeTemp, in_order_id: orderIdTemp }
        ).then(res => {
          console.log(res)
          if (res.status) {
            this.$nextTick(() => {
              this.form.setFieldsValue(pick(res.result.anything[0], ['material_name']))
              this.form.setFieldsValue(pick(res.result.anything[0], ['batch']))
              this.form.setFieldsValue(pick(res.result.anything[0], ['zhiliangdengji']))
              this.form.setFieldsValue(
                pick({ order_count_temp: res.result.anything[0].order_count - res.result.anything[0].actual_count }, ['order_count_temp'])
              )
            })
          } else {
            this.$message.warn(res.message)
          }
        })
      })
    }
  },
  created() {
    // 取出当前登录库型用于判断该物料是否属于该库
    this.storageTypeText = storage.get('storageTypeText')
    this.userInfo = storage.get('userInfo')
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
.btnStyle {
  width: 100%;
}
</style>
