<template>

  <a-row style="padding:5% 0">
    <a-col :push="6" :span="12">
      <a-card :bordered="false">
        <a-form class="permission-form" :form="form" @submit="addData">
          <a-form-item :labelCol="labelCol" hidden :wrapperCol="wrapperCol" label="主键">
            <a-input placeholder="主键"
                     v-decorator="['ledId']" />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="显示内容">
            <a-textarea
              v-decorator="['ledText',{rules: [{ required: true, message: '请输入LED显示内容' }]}]"
              placeholder="显示内容"
              :auto-size="{ minRows: 17 }"
            />
          </a-form-item>
          <a-col :push="10" :span="6">
            <a-button size="large" class="btnStyle" html-type="submit" type="primary">提交
            </a-button>
          </a-col>
        </a-form>
      </a-card>
    </a-col>
  </a-row>

</template>

<script>
import { STable } from '@/components'
import { getLed, alterLed } from '@/api/LedAPI'

export default {
  name: 'Led',
  components: {
    STable
  },
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
      }
    }
  },
  methods: {
    getQueryLed() {
      getLed().then(res => {
        console.log(res)
        this.visibleUpdate = true
        this.$nextTick(() => {
          this.form.setFieldsValue(res.result)
        })
      })
    },
    addData(e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          alterLed(values).then(res => {
            if (res.status) {
              this.$message.success(res.message)
              this.clearData()
            } else {
              this.$message.warn(res.message)
            }
          })
        }
      })
    }
  },
  created() {
    this.getQueryLed()
  }
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
