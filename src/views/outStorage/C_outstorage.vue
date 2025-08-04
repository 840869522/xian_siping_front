<template>
  <a-card :bordered="false">
    <!-- 检索相关 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" :form="form">
        <a-row :gutter="48">
          <!-- <a-col :md="3" :sm="24">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="柜号">
              <a-radio-group v-model="isYiku" @change="yikuMethod">
                <a-radio value="1">1</a-radio>
                <a-radio value="2">2</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col> -->
          <a-col :md="4" :sm="24">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="库位号">
              <a-input placeholder="库位号" v-decorator="['location_code']" />
            </a-form-item>
          </a-col>
          <!-- <a-col :md="4" :sm="24">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="料箱号">
              <a-input placeholder="料箱号" v-decorator="['pallet_code']" />
            </a-form-item>
          </a-col> -->
          <!-- <a-col :md="4" :sm="24">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="层号">
              <a-input placeholder="层号" v-decorator="['layer']" />
            </a-form-item>
          </a-col> -->
          <a-col :md="2" :sm="24">
            <span class="table-page-search-submitButtons">
              <a-button @click="queryData" type="primary">查询
              </a-button>
              <a-button @click="clearData" style="margin-left:8px">重置
              </a-button>
              <a-button @click="addData" style="margin-left:8px" type="primary">出库
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
      this.queryParam.location_code = this.form.getFieldValue('location_code')
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
            this.form.setFieldsValue(pick(record, ['pallet_code', 'location_code']))
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
      const temp = { location_code: '' }
      this.form.setFieldsValue(pick(temp, ['location_code']))
      this.queryParam.location_code = ''
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
