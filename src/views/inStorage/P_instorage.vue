<template>
  <a-card :bordered="false">
    <!-- 检索相关 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" :form="form">
        <a-row :gutter="48">
          <a-col :md="5" :sm="24">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="任务类型">
              <a-radio-group v-model="isYiku" @change="yikuMethod">
                <a-radio value="入库">入库</a-radio>
                <!-- <a-radio value="回库">回库</a-radio> -->
                <a-radio value="移库">移库</a-radio>
                <a-radio value="满入入库">满入</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
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
              <a-input placeholder="托盘编号" @blur="getLocation"
                v-decorator="['pallet_code', { rules: [{ required: false,message: '托盘编号填写'}] }]" />
            </a-form-item>
          </a-col>

          <a-col :md="4" :sm="24" :hidden="isYiku!=='移库'">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="起点库位">
              <a-input placeholder="起点库位" v-decorator="['udf03']" />
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="24">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol"
              :label="isYiku=='移库'?'终点库位':'库位编号'">
              <a-input :placeholder="isYiku=='移库'?'终点库位':'库位编号'" v-decorator="['location_code']" />
            </a-form-item>
          </a-col>
          <!-- <a-col :md="4" :sm="24" :hidden="isYiku!=='回库'">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="操作口:">
              <a-select v-decorator="['prot_no']" :allowClear="true">
                <a-select-option v-for="item in protNoList" :key="item.value" :value="item.value">
                  {{ item.text }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col> -->
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
import { TaskPInsert, GetTaskPByPage } from '@/api/TaskX'
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
const protNoList = [
  { value: '1067', text: '拣选补货口1' },
  { value: '1054', text: '拣选补货口2' },
  { value: '1051', text: '拣选补货口3' }
]
export default {
  name: 'PInstorage',
  components: {
    STable
  },
  data() {
    return {
      protNoList,
      isYiku: '入库',
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
        return GetTaskPByPage(parameter, {}).then(res => {
          console.log(res)
          return res.result
        })
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
        // console.log(res.result.anything)
        if (res.result.totalCount > 0) {
          return
        }

        taskInfo.status = '待执行'
        taskInfo.creator = this.userInfo.user_name
        if (this.isYiku === '入库') {
          console.log(taskInfo.prot_no)
          taskInfo.task_type = '入库'
        } else if (this.isYiku === '移库') {
          taskInfo.task_type = '移库'
        } else if (this.isYiku === '满入入库') {
          taskInfo.task_type = '满入入库'
        }
        // else if (this.isYiku === '回库') {
        //   taskInfo.task_type = '回库'
        // }

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
    // queryData_inventory() {
    //   this.form.validateFields((err, values) => {
    //     if (!err) {
    //       this.queryParam.pallet_code = values.pallet_code
    //       this.$refs.table.refresh(true)
    //     }
    //   })
    // },
    clearData() {
      const temp = { pallet_code: '', location_code: '' }
      this.form.setFieldsValue(pick(temp, ['pallet_code', 'location_code']))
    }
    // bindData(e) {
    //   e.preventDefault()
    //   this.form.validateFields((err, values) => {
    //     if (!err) {
    //       dataBind(values).then(res => {
    //         if (res.status) {
    //           this.$message.success(res.message)
    //           this.$refs.table.refresh(true)
    //         } else {
    //           // console.log(333)
    //           // this.$message.warn(res.message)
    //         }
    //       })
    //     }
    //   })
    // },
    // getStorageNo() {},
    // insertTask(e) {
    //   e.preventDefault()
    //   this.form.validateFields((err, values) => {
    //     if (!err) {
    //       palletUpDown(values, 'Up').then(res => {
    //         if (res.status) {
    //           this.$message.success(res.message)
    //         } else {
    //           this.$message.warn(res.message)
    //         }
    //       })
    //     }
    //   })
    // }
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
