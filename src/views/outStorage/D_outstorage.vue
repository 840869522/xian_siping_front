<template>
  <a-card :bordered="false">
    <!-- 检索相关 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" :form="form">
        <a-row :gutter="48">
          <a-col :md="4" :sm="24">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="库位号">
              <a-input placeholder="库位号" v-decorator="['location_code']"
                @blur="queryData_inventory" />
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="24">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="托盘编号：">
              <a-input placeholder="托盘编号" v-decorator="['pallet_code']" />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="操作口:">
              <a-select v-decorator="['prot_no',{initialValue:'A01'}]" allowClear>
                <a-select-option key="A01" value="A01">
                  操作口1
                </a-select-option>
                <a-select-option key="A02" value="A02">
                  操作口2
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>

          <a-col :md="4" :sm="24">
            <span class="table-page-search-submitButtons">
              <a-button type="primary" @click="addData">
                生成任务
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
import { TaskDInsert } from '@/api/TaskX'
// import { palletUpDown } from '@/api/InvenMaterialLocationmap'
import storage from 'store'
import { getDataBy } from '@/api/LocationMap'
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
const queryParam = {}
export default {
  name: 'DOutstorage',
  components: {
    STable
  },
  data() {
    return {
      isYiku: '',
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
      storageName: ''
      // initFlag: false,
      // initData: { result: { anything: [] }, pageNo: 1, pageSize: 6, totalCount: 0, totalPage: 0 }
    }
  },
  methods: {
    loadData: parameter => {
      queryParam.pallet_code = 'P6'
      queryParam.warehouse = 'D库'
      queryParam.status = '启用'
      console.log(queryParam)
      return getDataBy(parameter, queryParam).then(res => {
        console.log(res)
        return res.result
      })
    },
    customRow(record, index) {
      return {
        on: {
          // 鼠标单击行
          click: event => {
            // this.$refs.table.refresh(true)
            // 点击入库单给其行设置高亮颜色
            event.currentTarget.parentNode.querySelectorAll('tr').forEach(item => {
              item.style.background = 'white'
            })
            this.form.setFieldsValue(pick(record, ['pallet_code', 'location_code']))
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
      taskInfo.prot_no = this.form.getFieldValue('prot_no')
      taskInfo.task_type = '出库'
      taskInfo.status = '待执行'
      taskInfo.creator = this.userInfo.user_name
      TaskDInsert(taskInfo).then(result => {
        console.log(result)
        if (result.status) {
          this.$message.success(result.message)
          this.$refs.table.refresh(true)
          this.clearData()
        } else {
          this.$message.warn(result.message)
        }
      })
    },

    queryData_inventory() {
      this.form.setFieldsValue(pick({ pallet_code: '' }, ['pallet_code']))
      const locationCode = this.form.getFieldValue('location_code')
      // this.form.validateFields((err, values) => {
      //   if (!err) {
      queryParam.location_code = locationCode
      this.$refs.table.refresh(true)
      //   }
      // })
    },
    clearData() {
      const temp = { pallet_code: '', location_code: '' }
      this.form.setFieldsValue(pick(temp, ['pallet_code', 'location_code']))
    }
  },
  created() {
    this.userInfo = storage.get('userInfo')
    this.storageName = storage.get('storageTypeText')
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
