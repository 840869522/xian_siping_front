<template>

  <a-row style="padding:5% 0">
    <a-col :push="6" :span="12">
      <a-card :bordered="false">

        <a-form class="permission-form" :form="form" @submit="bindData">
          <a-row type="flex" justify="space-around">
            <a-col :span="20">
              <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="暂存/托盘：">
                <a-input placeholder="托盘编号" @blur="queryData_inventory" @change="changePalletCode"
                  v-decorator="['pallet_code_localtion']" />
              </a-form-item>
              <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="器材编号：">
                <a-input placeholder="器材编号" disabled v-decorator="['material_code']" />
              </a-form-item>
              <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="批号：">
                <a-input placeholder="批号" disabled v-decorator="['batch']" />
              </a-form-item>
              <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="托盘编号：">
                <a-input placeholder="托盘编号" @blur="queryData_inventory"
                  v-decorator="['pallet_code']" />
              </a-form-item>
              <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="数量：">
                <a-input placeholder="数量" v-decorator="['inventory_count']" />
              </a-form-item>
              <a-form-item :labelCol="labelCol" hidden :wrapperCol="wrapperCol" label="器材名称：">
                <a-input placeholder="器材名称" v-decorator="['material_name']" />
              </a-form-item>
              <!-- <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="库位编号:">
                <a-input placeholder="库位编号" v-decorator="['location_code']" />
              </a-form-item> -->
            </a-col>
            <a-col :span="4">
              <a-button size="large" class="btnStyle queryBtn" html-type="submit" type="primary">绑定
              </a-button>
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
            <a-col :span="20">
              <a-row type="flex" justify="space-around">
                <!-- <a-col :span="6">
                  <a-button size="large" class="btnStyle" type="primary" @click="getStorageNo">分配货位
                  </a-button>

                </a-col> -->
                <a-col :span="6">
                  <a-button size="large" class="btnStyle" @click="insertTask" type="primary">上架
                  </a-button>

                </a-col>
                <a-col :span="6">
                  <a-button size="large" class="btnStyle" type="default" @click="clearData">取消
                  </a-button>
                </a-col>
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
import { getDataByInventory, dataBind } from '@/api/Inventory'
import { addData } from '@/api/Task'
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
  name: 'BindUpShelf',
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
      }
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
    changePalletCode() {
      this.clearData()
      this.queryParam.pallet_code = 99999999999999
      this.$refs.table.refresh(true)
    },
    queryData_inventory() {
      this.form.validateFields((err, values) => {
        if (!err) {
          this.queryParam.pallet_code = values.pallet_code_localtion
          this.$refs.table.refresh(true)
        }
      })
    },
    clearData() {
      const temp = { material_code: '', material_name: '', pallet_code: '', inventory_count: '', batch: '' }
      this.form.setFieldsValue(pick(temp, ['material_code', 'material_name', 'pallet_code', 'inventory_count', 'batch']))
    },
    bindData(e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          dataBind(values).then(res => {
            if (res.status) {
              this.$message.success(res.message)
              this.$refs.table.refresh(true)
            } else {
              // console.log(333)
              // this.$message.warn(res.message)
            }
          })
        }
      })
    },
    getStorageNo() {},
    insertTask(e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          addData(values).then(res => {
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
.queryBtn {
  height: 80%;
}
</style>
