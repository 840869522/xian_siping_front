<template>

  <a-row style="padding:5% 0">
    <a-col :push="6" :span="12">
      <a-card :bordered="false">
        <a-form class="permission-form" :form="form" @submit="bindData">
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="器材编号：">
            <a-input placeholder="扫描器材编号" v-decorator="['material_code']" @blur="queryData" />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="器材名称：">
            <a-input placeholder="器材名称" disabled v-decorator="['material_name']" />
          </a-form-item>
          <!-- <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="质量等级">
            <a-input placeholder="质量等级" disabled v-decorator="['zhiliangdengji']" />
          </a-form-item> -->
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="批号：">
            <a-input placeholder="批号"
              v-decorator="['batch', { rules: [{ required: true,message: '批号填写'}] }]" />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol"
            :label="storageTypeText == 'B库' ? '目标料箱编号:' : '目标托盘编号:'">
            <a-input :placeholder="storageTypeText == 'B库' ? '目标料箱编号' : '目标托盘编号'"
              v-decorator="['pallet_code', { rules: [{ required: true,message: '载具编号填写'}] }]" />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol"
            :label="storageTypeText == 'B库' ? '原料箱编号:' : '原托盘编号:'">
            <a-input :placeholder="storageTypeText == 'B库' ? '原料箱编号' : '原托盘编号'"
              v-decorator="['location_code']" />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="绑定数量：">
            <a-input placeholder="绑定数量" @blur="test_inventory_count" type="number"
              v-decorator="['inventory_count', { rules: [{ required: true,message: '绑定数量不能为空！'}] }]" />
          </a-form-item>
          <a-row>
            <a-col :push="2" :span="6">
              <a-button size="large" class="btnStyle" html-type="submit" type="primary">绑定
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
import { getMaterialBy } from '@/api/BaseMaterial'
import { dataBind } from '@/api/Inventory'
import storage from 'store'
export default {
  name: 'GroupBracket',
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
      queryParam: { pageNo: 1, pageSize: 1, startTime: '1900-01-01', endTime: '3000-01-01' },
      storageTypeText: ''
    }
  },
  methods: {
    test_inventory_count(e) {
      const inventoryCount = this.form.getFieldValue('inventory_count')
      if (inventoryCount < 0 || !(!isNaN(parseFloat(inventoryCount)) && isFinite(inventoryCount)) || inventoryCount % 1 !== 0) {
        this.form.setFields({
          inventory_count: { value: '', errors: [{ message: '请输入正整数', field: 'inventory_count' }] }
        })
      }
    },
    clearData() {
      const temp = {
        material_code: undefined,
        material_name: undefined,
        zhiliangdengji: undefined,
        pallet_code: undefined,
        location_code: undefined,
        batch: undefined,
        inventory_count: undefined
      }
      this.form.setFieldsValue(
        pick(temp, ['material_code', 'material_name', 'pallet_code', 'zhiliangdengji：', 'batch', 'location_code', 'inventory_count'])
      )
    },
    bindData(e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          const storageTypeText = JSON.parse(localStorage.getItem('storageTypeText'))
          const validatePalletCode = this.validate.validatePalletCode(storageTypeText, values.pallet_code)
          if (!validatePalletCode.status) {
            this.form.setFields({
              pallet_code: { value: '', errors: [validatePalletCode] }
            })
            return
          }
          values.updater = this.userInfo.user_name
          // values.creator = this.userInfo.user_name
          dataBind(values, values.location_code, values.location_code).then(res => {
            if (res.status) {
              this.clearData()
              this.$message.success(res.message)
            } else {
              this.$message.warn(res.message)
            }
          })
        }
      })
    },
    queryData(e) {
      e.preventDefault()
      const materialCode = this.form.getFieldValue('material_code')
      getMaterialBy(this.queryParam, { material_code: materialCode }).then(res => {
        console.log(res)
        if (res.status) {
          this.$nextTick(() => {
            this.form.setFieldsValue(pick(res.result.anything[0], ['material_name']))
          })
        } else {
          this.clearData()
          this.$message.warn(res.message)
        }
      })
    }
  },
  created() {
    this.userInfo = storage.get('userInfo')
    this.storageTypeText = JSON.parse(localStorage.getItem('storageTypeText'))
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
