<template>
  <a-card :bordered="false">
    <!-- 检索相关 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @submit="getDataBy" :form="formBy">
        <a-row :gutter="48">
          <!-- <a-col :md="5" :sm="24">
            <a-form-item label="字典编号">
              <a-input v-decorator="['dic_id', { initialValue: '', rules: [{ required: false, message: 'Please input your note!' }] }]" />
            </a-form-item>
          </a-col> -->
          <a-col :md="5" :sm="24">
            <a-form-item label="数据类型">
              <a-select placeholder="请选择" v-decorator="['dic_type']">
                <a-select-option v-for="item in dataType" :key="item.dic_type"
                  :value="item.dic_type">
                  {{ item.dic_type }}
                </a-select-option>
              </a-select>
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

          <!-- <a-col :md="5" :sm="24">
            <a-form-item label="数据值">
              <a-input v-decorator="['dic_id', { initialValue: '', rules: [{ required: false, message: 'Please input your note!' }] }]" />
            </a-form-item>
          </a-col> -->
          <a-col :md="4" :sm="24">
            <span class="table-page-search-submitButtons">
              <a-button html-type="submit" type="primary">查询</a-button>
              <a-button style="margin-left: 8px" @click="clearSelectBy">重置</a-button>
              <a-button style="margin-left: 8px" type="primary" @click="addData">新增</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <!-- 表格 -->
    <s-table bordered ref="table" row-key="dic_id" size="default" :columns="columns"
      :data="loadData">
      <a-tag :color="text == '启用' ? 'green' : 'red'" slot="status" slot-scope="text">{{ text }}
      </a-tag>
      <span slot="createTime" slot-scope="text">{{ text | moment }}</span>
      <span slot="action" slot-scope="text, record">
        <a @click="updateGetValue(record)">编辑</a>
        <!-- <a-divider type="vertical" />
        <a href="javascript:;" @click="delData(record)">删除</a> -->
      </span>
    </s-table>
    <!-- 编辑 -->
    <a-modal title="编辑" style="top: 20px" :width="800" v-model="visibleUpdate" @ok="updateSure">
      <a-form class="permission-form" :form="formUpdate">
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="字典编号">
          <a-input placeholder="字典编号" disabled v-decorator="['dic_id']" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="数据名称">
          <a-input placeholder="数据名称" disabled v-decorator="['dic_name']" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="数据类型">
          <a-input placeholder="数据类型" disabled v-decorator="['dic_type']" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="数据显示值">
          <a-input placeholder="数据显示值"
            v-decorator="['dic_display_value', { rules: [{ required: true, validator, message: '请输入数据显示值!' }] }]" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="数据存储值">
          <a-input placeholder="数据存储值" disabled v-decorator="['dic_value']" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="字典状态">
          <a-select v-decorator="['status']">
            <a-select-option v-for="item in statusDic" :hidden="item == 0" :key="item"
              :value="item">
              {{ item }}
            </a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal>
    <!-- 新增 -->
    <a-modal title="新增" style="top: 20px" :width="800" v-model="visibleAdd" @ok="addDataSure">
      <a-form class="permission-form" :form="formAdd">
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="字典编号">
          <a-input placeholder="字典编号"
            v-decorator="['dic_id', { rules: [{ required: true, validator, message: '请输入字典编号!' }] }]" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="数据名称">
          <a-input placeholder="数据名称"
            v-decorator="['dic_name', { rules: [{ required: true, validator, message: '请输入数据名称!' }] }]" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="数据类型">
          <a-input placeholder="数据类型"
            v-decorator="['dic_type', { rules: [{ required: true, validator, message: '请输入数据类型!' }] }]" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="数据显示值">
          <a-input placeholder="数据显示值"
            v-decorator="['dic_display_value', { rules: [{ required: true, validator, message: '请输入数据显示值!' }] }]" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="数据存储值">
          <a-input placeholder="数据存储值"
            v-decorator="['dic_value', { rules: [{ required: true, validator, message: '请输入数据存储值!' }] }]" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="字典状态">
          <a-select placeholder="请选择字典状态" v-decorator="['status']">
            <a-select-option v-for="item in statusDic" :key="item" :value="item">
              {{ item }}
            </a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal>
  </a-card>
