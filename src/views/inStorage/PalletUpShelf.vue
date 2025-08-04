<template>

  <a-row style="padding:5% 0">
    <a-col :push="6" :span="12">
      <a-card :bordered="false">

        <a-form class="permission-form" :form="form">
          <a-row type="flex" justify="space-around">
            <a-col :span="24">
              <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="任务类型">
                <a-radio-group v-model="isYiku" @change="yikuMethod">
                  <a-radio value="入库">入库</a-radio>
                  <a-radio value="移库">移库</a-radio>
                  <a-radio value="满入入库">满入</a-radio>
                </a-radio-group>
              </a-form-item>

              <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="托盘编号：">
                <a-input placeholder="托盘编号" @blur="getLocation" v-decorator="['pallet_code']" />
              </a-form-item>
              <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="货架号">
                <a-input placeholder="货架号" v-decorator="['row']" />
              </a-form-item>
              <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="远近">
                <a-select placeholder="远近" v-decorator="['farNear']">
                  <a-select-option key="远" value="远">远
                  </a-select-option>
                  <a-select-option key="近" value="近">近
                  </a-select-option>
                </a-select>
              </a-form-item>
              <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" :hidden="isYiku!=='移库'"
                label="起点库位">
                <a-input placeholder="起点库位" v-decorator="['udf03']" />
              </a-form-item>
              <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="库位号">
                <a-input placeholder="库位号" v-decorator="['location_code']" />
              </a-form-item>
              <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol"
                :hidden="(storageTypeText!=='P库'&&storageTypeText!=='B库' )|| isYiku=='移库'"
                label="操作口:">
                <a-select v-decorator="['prot_no']" :allowClear="true">
                  <!-- <a-select-option key="4012" value="4012">
                    箱式线—操作口4012
                  </a-select-option>
                  <a-select-option key="4079" value="4079">
                    箱式线操作口4079
                  </a-select-option> -->
                  <a-select-option key="4080" value="4080">
                    箱式线_电子标签下_操作口4080
                  </a-select-option>
                  <a-select-option key="4081" value="4081">
                    箱式线_电子标签下_操作口4081
                  </a-select-option>
                  <a-select-option key="4082" value="4082">
                    箱式线_电子标签下_操作口4082
                  </a-select-option>
                  <a-select-option key="4083" value="4083">
                    箱式线_电子标签下_操作口4083
                  </a-select-option>
                  <a-select-option key="4084" value="4084">
                    箱式线_电子标签下_操作口4084
                  </a-select-option>
                  <a-select-option key="4085" value="4085">
                    箱式线_电子标签下_操作口4085
                  </a-select-option>
                  <a-select-option key="4086" value="4086">
                    箱式线_电子标签下_操作口4086
                  </a-select-option>
                  <a-select-option key="4087" value="4087">
                    箱式线_电子标签下_操作口4087
                  </a-select-option>
                  <a-select-option key="4088" value="4088">
                    箱式线_电子标签下_操作口4088
                  </a-select-option>
                  <a-select-option key="4089" value="4089">
                    箱式线_电子标签下_操作口4089
                  </a-select-option>
                  <a-select-option key="4090" value="4090">
                    箱式线_电子标签下_操作口4090
                  </a-select-option>
                  <a-select-option key="4091" value="4091">
                    箱式线_电子标签下_操作口4091
                  </a-select-option>

                  <a-select-option key="3091" value="3091">
                    箱式线_扫码入库_操作口3091
                  </a-select-option>
                  <a-select-option key="3077" value="3077">
                    箱式线_扫码入库_操作口3077
                  </a-select-option>

                  <a-select-option key="3016" value="3016">
                    箱式线_电子标签上_操作口3016
                  </a-select-option>
                  <a-select-option key="3019" value="3019">
                    箱式线_电子标签上_操作口3019
                  </a-select-option>
                  <a-select-option key="3020" value="3020">
                    箱式线_电子标签上_操作口3020
                  </a-select-option>
                  <a-select-option key="3042" value="3042">
                    箱式线_电子标签上_操作口3042
                  </a-select-option>
                  <a-select-option key="3043" value="3043">
                    箱式线_电子标签上_操作口3043
                  </a-select-option>
                  <a-select-option key="3059" value="3059">
                    箱式线_电子标签上_操作口3059
                  </a-select-option>

                  <a-select-option key="6001" value="6001">
                    箱式线_机械手拣选_操作口6001
                  </a-select-option>
                  <a-select-option key="6002" value="6002">
                    箱式线_机械手拣选_操作口6002
                  </a-select-option>
                  <a-select-option key="6003" value="6003">
                    箱式线_机械手拣选_操作口6003
                  </a-select-option>
                  <a-select-option key="6004" value="6004">
                    箱式线_机械手拣选_操作口6004
                  </a-select-option>
                  <a-select-option key="6005" value="6005">
                    箱式线_机械手拣选_操作口6005
                  </a-select-option>
                  <a-select-option key="6006" value="6006">
                    箱式线_机械手拣选_操作口6006
                  </a-select-option>
                  <a-select-option key="6007" value="6007">
                    箱式线_机械手拣选_操作口6007
                  </a-select-option>
                  <a-select-option key="6008" value="6008">
                    箱式线_机械手拣选_操作口6008
                  </a-select-option>
                  <a-select-option key="6009" value="6009">
                    箱式线_机械手拣选_操作口6009
                  </a-select-option>
                  <a-select-option key="6010" value="6010">
                    箱式线_机械手拣选_操作口6010
                  </a-select-option>
                  <a-select-option key="6011" value="6011">
                    箱式线_人工拣选_操作口6011
                  </a-select-option>
                  <a-select-option key="6012" value="6012">
                    箱式线_人工拣选_操作口6012
                  </a-select-option>
                  <a-select-option key="6013" value="6013">
                    箱式线_人工拣选_操作口6013
                  </a-select-option>
                  <a-select-option key="6014" value="6014">
                    箱式线_人工拣选_操作口6014
                  </a-select-option>
                  <a-select-option key="6015" value="6015">
                    箱式线_人工拣选_操作口6015
                  </a-select-option>
                  <a-select-option key="6016" value="6016">
                    箱式线_人工拣选_操作口6016
                  </a-select-option>

                  <!-- 华丽的分隔符 -->
                  <a-select-option key="1007" value="1007">
                    托盘线_一楼托盘扫码点_操作口1007
                  </a-select-option>
                  <a-select-option key="1074" value="1074">
                    托盘线_一楼空托盘跺_操作口1074
                  </a-select-option>
                  <a-select-option key="1041" value="1041">
                    托盘线_一楼出库口_操作口1041
                  </a-select-option>
                  <a-select-option key="1033" value="1033">
                    托盘线_一楼出库口/入库口_操作口1033
                  </a-select-option>
                  <a-select-option key="1026" value="1026">
                    托盘线_一楼出库口_操作口1026
                  </a-select-option>
                  <a-select-option key="1023" value="1023">
                    托盘线_一楼出库口/入库口_操作口1023
                  </a-select-option>
                  <a-select-option key="1011" value="1011">
                    托盘线_一楼出库口/入库口_操作口1011
                  </a-select-option>
                  <a-select-option key="1009" value="1009">
                    托盘线_一楼出库口_操作口1009
                  </a-select-option>
                  <a-select-option key="1067" value="1067">
                    托盘线_人工拣选_操作口1067
                  </a-select-option>
                  <a-select-option key="1054" value="1054">
                    托盘线_人工拣选_操作口1054
                  </a-select-option>
                  <a-select-option key="1051" value="1051">
                    托盘线_人工拣选_操作口1051
                  </a-select-option>
                  <!-- <a-select-option key="1076" value="1076">
                    托盘线__操作口1076
                  </a-select-option> -->
                  <a-select-option key="2011" value="2011">
                    托盘线__操作口2011
                  </a-select-option>
                  <a-select-option key="2508" value="2508">
                    托盘线__操作口2508
                  </a-select-option>
                  <a-select-option key="2509" value="2509">
                    托盘线__操作口2509
                  </a-select-option>
                  <a-select-option key="2510" value="2510">
                    托盘线__操作口2510
                  </a-select-option>
                  <a-select-option key="2511" value="2511">
                    托盘线__操作口2511
                  </a-select-option>
                </a-select>
              </a-form-item>
              <!-- <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol"
                :hidden="storageTypeText!=='P库'" label="操作口:">
                <a-select v-decorator="['prot_no']">
                  <a-select-option key="A01" value="A01">
                    操作口1
                  </a-select-option>
                  <a-select-option key="A02" value="A02">
                    操作口2
                  </a-select-option>
                </a-select>
              </a-form-item> -->
              <!-- <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="库位编号:">
                <a-input placeholder="库位编号" v-decorator="['location_code']" />
              </a-form-item> -->
            </a-col>
            <!-- <a-col :span="24">
              <a-form-item>
                <s-table :customRow="customRow" bordered row-key="material" ref="table"
                  :pageSize="3" size="default" :columns="columns" :data="loadData">
                </s-table>
              </a-form-item>
            </a-col> -->
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
                <a-col :span="7">
                  <a-button size="large" class="btnStyle queryBtn" type="primary" @click="addData">
                    生成任务
                  </a-button>

                </a-col>
                <!-- <a-col :span="7">
                  <a-button size="large" class="btnStyle" @click="insertTask" type="primary">上架完成
                  </a-button>

                </a-col>
                <a-col :span="7">
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
import { getDataBy, getEmptyLocationP, getEmptyOutLocationB } from '@/api/LocationMap'
import { TaskPInsert, TaskBInsert } from '@/api/TaskX'
// import { palletUpDown } from '@/api/InvenMaterialLocationmap'
import storage from 'store'

