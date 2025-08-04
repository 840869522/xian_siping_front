<template>
  <a-card :bordered="false">
    <!-- 检索相关 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" :form="form">
        <a-row :gutter="48">
          <!-- <a-col :md="4" :sm="24">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="任务类型">
              <a-radio-group v-model="isYiku" disabled @change="yikuMethod">
                <a-radio value="回库">回库</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col> -->
          <a-col :md="4" :sm="24" :hidden="storageTypeText!=='P库'">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="货架号">
              <a-input placeholder="货架号" v-decorator="['row',{initialValue:'1'}]" />
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="24" :hidden="storageTypeText!=='B库'">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="层号">
              <a-input placeholder="层号" v-decorator="['row',{initialValue:'1'}]" />
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="24" :hidden="storageTypeText=='D库'">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="远近">
              <a-select placeholder="远近" v-decorator="['farNear',{initialValue:'远'}]">
                <a-select-option key="远" value="远">远
                </a-select-option>
                <a-select-option key="近" value="近">近
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="24" :hidden="storageTypeText=='D库'">
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
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol"
              :label="storageTypeText=='B库'?'料箱编号':'托盘编号'">
              <a-input :placeholder="storageTypeText=='B库'?'料箱编号':'托盘编号'" @blur="getLocation"
                v-decorator="['pallet_code', { rules: [{ required: false,message: '载具编号填写'}] }]" />
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="24">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol"
              :label="isYiku=='移库'?'终点库位':'库位编号'">
              <a-input placeholder="库位编号" v-decorator="['location_code']" />
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="24" :hidden="isYiku!=='回库'">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="操作口:">
              <a-select v-decorator="['prot_no',{initialValue:''}]" :allowClear="true">
                <a-select-option v-for="item in jianhuokou" :key="item.value" :value="item.value">
                  {{ item.text }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="2" :sm="24">
            <span class="table-page-search-submitButtons">
              <a-button type="primary" @click="addData">
                生成任务
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
// import { getDataByInventory } from '@/api/Inventory'
import { getDataBy, getEmptyLocationP } from '@/api/LocationMap'
import { TaskPInsert, TaskDInsert, TaskBInsert, GetTaskPByPage, GetTaskDByPage, GetTaskBByPage } from '@/api/TaskX'
// import { palletUpDown } from '@/api/InvenMaterialLocationmap'
import storage from 'store'

const columns = [
  {
    title: '任务号',
    dataIndex: 'task_no'
  },
  {
    title: '货位号',
    dataIndex: 'location_code'
  },
  {
    title: '任务类型',
    dataIndex: 'task_type'
  },
  {
    title: '载具编号',
    dataIndex: 'pallet_code'
  },
  {
    title: '状态',
    dataIndex: 'status'
  },
  {
    title: '创建时间',
    dataIndex: 'create_time'
  }
]
const jianhuokou = []
export default {
  name: 'YuliaoInstorage',
  components: {
    STable
  },
  data() {
    return {
      jianhuokou,
      isYiku: '回库',
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

      loadData: parameter => {
        const params = { warehouse: this.storageTypeText }
        switch (this.storageTypeText) {
          case 'D库':
            return GetTaskDByPage(parameter, params).then(res => {
              console.log(res)
              return res.result
            })
          case 'B库':
            return GetTaskBByPage(parameter, params).then(res => {
              console.log(res)
              return res.result
            })
          case 'P库':
            return GetTaskPByPage(parameter, params).then(res => {
              console.log(res)
              return res.result
            })
          case 'X库':
            break
        }
      },
      storageTypeText: ''
    }
  },
  methods: {
    refresh() {
      this.$refs.table.refresh()
    },
    yikuMethod(e) {
      this.isYiku = e.target.value
      this.$nextTick(() => {
        this.form.setFieldsValue(pick({ prot_no: undefined }, ['prot_no']))
      })
    },
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
    addData() {
      const taskInfo = {}
      taskInfo.pallet_code = this.form.getFieldValue('pallet_code')
      taskInfo.location_code = this.form.getFieldValue('location_code')
      taskInfo.utf03 = this.form.getFieldValue('utf03')
      taskInfo.prot_no = this.form.getFieldValue('prot_no')
      console.log(taskInfo.prot_no)
      const storageTypeText = JSON.parse(localStorage.getItem('storageTypeText'))
      const validatePalletCode = this.validate.validatePalletCode(storageTypeText, taskInfo.pallet_code)
      if (!validatePalletCode.status) {
        this.form.setFields({
          pallet_code: { value: '', errors: [validatePalletCode] }
        })
        return
      }
      const promise = new Promise((resolve, reject) => {
        getDataBy({ pageNo: 1, pageSize: 99999999 }, { pallet_code: taskInfo.pallet_code }).then(res => {
          console.log(res)
          if (res.result.totalCount === 0) {
            resolve(res)
          } else {
            this.$message.warn('该托盘已经在库中！')
            // reject(res)
          }
        })
      })
      promise.then(res => {
        if (res.result.totalCount > 0) {
          return
        }

        taskInfo.status = '待执行'
        taskInfo.creator = this.userInfo.user_name
        if (this.isYiku === '回库') {
          taskInfo.task_type = '回库'
        }
        // const params = { warehouse: this.storageTypeText }
        switch (this.storageTypeText) {
          case 'P库':
            TaskPInsert(taskInfo).then(result => {
              if (result.status) {
                this.$message.success(result.message)
                this.$refs.table.refresh(true)
                const temp = { pallet_code: '', location_code: '' }
                this.form.setFieldsValue(pick(temp, ['pallet_code', 'location_code']))
              } else {
                this.$message.warn(result.message)
              }
            })
            break
          case 'D库':
            TaskDInsert(taskInfo).then(result => {
              if (result.status) {
                this.$message.success(result.message)
                this.$refs.table.refresh(true)
                const temp = { pallet_code: '', location_code: '' }
                this.form.setFieldsValue(pick(temp, ['pallet_code', 'location_code']))
              } else {
                this.$message.warn(result.message)
              }
            })
            break
          case 'B库':
            TaskBInsert(taskInfo).then(result => {
              if (result.status) {
                this.$message.success(result.message)
                this.$refs.table.refresh(true)
                const temp = { pallet_code: '', location_code: '' }
                this.form.setFieldsValue(pick(temp, ['pallet_code', 'location_code']))
              } else {
                this.$message.warn(result.message)
              }
            })
            break
        }
      })
    },
    changePalletCode() {
      this.clearData()
      this.queryParam.pallet_code = 99999999999999
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
    switch (this.storageTypeText) {
      case 'D库':
        this.jianhuokou = [
          { text: '操作口1', value: 'A01' },
          { text: '操作口2', value: 'A02' }
        ]
        break
      case 'B库':
        this.jianhuokou = [
          // { value: '4012', text: '出库口1' },
          // { value: '4079', text: '出库口2' }

          { value: '3091', text: '入库口1' },
          { value: '3077', text: '入库口2' },
          { value: '6011', text: '人工拣选6011' },
          { value: '6012', text: '人工拣选6012' },
          { value: '6013', text: '人工拣选6013' },
          { value: '6014', text: '人工拣选6014' },
          { value: '6015', text: '人工拣选6015' }
        ]
        break
      case 'P库':
        this.jianhuokou = [
          // { value: '1033', text: '出入库口1' },
          // { value: '1023', text: '出入库口2' },
          // { value: '1011', text: '出入库口3' },
          { value: '1067', text: '拣选/补货口1' },
          { value: '1054', text: '拣选/补货口2' },
          { value: '1051', text: '拣选/补货口3' }
        ]
        break
    }
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
