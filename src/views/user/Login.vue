<template>
  <div class="main">
    <a-form id="formLogin" class="user-layout-login" ref="formLogin" :form="form"
      @submit="handleSubmit">
      <a-alert v-if="isLoginError" type="error" showIcon style="margin-bottom: 24px"
        :message="$t('user.login.message-invalid-credentials')" />
      <a-form-item>
        <a-input size="large" type="text" :placeholder="$t('user.login.username.placeholder')"
          v-decorator="[
            'login_name',
            {
              rules: [{ required: true, message: $t('user.userName.required') }, { validator: handleUsernameOrEmail }],
              validateTrigger: 'change'
            }
          ]">
          <a-icon slot="prefix" type="user" :style="{ color: 'rgba(0,0,0,.25)' }" />
        </a-input>
      </a-form-item>
      <a-form-item>
        <a-input-password size="large" :placeholder="$t('user.login.password.placeholder')"
          v-decorator="['password', { rules: [{ required: true, message: $t('user.password.required') }], validateTrigger: 'blur' }]">
          <a-icon slot="prefix" type="lock" :style="{ color: 'rgba(0,0,0,.25)' }" />
        </a-input-password>
      </a-form-item>
      <a-form-item>
        <a-select placeholder="请选择仓库"
          v-decorator="['storageTypeDic', { rules: [{ required: true, message: '请选择仓库！' }] }]">
          <a-select-option v-for="item in storageTypeDicList" :key="item.dic_value"
            :value="item.dic_value">
            {{ item.dic_display_value }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item style="margin-top: 24px">
        <a-button size="large" type="primary" htmlType="submit" class="login-button"
          :loading="state.loginBtn" :disabled="state.loginBtn">
          {{ $t('user.login.login') }}
        </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { timeFix } from '@/utils/util'
import { getDicBy } from '@/api/global'
import store from '../../store'
import md5 from 'md5'
export default {
  components: {},
  data() {
    return {
      customActiveKey: 'tab1',
      loginBtn: false,
      // login type: 0 email, 1 username, 2 telephone
      loginType: 1,
      isLoginError: false,
      requiredTwoStepCaptcha: false,
      stepCaptchaVisible: false,
      form: this.$form.createForm(this),
      state: {
        time: 60,
        loginBtn: false,
        // login type: 0 email, 1 username, 2 telephone
        loginType: 0,
        smsSendBtn: false
      },
      storageTypeDicList: []
    }
  },

  methods: {
    ...mapActions(['Login', 'Logout']),
    // handler
    handleUsernameOrEmail(rule, value, callback) {
      const { state } = this
      const regex = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/
      if (regex.test(value)) {
        state.loginType = 1
      }
      callback()
    },
    handleSubmit(e) {
      e.preventDefault()
      const {
        form: { validateFields },
        state,
        Login
      } = this

      state.loginBtn = true

      const validateFieldsKey = ['login_name', 'password', 'storageTypeDic']

      validateFields(validateFieldsKey, { force: true }, (err, values) => {
        if (!err) {
          const sysUser = { ...values }
          delete sysUser.username
          sysUser['login_name'] = values.login_name
          sysUser.password = md5(values.password)
          console.log(values.storageTypeDic)
          sysUser.storageTypeDic = values.storageTypeDic
          sysUser.storageTypeDicList = this.storageTypeDicList
          console.log('账号、密码、库类型列表、当前选中的库类型' + JSON.stringify(sysUser))
          console.log(sysUser)
          Login(sysUser)
            .then(res => this.loginSuccess(res))
            .catch(err => this.requestFailed(err))
            .finally(() => {
              state.loginBtn = false
            })
        } else {
          setTimeout(() => {
            state.loginBtn = false
          }, 600)
        }
      })
    },
    loginSuccess(res) {
      console.log('登录成功')
      this.$router.push({ path: '/' })
      store.dispatch('GetStoreName').then(res => {
        console.log('根据角色名取其所拥有库的权限成功')
      })

      // 延迟 1 秒显示欢迎信息
      setTimeout(() => {
        this.$notification.success({
          message: '欢迎',
          description: `${timeFix()}，欢迎回来`
        })
      }, 1000)
      this.isLoginError = false
    },
    requestFailed(err) {
      this.isLoginError = true
      // console.log(err)
      this.$notification['warn']({
        message: '警告',
        description: ((err.response || {}).data || {}).message || err.message,
        duration: 4
      })
    },
    // 取检索条件的数据字典
    getDic() {
      getDicBy({ dic_name: 'store_classify' }).then(res => {
        console.log(res)
        this.storageTypeDicList = res.result.anything
      })
    }
  },
  created() {
    this.getDic()
    console.log('当前版本：v20240716')
  }
}
</script>

<style lang="less" scoped>
.user-layout-login {
  label {
    font-size: 14px;
  }

  .getCaptcha {
    display: block;
    width: 100%;
    height: 40px;
  }

  .forge-password {
    font-size: 14px;
  }

  button.login-button {
    padding: 0 15px;
    font-size: 16px;
    height: 40px;
    width: 100%;
  }

  .user-login-other {
    text-align: left;
    margin-top: 24px;
    line-height: 22px;

    .item-icon {
      font-size: 24px;
      color: rgba(0, 0, 0, 0.2);
      margin-left: 16px;
      vertical-align: middle;
      cursor: pointer;
      transition: color 0.3s;

      &:hover {
        color: #1890ff;
      }
    }

    .register {
      float: right;
    }
  }
}
</style>
