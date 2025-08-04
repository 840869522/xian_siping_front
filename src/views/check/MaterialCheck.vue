<template>
  <a-card :bordered="false">
    <!-- 检索相关 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @submit="getDataBy" :form="formBy">
        <a-row :gutter="48">
          <a-col :md="4" :sm="24">
            <a-form-item label="盘点单：">
              <a-input
                v-decorator="['login_name', { initialValue: '', rules: [{ required: false }] }]" />
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="24">
            <a-form-item label="器材编号：">
              <a-input
                v-decorator="['login_name', { initialValue: '', rules: [{ required: false }] }]" />
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="24">
            <a-form-item label="器材名称：">
              <a-input
                v-decorator="['login_name', { initialValue: '', rules: [{ required: false }] }]" />
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="24">
            <span class="table-page-search-submitButtons">
              <a-button html-type="submit" type="primary">查询</a-button>
              <a-button style="margin-left: 8px" @click="clearSelectBy">重置</a-button>
              <a-button style="margin-left: 8px" type="primary" @click="addData">生成盘点单</a-button>
            </span>
          </a-col>
          <a-col :md="4" :sm="24">
            <a-form-item label="数量：">
              <a-input
                v-decorator="['login_name', { initialValue: '', rules: [{ required: false }] }]" />
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="24">
            <span class="table-page-search-submitButtons">
              <a-button html-type="submit" type="primary">盘点数量</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <!-- 表格 -->
    <s-table row-key="login_name" bordered ref="table" size="default" :columns="columns"
      :data="loadData">
    </s-table>
  </a-card>
</template>

<script>
import pick from 'lodash.pick'
import { STable } from '@/components'
import { getDataBy, updateData, delData, addData } from '@/api/user'
import { getDicBy, getRoleBy } from '@/api/global'
import storage from 'store'
import md5 from 'md5'
// 表头
const columns = [
  {
    title: '器材编号',
    dataIndex: 'login_name'
  },
  {
    title: '器材名称',
    dataIndex: 'user_name'
  },

  {
    title: '创建人',
    dataIndex: 'creator'
  },
  {
    title: '创建时间',
    dataIndex: 'create_time'
  }
  // {
  //   title: '更新人',
  //   dataIndex: 'updater'
  // },
  // {
  //   title: '更新时间',
  //   dataIndex: 'update_time',
  //   sorter: true
  // },
  // {
  //   title: '操作',
  //   width: '150px',
  //   dataIndex: 'action',
  //   scopedSlots: { customRender: 'action' }
  // }
]

