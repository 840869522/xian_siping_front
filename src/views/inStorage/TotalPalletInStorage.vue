<template>

  <a-row style="padding:5% 0">
    <a-col :push="6" :span="12">
      <a-card :bordered="false">
        <a-form class="permission-form" :form="form">
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="托盘号：">
            <a-input placeholder="扫描托盘号" v-decorator="['pallet_code']" @keydown.enter="queryData"
              @change="changePalletCode" />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="物料编码：">
            <a-input placeholder="物料编码" disabled v-decorator="['material_code']" />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="物料名称：">
            <a-input placeholder="物料名称" disabled v-decorator="['material_name']" />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="批次：">
            <a-input placeholder="批次" disabled v-decorator="['batch']" />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="数量：">
            <a-input placeholder="数量" disabled v-decorator="['inventory_count']" />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="库位号">
            <a-input placeholder="库位号" v-decorator="['location_code']" />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="操作口:">
            <a-select v-decorator="['prot_no']">
              <a-select-option :key="'A01'" :value="'A01'">
                操作口1
              </a-select-option>
              <a-select-option :key="'A02'" :value="'A02'">
                操作口2
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-col :span="24">
            <a-form-item>
              <s-table :customRow="customRow" bordered ref="table" size="default" :columns="columns"
                :pageSize="3" :data="loadData">
              </s-table>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-row type="flex" justify="space-around">
              <a-col :span="10">
                <a-button size="large" class="btnStyle" @click="taskDown" type="primary">入库
                </a-button>
              </a-col>
              <a-col :span="10">
                <a-button size="large" class="btnStyle" type="default" @click="clearData">取消
                </a-button>
              </a-col>
            </a-row>
          </a-col>
        </a-form>
      </a-card>
    </a-col>
  </a-row>

</template>

<script>
import pick from 'lodash.pick'
import { STable } from '@/components'
import { getDataByInventory } from '@/api/Inventory'
import { TaskDInsert } from '@/api/TaskX'
import { getDropDownListBy } from '@/api/global'
import storage from 'store'
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
    title: '库存数量',
    dataIndex: 'inventory_count'
  },
  // {
  //   title: '批次',
  //   dataIndex: 'batch'
  // },
  {
    title: '库位编号',
    dataIndex: 'location_code'
  }
  // {
  //   title: '最近空库位',
  //   dataIndex: 'location1'
  // }
  // {
  //   title: '载具编号',
  //   dataIndex: 'pallet_code'
  // },
  // {
  //   title: '状态',
  //   dataIndex: 'status'
  // },
  // {
  //   title: '创建人',
  //   dataIndex: 'creator'
  // },
  // {
  //   title: '创建时间',
  //   dataIndex: 'create_time'
  // }
]
export default {
  name: 'TotalPalletInStorage',
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
      queryParamBy: { pageNo: 1, pageSize: 1, startTime: '1900-01-01', endTime: '3000-01-01' },
      queryParam: { pallet_code: 9999999999 },
      loadData: parameter => {
        parameter.startTime = this.startTime
        parameter.endTime = this.endTime
        return getDataByInventory(parameter, this.queryParam).then(res => {
          console.log(res)
          return res.result
        })
      },
      statusDic: [],
      clickCurrent: {}
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
    queryData(e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          // 此处加一个分配库位的调用
          values.location_code = ''
          console.log(values)
          this.queryParam.pallet_code = values.pallet_code
          this.$refs.table.refresh(true)
          getDataByInventory(this.queryParamBy, values).then(res => {
            console.log(res)
            if (res.status) {
              this.$nextTick(() => {
                this.form.setFieldsValue(pick(res.result.anything[0], ['material_code', 'material_name', 'inventory_count', 'batch']))
              })
            } else {
              this.$message.warn(res.message)
            }
          })
        }
      })
    },
    taskDown(e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          values.status = '待执行'
          values.task_type = '入库'
          values.creator = this.userInfo.user_name
          TaskDInsert(values).then(res => {
            if (res.status) {
              this.$message.success(res.message)
            } else {
              this.$message.warn(res.message)
            }
          })
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
