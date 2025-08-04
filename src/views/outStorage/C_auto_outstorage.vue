<template>
  <a-card :bordered="false">
    <!-- 检索相关 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" :form="form">
        <a-row :gutter="48">
          <a-col :md="4" :sm="24" hidden>
            <a-form-item label="库位编号">
              <a-input v-decorator="['location_code']" />
            </a-form-item>
          </a-col>
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
              <a-button @click="clearData">重置</a-button>
              <a-button style="margin-left: 8px" @click="queryData" type="primary">查询</a-button>
              <a-button style="margin-left: 8px" @click="addData" type="primary">出库</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <!-- 表格 -->
    <s-table :customRow="customRow" row-key="location_code" bordered ref="table" size="default"
      :columns="columns" :data="loadData">
      <a-tag :color="text == '启用' ? 'green' : 'red'" slot="status" slot-scope="text">{{ text }}
      </a-tag>
      <span slot="createTime" slot-scope="text">{{ text | moment }}</span>
    </s-table>
  </a-card>

</template>

<script>
import pick from 'lodash.pick'
import { STable } from '@/components'

import { GetBy } from '@/api/InvenMaterialLocationmap'

import { GetStorageOut } from '@/api/TaskH'
import { getDropDownListBy } from '@/api/global'
import storage from 'store'
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
export default {
  name: 'COutstorage',
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
      // startTime: '1900-01-01',
      // endTime: '3000-01-01',
      queryParam: {},
      loadData: parameter => {
        // parameter.startTime = this.startTime
        // parameter.endTime = this.endTime
        this.queryParam.warehouse = 'H库'
        return GetBy(parameter, this.queryParam).then(res => {
          console.log(res)
          return res.result
        })
      },
      statusDic: [],
      clickCurrent: {},
      isYiku: '1'
    }
  },
  methods: {
    queryData() {
      this.queryParam.material_code = this.form.getFieldValue('material_code')
      this.queryParam.material_name = this.form.getFieldValue('material_name')
      this.queryParam.batch = this.form.getFieldValue('batch')
      this.$refs.table.refresh()
    },
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
            this.clickCurrent = record
            this.form.setFieldsValue(pick(record, ['material_code', 'material_name', 'batch']))
            event.currentTarget.style.background = '#e6f7ff'
          }
        }
      }
    },
    addData() {
      const locationCode = this.form.getFieldValue('location_code')
      GetStorageOut({ storageNo: locationCode }).then(res => {
        if (res.status) {
          this.$message.success(res.message)
        } else {
          this.$message.warn(res.message)
        }
      })
    },
    clearData() {
      const temp = { material_code: '', material_name: '', batch: '' }
      this.form.setFieldsValue(pick(temp, ['material_code', 'material_name', 'batch']))
      this.queryParam.material_code = ''
      this.queryParam.material_name = ''
      this.queryParam.batch = ''
      this.$refs.table.refresh(true)
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