export default {
  name: 'MaterialCheck',
  components: {
    STable
  },
  data() {
    return {
      // 添加模态框是否显示
      visibleAdd: false,
      // 更新模态框是否显示
      visibleUpdate: false,
      visibleUpdatePsw: false,
      // 编辑form
      formUpdate: this.$form.createForm(this),
      formUpdatePsw: this.$form.createForm(this),

      // 条件查询form
      formBy: this.$form.createForm(this),
      // 新增form
      formAdd: this.$form.createForm(this),
      // 查询参数
      queryParam: {},
      // 修改密码时的旧密码
      old_password: '',
      // 旧密码输入框的校验状态
      testStatus: '',
      // 校验两次输入新密码是否一致
      testNew: '',
      // 表头
      columns,
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return getDataBy(parameter, this.queryParam).then(res => {
          console.log(res.result)
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
      },
      userInfo: {},
      // 从数据库取得角色列表
      roleList: [],
      // input校验规则
      validator: (rule, value, cbfn) => {
        // console.log(rule, value, cbfn)
        if (!value) {
          cbfn('请输入有效值')
        } else if (!value.trim().length) {
          cbfn('请输入有效值')
        }
        cbfn()
      }
    }
  },
  methods: {
    // 增加用户角色选择了超级管理员就不能选择其他的.并且一个用户再同一个库不能有多种角色(这个判断还没写)
    controlOption(value) {
      if (value.find(item => item === '超级管理员')) {
        this.$nextTick(() => {
          this.formAdd.setFieldsValue(pick({ role_name: '超级管理员' }, ['role_name']))
        })
        this.$message.warn('超级管理员是最高权限，请勿再选择其他角色！')
      }
    },
    // 条件查询按钮点击事件
    getDataBy(e) {
      e.preventDefault()
      this.formBy.validateFields((err, values) => {
        if (!err) {
          this.queryParam = values
          console.log(this.queryParam)
          this.$refs.table.refresh(true)
        }
      })
    },
    // 重置检索条件
    clearSelectBy() {
      this.queryParam = { login_name: '', status: '' }
      this.formBy.setFieldsValue(pick(this.queryParam, ['login_name', 'status']))
      this.$refs.table.refresh(true)
    },
    // 新增按钮点击事件
    addData(e) {
      console.log(e)
      this.visibleAdd = true
    },
    // 确认新增点击事件
    addDataSure(e) {
      e.preventDefault()
      this.formAdd.validateFields((err, values) => {
        console.log(values)
        if (!err) {
          let roleNameStr = ''
          if (values.role_name.length === 1) {
            roleNameStr = values.role_name.join('')
          } else {
            roleNameStr = values.role_name.join(',')
          }
          values.role_name = roleNameStr
          values.creator = this.userInfo.user_name
          values.password = md5(values.password)
          console.log(values)
          addData(values).then(res => {
            console.log('添加用户接口调用成功')
            console.log(res)
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
      if (!Array.isArray(record.role_name)) {
        record.role_name = record.role_name.split(',')
      }
      this.$nextTick(() => {
        this.formUpdate.setFieldsValue(pick(record, ['login_name', 'user_name', 'role_name', 'status']))
      })
    },
    // 确定更新数据
    updateSure(e) {
      this.visibleUpdate = false
      e.preventDefault()
      this.formUpdate.validateFields((err, values) => {
        if (!err) {
          let roleNameStr = ''
          if (values.role_name.length === 1) {
            roleNameStr = values.role_name.join('')
          } else {
            roleNameStr = values.role_name.join(',')
          }
          values.role_name = roleNameStr
          values.updater = this.userInfo.user_name
          updateData(values).then(res => {
            if (res.status) {
              this.$refs.table.refresh(true)
              this.$message.success(res.message)
            } else {
              this.$message.warn(res.message)
            }
            console.log(res)
          })
        } else {
          this.$message.warn('更新失败，您输入了无效值！')
        }
      })
    },
    // 修改密码弹出框显示
    updatePsw(record) {
      this.visibleUpdatePsw = true
      console.log(record)
      this.$nextTick(() => {
        this.formUpdatePsw.setFieldsValue(pick(record, ['login_name']))
      })
      this.old_password = record.password
    },
    // 修改密码时确认旧密码是否正确
    test_old_password() {
      const inputOldPassword = md5(this.formUpdatePsw.getFieldValue('old_password'))
      if (inputOldPassword !== this.old_password) {
        this.testStatus = 'error'
      } else {
        this.testStatus = ''
      }
    },
    // 确认更新密码
    updateSurePsw(e) {
      // sure_new_password
      e.preventDefault()
      this.formUpdatePsw.validateFields((err, values) => {
        if (!err) {
          if (values.sure_new_password !== values.new_password) {
            this.testNew = 'error'
            return
          } else {
            this.testNew = ''
          }
          values.updater = this.userInfo.user_name
          values.password = md5(values.sure_new_password)
          console.log(values)
          updateData(values).then(res => {
            if (res.status) {
              this.$refs.table.refresh(true)
              this.$message.success(res.message)
              this.visibleUpdatePsw = false
            } else {
              this.$message.warn(res.message)
            }
            console.log(res)
          })
        } else {
          this.$message.warn('更新失败，您输入了无效值！')
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
    getDic() {
      getDicBy({ dic_name: 'sys_users' }).then(res => {
        console.log(res)
        this.statusDic = res.result.anything
      })
    },
    // 取角色名称列表
    getRoleBy() {
      getRoleBy().then(res => {
        console.log(res)
        this.roleList = res.result.anything
      })
    }
  },
  created() {
    this.getDic()
    this.getRoleBy()
    this.userInfo = storage.get('userInfo')
    console.log(this.userInfo)
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
