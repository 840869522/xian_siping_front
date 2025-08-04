<template>
  <a-card :bordered="false">
    <!-- 检索相关 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" :form="form">
        <a-row :gutter="48">
          <a-col :md="4" :sm="24">
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
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="选择库位">
              <a-radio-group v-model="getLocationCodeType" @change="radioChange3">
                <a-radio value="0">指定库位</a-radio>
                <a-radio value="1">自动分配</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
          <div :hidden="getLocationCodeType=='1'"> <a-col :md="4" :sm="24">
              <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="层号">
                <a-input placeholder="层号" v-decorator="['row',{initialValue:'1'}]" />
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
          </div>

          <a-col :md="4" :sm="24">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="料箱编号：">
              <a-input placeholder="料箱编号" @blur="getLocation"
                v-decorator="['pallet_code', { rules: [{ required: false,message: '料箱编号填写'}] }]" />
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
import { getDataBy, getEmptyOutLocationB, getLocationByPalletcodeB } from '@/api/LocationMap'
import { TaskBInsert, GetTaskBByPage } from '@/api/TaskX'
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
    title: '料箱编号',
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
// const protNoList = [
//   { value: '3016', text: '电子标签上3016' },
//   { value: '3019', text: '电子标签上3019' },
//   { value: '3020', text: '电子标签上3020' },
//   { value: '3042', text: '电子标签上3042' },
//   { value: '3043', text: '电子标签上3043' },
//   { value: '3059', text: '电子标签上3059' },
//   { value: '4080', text: '电子标签下4080' },
//   { value: '4081', text: '电子标签下4081' },
//   { value: '4082', text: '电子标签下4082' },
//   { value: '4083', text: '电子标签下4083' },
//   { value: '4084', text: '电子标签下4084' },
//   { value: '4085', text: '电子标签下4085' },
//   { value: '4086', text: '电子标签下4086' },
//   { value: '4087', text: '电子标签下4087' },
//   { value: '4088', text: '电子标签下4088' },
//   { value: '4089', text: '电子标签下4089' },
//   { value: '4090', text: '电子标签下4090' },
//   { value: '4091', text: '电子标签下4091' }
// ]
export default {
  name: 'BInstorage',
  components: {
    STable
  },
  data() {
    return {
      // protNoList,
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

      queryParam: {},
      loadData: parameter => {
        return GetTaskBByPage(parameter, this.queryParam).then(res => {
          console.log(res)
          return res.result
        })
      },
      storageTypeText: '',
      getLocationCodeType: '0'
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
    radioChange3(e) {
      this.getLocationCodeType = e.target.value
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
      const storageTypeText = JSON.parse(localStorage.getItem('storageTypeText'))
      console.log(storageTypeText)
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
            this.$message.warn('该料箱已经在库中！')
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
          taskInfo.task_type = '入库'
        } else if (this.isYiku === '移库') {
          taskInfo.task_type = '移库'
        } else if (this.isYiku === '满入入库') {
          taskInfo.task_type = '满入入库'
        }
        // else if (this.isYiku === '回库') {
        //   taskInfo.task_type = '回库'
        // }
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
      })
    },
    changePalletCode() {
      this.clearData()
      this.queryParam.pallet_code = 99999999999999
      this.$refs.table.refresh(true)
    },
    getLocation() {
      const palletCode = this.form.getFieldValue('pallet_code')
      if (this.getLocationCodeType === '0') {
        const row = this.form.getFieldValue('row')
        const farNear = this.form.getFieldValue('farNear')
        console.log(row, farNear)
        if (row === undefined || farNear === undefined) {
          return
        }
        getEmptyOutLocationB(row, farNear).then(res => {
          if (res.status) {
            console.log(res)
            this.form.setFieldsValue(pick(res.result, ['location_code']))
          } else {
            this.$message.warn(res.message)
          }
        })
      } else if (this.getLocationCodeType === '1') {
        getLocationByPalletcodeB({ pallet_code: palletCode }).then(res => {
          if (res.status) {
            this.form.setFieldsValue(pick(res.result, ['location_code']))
          } else {
            this.$message.warn(res.message)
          }
        })
      }
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
