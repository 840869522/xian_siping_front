<template>
  <a-card :bordered="false">
    <!-- 检索相关 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" :form="form">
        <a-row :gutter="48">
          <a-col :md="4" :sm="24">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="托盘编号：">
              <a-input placeholder="托盘编号" disabled v-decorator="['pallet_code']" />
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="24">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="库位号">
              <a-input placeholder="库位号" disabled v-decorator="['location_code']" />
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="24">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="叉车号">
              <a-select v-decorator="['car_no',{initialValue:'01'}]">
                <a-select-option key="01" value="01">
                  叉车1
                </a-select-option>
                <a-select-option key="02" value="02">
                  叉车2
                </a-select-option>
                <a-select-option key="03" value="03">
                  叉车3
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col> <a-col :md="4" :sm="24">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="穿梭板号">
              <a-select v-decorator="['shuttleId',{initialValue:3001}]">
                <a-select-option :key="3001" :value="3001">
                  穿梭板1号
                </a-select-option>
                <a-select-option :key="3002" :value="3002">
                  穿梭板2号
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="24">
            <span class="table-page-search-submitButtons">
              <a-button type="primary" @click="getTaskInfo">
                获取任务
              </a-button>
              <a-button style="margin-left: 8px" type="primary" @click="sendOutTask">
                下发穿梭板指令
              </a-button>
              <a-button style="margin-left: 8px" @click="updateData" type="primary">下架完成
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
import { getDataBy } from '@/api/LocationMap'
import { TaskXInsert, xzkOut, getTaskInfo, TaskXFinish, getData } from '@/api/TaskX'
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
export default {
  name: 'ChuansuobanDownShelf',
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
        this.queryParam.task_type = '出库'
        return getData(parameter, this.queryParam).then(res => {
          console.log(res)
          this.form.setFieldsValue(pick(res.result.anything[0], ['location_code']))
          return res.result
        })
      },
      taskInfo: ''
    }
  },
  methods: {
    insertTask() {
      const palletCode = this.form.getFieldValue('pallet_code')
      const locationCode = this.form.getFieldValue('location_code')
      const promise = new Promise((resolve, reject) => {
        getDataBy({ pageNo: 1, pageSize: 99999999 }, { pallet_code: palletCode }).then(res => {
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
        TaskXInsert({ pallet_code: palletCode, location_code: locationCode }).then(result => {
          // console.log(result)
          if (result.status) {
            this.$message.success(result.message)
          } else {
            this.$message.warn(result.message)
          }
        })
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
    changePalletCode() {
      this.clearData()
      this.queryParam.pallet_code = 99999999999999
      this.$refs.table.refresh(true)
    },
    queryData_inventory() {
      this.form.validateFields((err, values) => {
        if (!err) {
          this.queryParam.pallet_code = values.pallet_code
          this.$refs.table.refresh(true)
        }
      })
    },
    clearData() {
      const temp = { pallet_code: '', location_code: '' }
      this.form.setFieldsValue(pick(temp, ['pallet_code', 'location_code']))
    },
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
    sendOutTask() {
      const shuttleId = this.form.getFieldValue('shuttleId')
      console.log({ shuttleId: shuttleId, wmsTaskId: this.taskInfo })
      xzkOut({ shuttleId: shuttleId, wmsTaskId: this.taskInfo }).then(res => {
        console.log(res)
        if (res.status) {
          this.$message.success(res.message)
        } else {
          this.$message.warn(res.message)
        }
      })
    },
    updateData(e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          TaskXFinish(values).then(res => {
            if (res.status) {
              this.$message.success(res.message)
            } else {
              this.$message.warn(res.message)
            }
          })
        }
      })
    },
    getTaskInfo() {
      const carNo = this.form.getFieldValue('car_no')
      console.log(carNo)
      if (carNo === '' || carNo === undefined) {
        this.$message.warn('请先选择叉车号')
        return
      }
      getTaskInfo(carNo).then(res => {
        if (res.status) {
          this.$nextTick(() => {
            this.form.setFieldsValue(pick(res.result, ['pallet_code', 'location_code']))
            this.queryData_inventory()
          })

          this.taskInfo = res.result.task_no
          this.$message.success(res.message)
        } else {
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
