<template>

  <a-row style="padding:5% 0">
    <a-col :push="6" :span="12">
      <a-card :bordered="false">
        <a-form class="permission-form" :form="form">
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="登录账号">
            <a-input placeholder="登录账号" disabled
              v-decorator="['login_name', { rules: [{ required: true}] }]" />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="角色名称">
            <a-input placeholder="角色名称" disabled
              v-decorator="['role_name', { rules: [{ required: true}] }]" />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="旧密码">
            <a-input placeholder="旧密码输入完成请点击其他区域！" @blur="testOldPsw" type="password"
              :disabled="oldPwdTrue" ref="oldPassword"
              v-decorator="['old_password', { rules: [{ required: true,message: '密码不能为空！'}] }]" />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="新密码">
            <a-input placeholder="新密码" :disabled="!oldPwdTrue" type="password"
              v-decorator="['new_password', { rules: [{ required: true,message: '密码不能为空！'}] }]" />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="确认密码">
            <a-input placeholder="确认密码" :disabled="!oldPwdTrue" @blur="testNewPassword"
              type="password"
              v-decorator="['sure_new_password', { rules: [{ required: true,message: '两次输入密码不一致！'}] }]" />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="用户姓名">
            <a-input placeholder="用户姓名" @blur="queryData" :disabled="!oldPwdTrue"
              v-decorator="['user_name', { rules: [{ required: true,message: '用户姓名不能为空！'}] }]" />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="状态">
            <a-select placeholder="请选择" v-decorator="['status']" :disabled="!oldPwdTrue">
              <a-select-option v-for="item in statusDic" :key="item.dic_value"
                :value="item.dic_value">
                {{ item.dic_display_value }}
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="备注">
            <a-input placeholder="备注" v-decorator="['remark']" :disabled="!oldPwdTrue" />
          </a-form-item>
          <a-row>
            <a-col :push="2" :span="6">
              <a-button size="large" class="btnStyle" @click="updateSurePsw" type="primary">确认修改
              </a-button>
            </a-col>
            <a-col :span="8"></a-col>
            <a-col :span="6">
              <a-button size="large" class="btnStyle" type="default" @click="clearData">取消
              </a-button>
            </a-col>
          </a-row>
        </a-form>
      </a-card>
    </a-col>
  </a-row>

</template>

<script>
import pick from 'lodash.pick'
import { getDataBy, updateData } from '@/api/user'
import storage from 'store'
import { getDicBy } from '@/api/global'
import md5 from 'md5'
export default {
  name: 'InfoSetting',
  data() {
    return {
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
      userInfo: '',
      statusDic: null,
      oldPwdTrue: false,
      oldPassword: ''
    }
  },
  methods: {
    testOldPsw() {
      const oldPassword = this.form.getFieldValue('old_password')
      console.log(oldPassword)
      if (oldPassword === undefined) {
        return
      }
      const oldPasswordMd5 = md5(oldPassword)
      console.log(oldPassword, oldPasswordMd5, this.oldPassword)
      if (this.oldPassword === oldPasswordMd5) {
        this.oldPwdTrue = true
      } else {
        this.form.setFields({
          old_password: { value: '', errors: [{ message: '旧密码不正确！', field: 'old_password' }] }
        })
      }
    },
    testNewPassword() {
      const newPassword = this.form.getFieldValue('new_password')
      const sureNewPassword = this.form.getFieldValue('sure_new_password')
      if (newPassword !== sureNewPassword) {
        this.form.setFields({
          sure_new_password: { value: '', errors: [{ message: '两次密码输入不一致！', field: 'sure_new_password' }] }
        })
      }
    },
    getOldPassword() {
      const loginName = this.form.getFieldValue('login_name')
      getDataBy({ pageNo: 1, pageSize: 1 }, { login_name: loginName }).then(res => {
        this.oldPassword = res.result.anything[0].password
      })
    },
    clearData() {},
    // 确认更新密码
    updateSurePsw(e) {
      // sure_new_password
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          values.updater = this.userInfo.user_name
          values.password = md5(values.sure_new_password)
          updateData(values).then(res => {
            if (res.status) {
              this.$message.success(res.message)
            } else {
              this.$message.warn(res.message)
            }
          })
        }
      })
    },
    getDic() {
      getDicBy({ dic_name: 'sys_users' }).then(res => {
        this.statusDic = res.result.anything
      })
    }
  },
  created() {},
  mounted() {
    // 取出当前登录库型用于判断该物料是否属于该库
    this.userInfo = storage.get('userInfo')
    this.form.setFieldsValue(pick(this.userInfo, ['login_name']))
    this.form.setFieldsValue(pick(this.userInfo, ['role_name']))
    this.form.setFieldsValue(pick(this.userInfo, ['user_name']))
    this.form.setFieldsValue(pick(this.userInfo, ['status']))
    this.getDic()
    this.getOldPassword()
    this.$refs.oldPassword.focus()
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
