<template>
  <a-card :bordered="false">
    <!-- 检索相关 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @submit="getDataBy" :form="form">
        <a-row :gutter="48">
          <a-col :md="4" :sm="24">
            <a-form-item label="器材编号">
              <a-input v-decorator="['material_code']" />
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="24">
            <a-form-item label="器材名称">
              <a-input v-decorator="['material_name']" />
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="24">
            <a-form-item label="批次">
              <a-input v-decorator="['batch']" />
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="24">
            <a-form-item label="状态">
              <a-select placeholder="请选择" v-decorator="['status']">
                <a-select-option v-for="item in statusDic" :key="item" :value="item">
                  {{ item }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <span class="table-page-search-submitButtons">
              <a-button @click="clearSelectBy">重置</a-button>
              <a-button style="margin-left: 8px" html-type="submit" type="primary">查询</a-button>
            </span>
          </a-col>
          <a-col :md="4" :sm="24">
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
          <a-col :md="6" :sm="24">
            <span class="table-page-search-submitButtons">
              <a-button style="margin-left: 8px" type="primary" @click="addData">下架</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <!-- 表格 -->
    <s-table row-key="location_code" bordered ref="table" size="default" :columns="columns"
      :data="loadData" :row-selection="{selectedRowKeys:selectedRowKeys,onChange:onSelectChange}">
      <a-tag :color="text == '启用' ? 'green' : 'red'" slot="status" slot-scope="text">{{ text }}
      </a-tag>
      <span slot="createTime" slot-scope="text">{{ text | moment }}</span>
    </s-table>
  </a-card>

</template>

<script>
import pick from 'lodash.pick'
import { STable } from '@/components'
import { TaskDInsert } from '@/api/TaskX'
import { GetBy } from '@/api/InvenMaterialLocationmap'
// import { palletUpDown } from '@/api/InvenMaterialLocationmap'
import storage from 'store'
// import { getDataBy } from '@/api/LocationMap'
// import { getDataByInventory } from '@/api/Inventory'
import { getDropDownListBy } from '@/api/global'
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
    title: '器材编号',
    dataIndex: 'material_code'
  },
  {
    title: '器材名称',
    dataIndex: 'material_name'
  },
  {
    title: '库存数量',
    dataIndex: 'inventory_count'
  },
  {
    title: '批号',
    dataIndex: 'batch'
  },
  {
    title: '状态',
    dataIndex: 'status'
  },
  {
    title: '创建人',
    dataIndex: 'creator'
  },
  {
    title: '创建时间',
    dataIndex: 'create_time'
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
      storageName: '',
      statusDic: [],
      selectedRowKeys: [],
      selectedData: []
      // initFlag: false,
      // initData: { result: { anything: [] }, pageNo: 1, pageSize: 6, totalCount: 0, totalPage: 0 }
    }
  },
  methods: {
    onSelectChange(selectedRowKeys, selectedData) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedData = selectedData
    },
    loadData: parameter => {
      // queryParam.pallet_code = 'P6'
      queryParam.warehouse = 'D库'
      // queryParam.status = '启用'
      console.log(queryParam)
      return GetBy(parameter, queryParam).then(res => {
        console.log(res)
        return res.result
      })
    },
    getDataBy(e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          this.selectedRowKeys = []
          this.selectedData = []
          this.queryParam = values
          this.$refs.table.refresh(true)
        }
      })
    },
    clearSelectBy() {
      this.queryParam = { material_code: '', material_name: '', pallet_code: '', location_code: '', status: '' }
      this.form.setFieldsValue(pick(this.queryParam, ['material_code', 'material_name', 'pallet_code', 'location_code', 'status']))
      this.$refs.table.refresh(true)
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
      console.log(this.selectedRowKeys, this.selectedData)
      if (this.selectedRowKeys.length !== 1) {
        this.$message.warn('每次只能选择一条数据')
        return
      }
      const taskObj = {}
      taskObj.location_code = this.selectedData[0].location_code
      taskObj.pallet_code = this.selectedData[0].pallet_code
      taskObj.task_type = '出库'
      taskObj.status = '待执行'
      console.log(taskObj)
      TaskDInsert(taskObj).then(result => {
        console.log(result)
        if (result.status) {
          this.selectedRowKeys = []
          this.selectedData = []
          this.$message.success(result.message)
          this.$refs.table.refresh(true)
          this.clearData()
        } else {
          this.$message.warn(result.message)
        }
      })
    },

    clearData() {
      const temp = { pallet_code: '', location_code: '' }
      this.form.setFieldsValue(pick(temp, ['pallet_code', 'location_code']))
    },
    getDic() {
      getDropDownListBy('t_task_status').then(res => {
        this.statusDic = res.result.anything
      })
    }
  },
  created() {
    this.userInfo = storage.get('userInfo')
    this.storageName = storage.get('storageTypeText')
    this.getDic()
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
