<template>
  <a-card :bordered="false">
    <!-- 检索相关 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" :form="form">
        <a-row :gutter="48">
          <a-col :md="4" :sm="24">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="托盘编号">
              <a-input placeholder="托盘编号" disabled
                v-decorator="['pallet_code',{initialValue:'空托盘垛'}]" />
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="24">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="库位编号">
              <a-input placeholder="库位编号" v-decorator="['location_code']" />
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="24">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="操作口:">
              <a-select v-decorator="['prot_no',{initialValue:'A01'}]">
                <a-select-option :key="'A01'" :value="'A01'">
                  操作口1
                </a-select-option>
                <a-select-option :key="'A02'" :value="'A02'">
                  操作口2
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="24">
            <span class="table-page-search-submitButtons">
              <a-button type="primary" @click="getLocation">
                获取库位
              </a-button>
              <a-button type="primary" style="margin-left:8px" @click="addData">
                空托盘垛入库
              </a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <!-- 表格 -->
    <s-table bordered row-key="material" ref="table" :pageSize="20" size="default"
      :columns="columns" :data="loadData">
    </s-table>
  </a-card>
</template>

<script>
import pick from 'lodash.pick'
import { STable } from '@/components'
import { getDataBy } from '@/api/LocationMap'
import { TaskDInsert } from '@/api/TaskX'
import { GetLocationmap } from '@/api/InvenMaterialLocationmap'
// import { palletUpDown } from '@/api/InvenMaterialLocationmap'
// import { getDataByInventory } from '@/api/Inventory'
import storage from 'store'

const columns = [
  {
    title: '库位编号',
    dataIndex: 'location_code'
  },
  {
    title: '载具编号',
    dataIndex: 'pallet_code'
  },
  {
    title: '库名',
    dataIndex: 'warehouse'
  },
  {
    title: '状态',
    dataIndex: 'status'
  }
]

export default {
  name: 'EmptyPalletOutstorage',
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
      queryParam: {},
      loadData: parameter => {
        this.queryParam.warehouse = 'D库'
        this.queryParam.status = '启用'
        return getDataBy(parameter, this.queryParam).then(res => {
          console.log(res)
          return res.result
        })
      },
      storageTypeText: ''
    }
  },
  methods: {
    yikuMethod(e) {
      this.isYiku = e.target.value
    },

    addData(e) {
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
          values.status = '待执行'
          values.task_type = '入库'
          values.creator = this.userInfo.user_name
          console.log(values)
          TaskDInsert(values).then(res => {
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
    getLocation() {
      const palletCode = this.form.getFieldValue('pallet_code')
      if (palletCode === '' || palletCode === null || palletCode === undefined) {
        this.$message.warn('托盘编号为空')
        return
      }
      GetLocationmap({ pallet_code: palletCode }).then(res => {
        console.log(res)
        if (res.status) {
          this.$nextTick(() => {
            this.form.setFieldsValue(pick(res.result, ['location_code']))
          })
        } else {
          this.$message.warn(res.message)
        }
      })
    },

    clearData() {
      const temp = { pallet_code: '', location_code: '' }
      this.form.setFieldsValue(pick(temp, ['pallet_code', 'location_code']))
    }
  },
  created() {
    this.userInfo = storage.get('userInfo')
    this.storageTypeText = storage.get('storageTypeText')
    console.log(this.storageTypeText)
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
