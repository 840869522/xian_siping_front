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
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="托盘编号/箱号：">
            <a-input placeholder="托盘编号/箱号" v-decorator="['pallet_code']" />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="新托盘编号">
            <a-input placeholder="新托盘编号" v-decorator="['pallet_code_new']" />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="出库数量：">
            <a-input placeholder="出库数量" v-decorator="['actual_count']" />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="剩余数量：">
            <a-input placeholder="剩余数量" v-decorator="['qty']" />
          </a-form-item>

          <a-row type="flex" justify="space-around">
            <a-col :span="6">
              <a-button size="large" class="btnStyle" type="primary" @click="bindData">请求出库
              </a-button>
            </a-col>
            <a-col :span="6">
              <a-button size="large" class="btnStyle" type="primary" @click="outStorageSure">出库确认
              </a-button>
            </a-col>
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
import { pickPallet, checkOut } from '@/api/OutPick'
import { getDataByInventory } from '@/api/Inventory'
export default {
  name: 'PdaOutStorage',
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
      checkedData: null
    }
  },
  methods: {
    outStorageSure(e) {
      e.preventDefault()
      checkOut(this.checkedData).then(res => {
        if (res.status) {
          this.$message.success(res.message)
        } else {
          this.$message.warn(res.message)
        }
      })
    },
    bindData(e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          const palletCodeNew = values.pallet_code_new
          pickPallet(this.checkedData, palletCodeNew).then(res => {
            if (res.status) {
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
      this.form.validateFields((err, values) => {
        if (!err) {
          getDataByInventory({ pageNo: 1, pageSize: 1, startTime: '1900-01-01', endTime: '3000-01-01' }, values).then(res => {
            console.log(res)
            if (res.status) {
              this.checkedData = res.result.anything[0]
              this.$nextTick(() => {
                this.form.setFieldsValue(pick(this.checkedData, ['material_code']))
                this.form.setFieldsValue(pick(this.checkedData, ['material_name']))
              })
            } else {
              this.$message.warn(res.message)
            }
          })
        }
      })
    },
    clearData() {
      const temp = { material_code: '', material_name: '', pallet_code: '', location_code: '', status: '' }
      this.form.setFieldsValue(pick(temp, ['material_code', 'material_name', 'pallet_code', 'location_code', 'status']))
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
