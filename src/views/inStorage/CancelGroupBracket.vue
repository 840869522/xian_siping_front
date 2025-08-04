<template>

  <a-row style="padding:5% 0">
    <a-col :push="6" :span="12">
      <a-card :bordered="false">
        <a-form class="permission-form" :form="form" @submit="bindData">
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol"
            :label="storageTypeText == 'B库' ? '原料箱编号:' : '原托盘编号:'">
            <a-input :placeholder="storageTypeText == 'B库' ? '原料箱编号' : '原托盘编号'"
              v-decorator="['pallet_code_old']" />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="器材编号：">
            <a-input placeholder="扫描器材编号" v-decorator="['material_code']" @blur="queryData" />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="器材名称：">
            <a-input placeholder="器材名称" disabled v-decorator="['material_name']" />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="批号：">
            <a-input placeholder="批号" disabled v-decorator="['batch']" />
          </a-form-item>
          <!-- <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="质量等级">
            <a-input placeholder="质量等级" v-decorator="['zhiliangdengji']" />
          </a-form-item> -->
          <!-- <a-form-item :labelCol="labelCol" hidden :wrapperCol="wrapperCol" label="原暂存区号">
            <a-input placeholder="原暂存区号" v-decorator="['location_code_old']" />
          </a-form-item> -->
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol"
            :label="storageTypeText == 'B库' ? '目标料箱编号:' : '目标托盘编号:'">
            <a-input :placeholder="storageTypeText == 'B库' ? '目标料箱编号' : '目标托盘编号'"
              v-decorator="['pallet_code']" />
          </a-form-item>
          <!-- <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="目标暂存区">
            <a-input placeholder="目标暂存区" v-decorator="['location_code']" />
          </a-form-item> -->
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="绑定数量：">
            <a-input placeholder="绑定数量" @blur="test_inventory_count" type="number"
              v-decorator="['inventory_count', { rules: [{ required: true,message: '绑定数量不能为空！'}] }]" />
          </a-form-item>
          <a-row>
            <a-col :push="2" :span="6">
              <a-button size="large" class="btnStyle" html-type="submit" type="primary">拆托
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
import { dataBind, getDataByInventory } from '@/api/Inventory'
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
        material_code: '',
        material_name: '',
        pallet_code: '',
        location_code: '',
        zhiliangdengji: '',
        batch: '',
        inventory_count: '',
        pallet_code_old: '',
        location_code_old: ''
      }
      this.form.setFieldsValue(
        pick(temp, [
          'material_code',
          'material_name',
          'pallet_code',
          'batch',
          'zhiliangdengji',
          'location_code',
          'inventory_count',
          'pallet_code_old',
          'location_code_old'
        ])
      )
    },
    bindData(e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          values.creator = this.userInfo.user_name
          dataBind(values, values.pallet_code_old, values.location_code_old).then(res => {
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
      const palletCodeOld = this.form.getFieldValue('pallet_code_old')
      const materialCode = this.form.getFieldValue('material_code')
      getDataByInventory(this.queryParam, { pallet_code: palletCodeOld, material_code: materialCode }).then(res => {
        if (res.status) {
          this.$nextTick(() => {
            this.form.setFieldsValue(pick(res.result.anything[0], ['material_name']))
            this.form.setFieldsValue(pick(res.result.anything[0], ['batch']))
            this.form.setFieldsValue(pick({ location_code_old: res.result.anything[0].location_code }, ['location_code_old']))
          })
        } else {
          this.$message.warn(res.message)
        }
      })
    }
  },
  created() {
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
