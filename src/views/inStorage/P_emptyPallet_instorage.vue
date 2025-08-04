<template>
  <a-card :bordered="false">
    <!-- 检索相关 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" :form="form">
        <a-row :gutter="48">
          <a-col :md="4" :sm="24">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="货架号">
              <a-input placeholder="货架号" v-decorator="['row',{initialValue:'1'}]" />
            </a-form-item>
          </a-col>

          <a-col :md="4" :sm="24">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="远近">
              <a-select placeholder="远近" v-decorator="['farNear',{initialValue:'远'}]">
                <a-select-option key="远" value="远">远
                </a-select-option>
                <a-select-option key="近" value="近">近
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="24">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="高低">
              <a-select placeholder="高低" v-decorator="['lowHigh',{initialValue:'1'}]">
                <a-select-option key="1" value="1">高
                </a-select-option>
                <a-select-option key="2" value="2">低
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="24">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="托盘编号：">
              <a-input placeholder="托盘编号" disabled
                v-decorator="['pallet_code', {initialValue:'空托盘垛'}]" />
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="24">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="库位编号">
              <a-input placeholder="库位编号" v-decorator="['location_code']" />
            </a-form-item>
          </a-col>

          <a-col :md="8" :sm="24">
            <span class="table-page-search-submitButtons">
              <a-button type="primary" @click="getLocation">
                获取空库位
              </a-button>
              <a-button style="margin-left: 8px" type="primary" @click="addData">
                空托盘垛入库
              </a-button>
              <a-button style="margin-left: 8px" type="default" @click="refresh">刷新
              </a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <!-- 表格 -->
    <s-table :customRow="customRow" bordered row-key="material" ref="table" :pageSize="20"
      size="default" :columns="columns" :data="loadData">
    </s-table>
  </a-card>
</template>

<script>
import pick from 'lodash.pick'
import { STable } from '@/components'
import { getDataBy, getEmptyLocationP } from '@/api/LocationMap'
import { TaskPInsert } from '@/api/TaskX'
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
        this.queryParam.warehouse = 'P库'
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
    customRow(record, index) {
      return {
        on: {
          // 鼠标单击行
          click: event => {
            this.$refs.table.refresh(true)
            // 点击入库单给其行设置高亮颜色
            event.currentTarget.parentNode.querySelectorAll('tr').forEach(item => {
              item.style.background = 'white'
            })
            this.form.setFieldsValue(pick(record, ['material_code', 'material_name', 'batch', 'inventory_count']))
            // this.form.setFieldsValue(pick({ location_code: record.location_code }, ['location_code']))
            event.currentTarget.style.background = '#e6f7ff'
          }
        }
      }
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
          TaskPInsert(values).then(res => {
            if (res.status) {
              this.$message.success(res.message)
            } else {
              this.$message.warn(res.message)
            }
          })
        }
      })
    },
    refresh() {
      this.$refs.table.refresh(true)
    },
    changePalletCode() {
      this.clearData()
      this.$refs.table.refresh(true)
    },
    getLocation() {
      const row = this.form.getFieldValue('row')
      const farNear = this.form.getFieldValue('farNear')
      const lowHigh = this.form.getFieldValue('lowHigh')
      // if (row === undefined || farNear === undefined) {
      //   return
      // }
      console.log(row, farNear, lowHigh)
      getEmptyLocationP(row, farNear, lowHigh).then(res => {
        if (res.status) {
          this.form.setFieldsValue(pick(res.result, ['location_code']))
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
