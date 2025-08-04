<template>

  <a-row style="padding:2% 0">
    <a-col :push="6" :span="12">
      <a-card :bordered="false">

        <a-form class="permission-form" :form="form">
          <a-row type="flex" justify="space-around">
            <a-col :span="24">
              <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="托盘编号：">
                <a-input placeholder="托盘编号扫描后回车" @keydown.enter="queryData_inventory"
                  v-decorator="['pallet_code']" />
              </a-form-item>
              <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="库位号">
                <a-input placeholder="库位号" v-decorator="['location_code']" />
              </a-form-item>

              <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="穿梭板号:">
                <a-select v-decorator="['shuttleId']">
                  <a-select-option :key="3001" :value="3001">
                    穿梭板1号
                  </a-select-option>
                  <a-select-option :key="3002" :value="3002">
                    穿梭板2号
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>

            <a-col :span="24">
              <a-form-item>
                <s-table :customRow="customRow" bordered row-key="material" ref="table"
                  :pageSize="3" size="default" :columns="columns" :data="loadData">
                </s-table>
              </a-form-item>
            </a-col>
            <!-- <a-col :push="1" :span="10">
              <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="货位：">
                <a-input placeholder="货位" v-decorator="['location_code']" />
              </a-form-item>
            </a-col>
            <a-col :span="10">
              <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="容量：">
                <a-input placeholder="容量" v-decorator="['volume']" />
              </a-form-item>
            </a-col> -->
            <a-col :span="24">
              <a-row type="flex" justify="space-around">
                <a-col :span="6">
                  <a-button size="large" class="btnStyle queryBtn" type="primary"
                    @click="insertTask">
                    下发导航任务
                  </a-button>
                </a-col>
                <a-col :span="6">
                  <a-button size="large" class="btnStyle" type="primary" @click="sendInTask">
                    下发穿梭板指令
                  </a-button>
                </a-col>
                <a-col :span="6">
                  <a-button size="large" class="btnStyle" @click="updateData" type="primary">上架完成
                  </a-button>

                </a-col>
                <!-- <a-col :span="6">
                  <a-button size="large" class="btnStyle" type="default" @click="clearData">取消
                  </a-button>
                </a-col> -->
              </a-row>
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
import { getDataByInventory } from '@/api/Inventory'
import { getDataBy } from '@/api/LocationMap'
import { addData, xzkIn, TaskXFinish } from '@/api/TaskX'
const columns = [
  {
    title: '物料编号',
    dataIndex: 'material_code'
  },
  {
    title: '物料名称',
    dataIndex: 'material_name'
  },
  {
    title: '批次',
    dataIndex: 'batch'
  },
  {
    title: '库存数量',
    dataIndex: 'inventory_count'
  },
  {
    title: '托盘号',
    dataIndex: 'pallet_code'
  }
]
export default {
  name: 'ChuansuobanUpShelf',
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
      startTime: '1900-01-01',
      endTime: '3000-01-01',
      queryParam: { pallet_code: 99999999999 },
      loadData: parameter => {
        parameter.startTime = this.startTime
        parameter.endTime = this.endTime
        return getDataByInventory(parameter, this.queryParam).then(res => {
          console.log(res)
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
        if (res.result.totalCount > 0) {
          return
        }
        addData({ task_type: '入库', status: '待执行', pallet_code: palletCode, location_code: locationCode }).then(result => {
          console.log(result)
          this.taskInfo = result.result.task_no
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
    sendInTask() {
      const shuttleId = this.form.getFieldValue('shuttleId')
      console.log(shuttleId)
      const taskNo = this.taskInfo
      xzkIn({ shuttleId: shuttleId, wmsTaskId: taskNo }).then(res => {
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
          console.log(values)
          TaskXFinish(values).then(res => {
            if (res.status) {
              this.$message.success(res.message)
            } else {
              this.$message.warn(res.message)
            }
          })
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
