<template>
  <a-card :bordered="false">
    <!-- 检索相关 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" :form="form">
        <a-row :gutter="48">
          <a-col :md="6" :sm="24">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="拣货口:">
              <a-select v-decorator="['prot_no',{initialValue:'4012'}]" :allowClear="true">
                <a-select-option v-for="item in protNoList" :key="item.value" :value="item.value">
                  {{ item.text }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="24">
            <span class="table-page-search-submitButtons">
              <a-button type="primary" @click="addData">
                空料箱出库
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
// import { getDataBy } from '@/api/LocationMap'
// import { getDataByInventory } from '@/api/Inventory'
import { TaskBInsert } from '@/api/TaskX'
import { GetEmptyPalletByWarehouse } from '@/api/InvenMaterialLocationmap'
// import { palletUpDown } from '@/api/InvenMaterialLocationmap'
import storage from 'store'

const columns = [
  {
    title: '库位编号',
    dataIndex: 'location_code'
  },
  {
    title: '料箱编号',
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
const protNoList = [
  { value: '4012', text: '出库口1' },
  { value: '4079', text: '出库口2' }
]
export default {
  name: 'EmptyPalletOutstorage',
  components: {
    STable
  },
  data() {
    return {
      protNoList,
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
        this.queryParam.warehouse = 'P库'
        this.queryParam.status = '启用'
        return GetEmptyPalletByWarehouse(parameter, this.queryParam).then(res => {
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
      const params = {}
      params.warehouse = 'B库'
      params.status = '启用'
      const promise = new Promise((resolve, reject) => {
        GetEmptyPalletByWarehouse({ pageSize: 1, pageNo: 1 }, params).then(res => {
          if (res.status) {
            resolve(res)
          } else {
            reject(res)
          }
        })
      })
      promise.then(res => {
        if (res.result.anything.length !== 1) {
          this.$message.warn(res.message)
          return
        }
        const taskInfo = {}
        taskInfo.location_code = res.result.anything[0].location_code
        taskInfo.pallet_code = res.result.anything[0].pallet_code
        taskInfo.task_type = '出库'
        taskInfo.prot_no = this.prot_no
        TaskBInsert(taskInfo).then(result => {
          if (result.status) {
            this.$message.success(result.message)
            this.$refs.table.refresh(true)
            this.clearData()
          } else {
            this.$message.warn(result.message)
          }
        })
      })
    },
    changePalletCode() {
      this.clearData()
      this.$refs.table.refresh(true)
    },
    getLocation() {},

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
