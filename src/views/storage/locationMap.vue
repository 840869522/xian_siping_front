<template>
  <a-card :bordered="false">
    <!-- 检索相关 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @submit="getDataBy" :form="formBy">
        <a-row :gutter="48">
          <a-col :md="4" :sm="24">
            <a-form-item label="库位编号">
              <a-input v-decorator="['location_code']" />
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="24">
            <a-form-item label="托盘编号">
              <a-input v-decorator="['pallet_code']" />
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="24">
            <a-form-item label="库位名称">
              <a-select placeholder="请选择仓库" v-decorator="['warehouse']" :allowClear="true">
                <a-select-option v-for="item in storageTypeDicList" :key="item.dic_display_value"
                  :value="item.dic_display_value">
                  {{ item.dic_display_value }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="24">
            <a-form-item label="状态">
              <a-select placeholder="请选择" v-decorator="['status']" :allowClear="true">
                <a-select-option v-for="item in statusDic" :key="item" :value="item">
                  {{ item }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="24">
            <span class="table-page-search-submitButtons">
              <a-button @click="clearSelectBy">重置</a-button>
              <a-button style="margin-left: 8px" html-type="submit" type="primary">查询</a-button>

            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <!-- 表格 -->
    <s-table row-key="inventory_id" bordered ref="table" size="default" :columns="columns"
      :data="loadData">
      <a-tag :color="text == '启用' ? 'green' : 'red'" slot="status" slot-scope="text">{{ text }}
      </a-tag>
      <span slot="action" slot-scope="text, record">
        <a @click="updateGetValue(record)">编辑</a>
      </span>
    </s-table>
    <!-- 编辑 -->
    <a-modal title="编辑" style="top: 20px" :width="800" v-model="visibleUpdate" @ok="updateSure">
      <a-form class="permission-form" :form="formUpdate">
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="库位编号">
          <a-input disabled v-decorator="['location_code']" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="托盘编号">
          <a-input placeholder="托盘编号" v-decorator="['pallet_code']" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="状态">
          <a-input placeholder="状态" v-decorator="['status']" />
        </a-form-item>
      </a-form>
    </a-modal>

  </a-card>
</template>

<script>
import pick from 'lodash.pick'
import { STable } from '@/components'
import { getDataBy, updateData } from '@/api/LocationMap'
import { getDropDownListBy, getDicBy } from '@/api/global'
// 表头
const columns = [
  {
    title: '库位编号',
    dataIndex: 'location_code'
  },
  {
    title: '库位类型',
    dataIndex: 'warehouse'
  },
  {
    title: '托盘编号',
    dataIndex: 'pallet_code'
  },
  {
    title: '状态',
    dataIndex: 'status'
  },
  {
    title: '操作',
    width: '70px',
    dataIndex: 'action',
    scopedSlots: { customRender: 'action' }
  }
]

export default {
  name: 'LocationMap',
  components: {
    STable
  },
  data() {
    return {
      storageTypeDicList: [],
      // 添加模态框是否显示
      visibleAdd: false,
      // 更新模态框是否显示
      visibleUpdate: false,
      // 编辑form
      formUpdate: this.$form.createForm(this),
      // 条件查询form
      formBy: this.$form.createForm(this),
      // 新增form
      formAdd: this.$form.createForm(this),
      // 查询参数
      queryParam: {},
      // 表头
      columns,
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        const storageTypeText = JSON.parse(localStorage.getItem('storageTypeText'))
        this.queryParam.warehouse = storageTypeText
        return getDataBy(parameter, this.queryParam).then(res => {
          console.log(res)
          return res.result
        })
      },
      // 状态字典列表
      statusDic: [],
      // 动态栅格
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      }
    }
  },
  methods: {
    // 条件查询按钮点击事件
    getDataBy(e) {
      e.preventDefault()
      this.formBy.validateFields((err, values) => {
        if (!err) {
          this.queryParam = values
          this.$refs.table.refresh(true)
        }
      })
    },
    // 重置检索条件
    clearSelectBy() {
      this.queryParam = { location_code: '', pallet_code: '', status: '', warehouse: '' }
      this.formBy.setFieldsValue(pick(this.queryParam, ['location_code', 'pallet_code', 'status', 'warehouse']))
      this.$refs.table.refresh(true)
    },
    // 新增按钮点击事件
    // addData(e) {
    //   this.visibleAdd = true
    // },
    // 确认新增点击事件
    // addDataSure(e) {
    //   e.preventDefault()
    //   this.formAdd.validateFields((err, values) => {
    //     if (!err) {
    //       console.log(values)
    //       addData(values).then(res => {
    //         this.visibleAdd = false
    //         if (res.status) {
    //           this.$refs.table.refresh(true)
    //           this.$message.success(res.message)
    //         } else {
    //           this.$message.warn(res.message)
    //         }
    //       })
    //     }
    //   })
    // },

    // 编辑按钮取值给模态框
    updateGetValue(record) {
      this.visibleUpdate = true
      this.$nextTick(() => {
        this.formUpdate.setFieldsValue(pick(record, ['pallet_code', 'location_code', 'status']))
      })
    },
    // 确定更新数据
    updateSure(e) {
      this.visibleUpdate = false
      e.preventDefault()
      this.formUpdate.validateFields((err, values) => {
        if (!err) {
          updateData(values).then(res => {
            if (res.status) {
              this.$refs.table.refresh(true)
              this.$message.success(res.message)
            } else {
              this.$message.warn(res.message)
            }
          })
        }
      })
    },
    // 删除数据
    // delData(record) {
    //   const modal = this.$confirm({
    //     content: '确定删除此用户吗？',
    //     okText: '删除',
    //     cancelText: '取消',
    //     onOk() {
    //       delData({ login_name: record.login_name }).then(res => {
    //         if (res.status) {
    //           this.$refs.table.refresh(true)
    //           this.$message.success(res.message)
    //         } else {
    //           this.$message.warn(res.message)
    //         }
    //       })
    //     },
    //     onCancel() {
    //       modal.destroy()
    //     }
    //   })
    // },
    // 取检索条件的数据字典
    getDic() {
      getDropDownListBy('baseStatus').then(res => {
        this.statusDic = res.result.anything
      })
      getDicBy({ dic_name: 'store_classify' }).then(res => {
        this.storageTypeDicList = res.result.anything
      })
    }
  },
  created() {
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
</style>
