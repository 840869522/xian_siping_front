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
            <a-input placeholder="批号" v-decorator="['batch']" />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="木箱宽度">
            <a-input placeholder="底托宽度"
              v-decorator="['l4', { rules: [{ required: true,message: '木箱宽度填写'}] }]" />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="木箱高度">
            <a-input placeholder="底托高度"
              v-decorator="['h0', { rules: [{ required: true,message: '木箱高度填写'}] }]" />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="木箱数量">
            <a-input placeholder="木箱数量" @blur="test_inventory_count" type="number"
              v-decorator="['box_count', { rules: [{ required: true,message: '木箱数量不能为空！'}] }]" />
          </a-form-item>
          <a-row>
            <a-col :push="2" :span="6">
              <a-button size="large" class="btnStyle" html-type="submit" type="primary">下发参数
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
import { trussBoxTask } from '@/api/TaskX'
export default {
  name: 'Zidongmaduo',
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
      if (inventoryCount < 0 || !(!isNaN(parseFloat(inventoryCount)) && isFinite(inventoryCount)) || inventoryCount % 1 !== 0) {
        this.form.setFields({
          inventory_count: { value: '', errors: [{ message: '请输入正整数', field: 'inventory_count' }] }
        })
      }
    },
    clearData() {
      const temp = { material_code: '', material_name: '', zhiliangdengji: '', pallet_code: '', location_code: '', batch: '', inventory_count: '' }
      this.form.setFieldsValue(
        pick(temp, ['material_code', 'material_name', 'pallet_code', 'zhiliangdengji：', 'batch', 'location_code', 'inventory_count'])
      )
    },
    bindData(e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          // const storageTypeText = JSON.parse(localStorage.getItem('storageTypeText'))
          // const validatePalletCode = this.validate.validatePalletCode(storageTypeText, values.pallet_code)
          // if (!validatePalletCode.status) {
          //   this.form.setFields({
          //     pallet_code: { value: '', errors: [validatePalletCode] }
          //   })
          //   return
          // }
          values.wave_no = Math.round(new Date())
          console.log(values)
          trussBoxTask(values).then(res => {
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