</template>

<script>
import pick from 'lodash.pick'
import { STable } from '@/components'
import { getData, getDataBy, updateData, delData, addData } from '@/api/Dictionary'
// import { getDicBy } from '@/api/global'
import storage from 'store'
// 表头
const columns = [
  {
    title: '字典编号',
    dataIndex: 'dic_id'
  },
  {
    title: '数据名称',
    dataIndex: 'dic_name'
  },
  {
    title: '数据类型',
    dataIndex: 'dic_type'
  },
  {
    title: '数据显示值',
    dataIndex: 'dic_display_value'
  },
  {
    title: '数据存储值',
    dataIndex: 'dic_value'
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
  },
  {
    title: '更新人',
    dataIndex: 'updater'
  },
  {
    title: '更新时间',
    dataIndex: 'update_time'
  },
  {
    title: '操作',
    width: '70px',
    dataIndex: 'action',
    scopedSlots: { customRender: 'action' }
  }
]

export default {
  name: 'DataDic',
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
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return getDataBy(parameter, this.queryParam).then(res => {
          console.log(res)
          return res.result
        })
      },
      // 状态字典列表
      statusDic: [1, 2],

      // 动态栅格
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
      validator: (rule, value, cbfn) => {
        if (!value) {
          cbfn('请输入有效值')
        } else if (!value.trim().length) {
          cbfn('请输入有效值')
        }
        cbfn()
      },
      // 数据类型表
      dataType: [],
      userInfo: {}
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
      this.queryParam = { dic_type: '', status: '' }
      this.formBy.setFieldsValue(pick(this.queryParam, ['dic_type', 'status']))
      this.$refs.table.refresh(true)
    },
    // 新增按钮点击事件
    addData(e) {
      this.visibleAdd = true
    },
    // 确认新增点击事件
    addDataSure(e) {
      e.preventDefault()
      this.formAdd.validateFields((err, values) => {
        if (!err) {
          console.log(values)
          values.creator = this.userInfo.user_name
          addData(values).then(res => {
            if (res.status) {
              this.$refs.table.refresh(true)
              this.$message.success(res.message)
            } else {
              this.$message.warn(res.message)
            }
            console.log(res)
            this.visibleAdd = false
          })
        }
      })
    },

    // 编辑按钮取值给模态框
    updateGetValue(record) {
      this.visibleUpdate = true
      this.$nextTick(() => {
        this.formUpdate.setFieldsValue(pick(record, ['dic_id', 'dic_name', 'dic_type', 'dic_display_value', 'dic_value', 'status']))
      })
    },
    // 确定更新数据
    updateSure(e) {
      this.visibleUpdate = false
      e.preventDefault()
      this.formUpdate.validateFields((err, values) => {
        if (!err) {
          values.updater = this.userInfo.user_name
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
    delData(record) {
      const _this = this
      const modal = this.$confirm({
        content: '确定删除此用户吗？',
        okText: '删除',
        cancelText: '取消',
        onOk() {
          delData({ login_name: record.login_name }).then(res => {
            _this.$refs.table.refresh(true)
          })
        },
        onCancel() {
          modal.destroy()
        }
      })
    },
    // 取检索条件的数据字典
    // getDic () {
    //   getDicBy({ dic_name: 'sys_dictionary' })
    //     .then(res => {
    //       console.log(res)
    //       this.statusDic = res.result.anything
    //     })
    // },
    // 取检索条件的数据类型
    getData() {
      getData({ pageNo: 1, pageSize: 1000 }).then(res => {
        // console.log(res)
        this.dataType = res.result.anything
      })
    }
  },
  created() {
    // this.getDic()
    this.getData()
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
</style>