const columns = [
  {
    title: '器材编号',
    dataIndex: 'material_code'
  },
  {
    title: '器材名称',
    dataIndex: 'material_name'
  },
  {
    title: '批号',
    dataIndex: 'batch'
  },
  {
    title: '库存数量',
    dataIndex: 'inventory_count'
  },
  {
    title: '托盘编号',
    dataIndex: 'pallet_code'
  }
]
export default {
  name: 'PalletUpShelf',
  components: {
    STable
  },
  data() {
    return {
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
      storageTypeText: ''
    }
  },
  methods: {
    yikuMethod(e) {
      this.isYiku = e.target.value
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
      if (storageTypeText === 'B库' || storageTypeText === 'C库') {
        if (taskInfo.pallet_code.length !== 8) {
          this.$message.warn('该载具编号长度不正确')
          return
        }
        if (taskInfo.pallet_code.charAt(0) !== 'B') {
          this.$message.warn('该载具不属于此库')
          return
        }
      } else if (storageTypeText === 'X库' || storageTypeText === 'D库' || storageTypeText === 'P库') {
        if (taskInfo.pallet_code.length !== 7) {
          this.$message.warn('该载具编号长度不正确')
          return
        }
        if (taskInfo.pallet_code.charAt(0) !== 'P') {
          this.$message.warn('该载具不属于此库')
          return
        }
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
          if (taskInfo.prot_no === undefined) {
            taskInfo.task_type = '入库'
          } else {
            taskInfo.task_type = '回库'
          }
        } else if (this.isYiku === '移库') {
          taskInfo.task_type = '移库'
        } else if (this.isYiku === '满入入库') {
          taskInfo.task_type = '满入入库'
        }
        if (this.storageTypeText === 'P库') {
          TaskPInsert(taskInfo).then(result => {
            if (result.status) {
              this.$message.success(result.message)
              const temp = { pallet_code: '', location_code: '' }
              this.form.setFieldsValue(pick(temp, ['pallet_code', 'location_code']))
            } else {
              this.$message.warn(result.message)
            }
          })
        } else if (this.storageTypeText === 'B库') {
          TaskBInsert(taskInfo).then(result => {
            if (result.status) {
              this.$message.success(result.message)
              const temp = { pallet_code: '', location_code: '' }
              this.form.setFieldsValue(pick(temp, ['pallet_code', 'location_code']))
            } else {
              this.$message.warn(result.message)
            }
          })
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
      console.log(row, farNear)
      if (row === undefined || farNear === undefined) {
        return
      }
      if (this.storageTypeText === 'P库') {
        getEmptyLocationP(row, farNear).then(res => {
          if (res.status) {
            this.form.setFieldsValue(pick(res.result, ['location_code']))
          } else {
            this.$message.warn(res.message)
          }
        })
      } else if (this.storageTypeText === 'B库') {
        getEmptyOutLocationB(row, farNear).then(res => {
          if (res.status) {
            console.log(res)
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
