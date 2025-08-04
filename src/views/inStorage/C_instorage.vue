<template>
  <a-card :bordered="false">
    <!-- 检索相关 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" :form="form">
        <a-row :gutter="48">
          <a-col :md="4" :sm="24">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="器材编号">
              <a-input placeholder="器材编号" v-decorator="['material_code']" />
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="24">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="器材名称">
              <a-input placeholder="器材名称" v-decorator="['material_name']" />
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="24">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="批号">
              <a-input placeholder="批号" v-decorator="['batch']" />
            </a-form-item>
          </a-col>
          <a-col :md="2" :sm="24">
            <span class="table-page-search-submitButtons">
              <a-button @click="getBox" type="primary">申请料箱
              </a-button>
            </span>
          </a-col>
          <a-col :md="3" :sm="24">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="柜号">
              <a-radio-group v-model="isYiku" @change="yikuMethod">
                <a-radio value="1">1</a-radio>
                <a-radio value="2">2</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="24">
            <span class="table-page-search-submitButtons">
              <a-button @click="taskDown" type="primary">入库
              </a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <!-- 表格 -->
    <s-table :customRow="customRow" bordered row-key="location_code" ref="table" :pageSize="20"
      size="default" :columns="columns" :data="loadData">
    </s-table>
  </a-card>
</template>

<script>
import pick from 'lodash.pick'
import { STable } from '@/components'
import { GetStorageEmpty, InTask } from '@/api/TaskH'

import { GetBy } from '@/api/InvenMaterialLocationmap'
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
  name: 'CInstorage',
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
    yikuMethod(e) {
      this.isYiku = e.target.value
    },
    getBox() {
      const inventory = {}
      inventory.materialCode = this.form.getFieldValue('material_code')
      inventory.materialName = this.form.getFieldValue('material_name')
      inventory.batch = this.form.getFieldValue('batch')
      GetStorageEmpty(inventory).then(res => {
        console.log(res)
        if (res.status) {
          this.$message.success(res.message)
        } else {
          this.$message.warn(res.message)
        }
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
            this.clickCurrent = record
            this.form.setFieldsValue(pick(record, ['material_code', 'material_name', 'batch']))
            event.currentTarget.style.background = '#e6f7ff'
          }
        }
      }
    },

    taskDown() {
      InTask({ storageNo: this.isYiku }).then(res => {
        if (res.status) {
          this.$message.success(res.message)
        } else {
          this.$message.warn(res.message)
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
