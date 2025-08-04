<template>
  <a-card :bordered="false">
    <!-- 检索相关 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @submit="getDataBy" :form="formBy">
        <a-row :gutter="48">
          <a-col :md="4" :sm="24">
            <a-form-item label="载具编号">
              <a-input v-decorator="['pallet_code']" />
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="24">
            <a-form-item label="库位编号">
              <a-input v-decorator="['location_code']" />
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
          <a-col :md="4" :sm="24">
            <span class="table-page-search-submitButtons">
              <a-button @click="clearSelectBy">重置</a-button>
              <a-button style="margin-left: 8px" html-type="submit" type="primary">查询</a-button>
            </span>
          </a-col>
          <a-col :md="4" :sm="24">
            <a-form-item label="操作口">
              <a-select placeholder="请选择" v-decorator="['status1']">
                <a-select-option v-for="item in statusDicOperationLocation" :key="item"
                  :value="item">
                  {{ item }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>

          <a-col :md="4" :sm="24">
            <span class="table-page-search-submitButtons">
              <a-button style="margin-left: 8px" type="primary" @click="addData">下架</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <!-- 表格 -->
    <s-table row-key="vehicle_id" bordered ref="table" size="default" :columns="columns"
      :data="loadData" :row-selection="{selectedRowKeys:selectedRowKeys,onChange:onSelectChange}">
      <a-tag :color="text == '启用' ? 'green' : 'red'" slot="status" slot-scope="text">{{ text }}
      </a-tag>
      <span slot="createTime" slot-scope="text">{{ text | moment }}</span>
      <span slot="action" slot-scope="text, record">
        <a @click="updateGetValue(record)">编辑</a>
        <a-divider type="vertical" />
        <a href="javascript:;" @click="delData(record)">删除</a>
      </span>
    </s-table>
    <!-- 编辑 -->
    <!-- <a-modal title="编辑" style="top: 20px" :width="800" v-model="visibleUpdate" @ok="updateSure">
      <a-form class="permission-form" :form="formUpdate">
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="登录账号" hasFeedback
          validateStatus="success">
          <a-input placeholder="登录账号" disabled="disabled" v-decorator="['login_name']" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="用户姓名" hasFeedback
          validateStatus="success">
          <a-input placeholder="用户姓名" v-decorator="['user_name']" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="角色名称" hasFeedback
          validateStatus="success">
          <a-input placeholder="角色名称" v-decorator="['role_name']" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="账号状态" hasFeedback
          validateStatus="warning">
          <a-select v-decorator="['status', { initialValue: 1 }]">
            <a-select-option v-for="item in statusDic"
              :key="item" :value="item">
              {{ item }}
            </a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal> -->
    <!-- 新增 -->
    <!-- <a-modal title="新增" style="top: 20px" :width="800" v-model="visibleAdd" @ok="addDataSure">
      <a-form class="permission-form" :form="formAdd">
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="登录账号" hasFeedback
          validateStatus="success">
          <a-input placeholder="登录账号" v-decorator="['login_name']" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="用户密码" hasFeedback
          validateStatus="success">
          <a-input placeholder="用户密码" v-decorator="['password']" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="用户姓名" hasFeedback
          validateStatus="success">
          <a-input placeholder="用户姓名" v-decorator="['user_name']" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="角色名称" hasFeedback
          validateStatus="success">
          <a-input placeholder="角色名称" v-decorator="['role_name']" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="账号状态" hasFeedback
          validateStatus="warning">
          <a-select v-decorator="['status', { initialValue: 2 }]">
            <a-select-option v-for="item in statusDic"
              :key="item" :value="item">
              {{ item }}
            </a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal> -->
  </a-card>
</template>

<script>
import pick from 'lodash.pick'
import { STable } from '@/components'
import { getDataByInventory } from '@/api/Inventory'
import { addData } from '@/api/Task'
import { getDropDownListBy } from '@/api/global'
// 表头
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
    title: '库存数量',
    dataIndex: 'inventory_count'
  },
  {
    title: '批号',
    dataIndex: 'batch'
  },
  {
    title: '库位',
    dataIndex: 'location_code'
  },
  {
    title: '载具',
    dataIndex: 'pallet_code'
  },
  {
    title: '状态',
    dataIndex: 'status'
  },
  {
    title: '创建人',
    dataIndex: 'creator',
    sorter: true
  },
  {
    title: '创建时间',
    dataIndex: 'create_time',
    sorter: true
  }
]

export default {
  name: 'CallVehicle',
  components: {
    STable
  },
  data() {
    return {
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
      startTime: '1900-01-01',
      endTime: '3000-01-01',
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        parameter.startTime = this.startTime
        parameter.endTime = this.endTime
        return getDataByInventory(parameter, this.queryParam).then(res => {
          return res.result
        })
      },
      // 状态字典列表
      statusDic: [],
      statusDicOperationLocation: [],
      // 动态栅格
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
      selectedRowKeys: []
    }
  },
  methods: {
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },
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
      this.queryParam = { pallet_code: '', location_code: '', status: '' }
      this.formBy.setFieldsValue(pick(this.queryParam, ['pallet_code', 'location_code', 'status']))
      this.$refs.table.refresh(true)
    },
    // 新增按钮点击事件
    addData(e) {
      // this.visibleAdd = true
      addData().then(res => {
        if (res.status) {
          this.$message.success(res.message)
        } else {
          this.$message.warn(res.message)
        }
      })
    },
    // 确认新增点击事件
    addDataSure(e) {
      e.preventDefault()
      this.formAdd.validateFields((err, values) => {
        if (!err) {
          console.log(values)
          addData(values).then(res => {
            this.visibleAdd = false
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

    // 编辑按钮取值给模态框
    updateGetValue(record) {
      this.visibleUpdate = true
      this.$nextTick(() => {
        this.formUpdate.setFieldsValue(pick(record, ['login_name', 'user_name', 'role_name', 'status']))
      })
    },
    // 确定更新数据
    // updateSure(e) {
    //   this.visibleUpdate = false
    //   e.preventDefault()
    //   this.formUpdate.validateFields((err, values) => {
    //     if (!err) {
    //       updateData(values).then(res => {
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
      getDropDownListBy('operation').then(res => {
        this.statusDicOperationLocation = res.result.anything
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
