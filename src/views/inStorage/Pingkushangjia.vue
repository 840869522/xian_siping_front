<template>
  <a-card :bordered="false">
    <!-- 检索相关 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" :form="form">
        <a-row :gutter="48">
          <a-col :md="4" :sm="24" :hidden="storageTypeText=='B库'">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="托盘编号：">
              <a-input placeholder="扫描托盘编号"
                v-decorator="['pallet_code', { rules: [{ required: false,message: '托盘编号填写'}] }]" />
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="24" :hidden="storageTypeText!=='B库'">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="料箱编号：">
              <a-input placeholder="扫描料箱编号"
                v-decorator="['pallet_code', { rules: [{ required: false,message: '料箱编号填写'}] }]" />
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="24">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="库位编号">
              <a-input placeholder="库位编号" v-decorator="['location_code']" />
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="24">
            <span class="table-page-search-submitButtons">
              <a-button @click="taskDown" type="primary">上架完成
              </a-button>
              <a-button style="margin-left: 8px" type="default" @click="clearData">取消
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
      <a-tag :color="text == '启用' ? 'green' : 'red'" slot="status" slot-scope="text">{{ text }}
      </a-tag>
      <span slot="action" slot-scope="text, record">
        <a @click="updateGetValue(record)">编辑</a>
      </span>
    </s-table>
    <!-- 编辑 -->
    <a-modal title="编辑" style="top: 20px" :width="800" v-model="visibleUpdate" @ok="updateSure">
      <a-form class="permission-form" :form="formUpdate">
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="库位编号">
          <a-input disabled v-decorator="['location_code']" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="托盘编号">
          <a-input placeholder="托盘编号" v-decorator="['pallet_code']" />
        </a-form-item>
      </a-form>
    </a-modal>
  </a-card>

</template>

<script>
import pick from 'lodash.pick'
import { STable } from '@/components'
// import { getDataByInventory } from '@/api/Inventory'
// import { getDataBy } from '@/api/LocationMap'
import { getDataBy, updateData } from '@/api/LocationMap'
import { GetAGVMapByPage, UpdateAGVMapByLocation, GetCTUMapByPage, UpdateCTUMapByLocation } from '@/api/AgvLocationMap'
// import { GetBy } from '@/api/InvenMaterialLocationmap'

import { getDropDownListBy } from '@/api/global'
import storage from 'store'
let storageTypeText = ''
const columns = [
  {
    title: '库位编号',
    dataIndex: 'location_code'
  },
  {
    title: '库位类型',
    dataIndex: 'warehouse'
  },
  {
    title: '托盘编号',
    dataIndex: 'pallet_code'
  },
  {
    title: '状态',
    dataIndex: 'status'
  },
  {
    title: '操作',
    width: '70px',
    dataIndex: 'action',
    scopedSlots: { customRender: 'action' }
  }
]
export default {
  name: 'Pingkushangjia',
  components: {
    STable
  },
  data() {
    return {
      storageTypeText: '',
      visibleUpdate: false,
      columns,
      // 编辑form
      formUpdate: this.$form.createForm(this),
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
      loadData: parameter => {
        if (storageTypeText === 'D库') {
          return getDataBy(parameter, { location_code: 'DD', warehouse: 'D库' }).then(res => {
            console.log(res)
            return res.result
          })
        } else if (storageTypeText === 'X库') {
          return getDataBy(parameter, { location_code: 'XD', warehouse: 'X库' }).then(res => {
            console.log(res)
            return res.result
          })
        } else if (storageTypeText === 'P库') {
          return GetAGVMapByPage(parameter, {}).then(res => {
            console.log(res)
            return res.result
          })
        } else if (storageTypeText === 'B库') {
          return GetCTUMapByPage(parameter, {}).then(res => {
            console.log(res)
            return res.result
          })
        } else {
          return getDataBy(parameter, { location_code: '不让查出来' }).then(res => {
            console.log(res)
            return res.result
          })
        }
      },
      statusDic: []
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
            this.clickCurrent = record
            this.form.setFieldsValue(pick(record, ['pallet_code', 'location_code']))
            // this.form.setFieldsValue(pick({ location_code: record.location_code }, ['location_code']))
            event.currentTarget.style.background = '#e6f7ff'
          }
        }
      }
    },
    // 编辑按钮取值给模态框
    updateGetValue(record) {
      this.visibleUpdate = true
      this.$nextTick(() => {
        this.formUpdate.setFieldsValue(pick(record, ['pallet_code', 'location_code']))
      })
    },
    // 确定更新数据
    updateSure(e) {
      this.visibleUpdate = false
      e.preventDefault()
      this.formUpdate.validateFields((err, values) => {
        if (!err) {
          if (storageTypeText === 'P库') {
            UpdateAGVMapByLocation(values).then(res => {
              if (res.status) {
                this.$refs.table.refresh(true)
                this.$message.success(res.message)
              } else {
                this.$message.warn(res.message)
              }
            })
          } else if (storageTypeText === 'B库') {
            UpdateCTUMapByLocation(values).then(res => {
              if (res.status) {
                this.$refs.table.refresh(true)
                this.$message.success(res.message)
              } else {
                this.$message.warn(res.message)
              }
            })
          } else {
            updateData(values).then(res => {
              if (res.status) {
                this.$refs.table.refresh(true)
                this.$message.success(res.message)
              } else {
                this.$message.warn(res.message)
              }
            })
          }
        }
      })
    },
    refresh() {
      this.$refs.table.refresh(true)
    },
    taskDown(e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          const validatePalletCode = this.validate.validatePalletCode(this.storageTypeText, values.pallet_code)
          if (!validatePalletCode.status) {
            this.form.setFields({
              pallet_code: { value: '', errors: [validatePalletCode] }
            })
            return
          }
          values.creator = this.userInfo.user_name
          console.log(values)
          if (storageTypeText === 'P库') {
            UpdateAGVMapByLocation(values).then(res => {
              if (res.status) {
                this.$refs.table.refresh(true)
                this.$message.success(res.message)
              } else {
                this.$message.warn(res.message)
              }
            })
          } else if (storageTypeText === 'B库') {
            UpdateCTUMapByLocation(values).then(res => {
              if (res.status) {
                this.$refs.table.refresh(true)
                this.$message.success(res.message)
              } else {
                this.$message.warn(res.message)
              }
            })
          } else {
            updateData(values).then(res => {
              if (res.status) {
                this.$refs.table.refresh(true)
                this.$message.success(res.message)
              } else {
                this.$message.warn(res.message)
              }
            })
          }
        }
      })
    },
    clearData() {
      const temp = { material_code: '', material_name: '', batch: '', pallet_code: '', inventory_count: '' }
      this.form.setFieldsValue(pick(temp, ['material_code', 'material_name', 'batch', 'inventory_count', 'pallet_code']))
    },
    bindData() {},
    getDic() {
      getDropDownListBy('baseStatus').then(res => {
        this.statusDic = res.result.anything
      })
    }
  },
  created() {
    this.getDic()
    this.userInfo = storage.get('userInfo')
    storageTypeText = storage.get('storageTypeText')

    this.storageTypeText = storage.get('storageTypeText')
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
