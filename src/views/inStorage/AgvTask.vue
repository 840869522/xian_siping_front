<template>

  <a-row style="padding:5% 0">
    <a-col :push="6" :span="12">
      <a-card :bordered="false">
        <a-form class="permission-form" :form="form" @submit="bindData">
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="托盘号：">
            <a-input placeholder="托盘号" v-decorator="['pallet_code']" />
          </a-form-item>
          <!-- <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="物料编码：">
            <a-input placeholder="物料编码" @keydown.enter="queryData"
              v-decorator="['material_code']" />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="物料名称：">
            <a-input placeholder="物料名称" disabled v-decorator="['material_name']" />
          </a-form-item> -->
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="起点：">
            <a-select placeholder="请选择" v-decorator="['org_position']">
              <a-select-option v-for="item in statusDic" :key="item" :value="item">
                {{ item }}
              </a-select-option>
            </a-select>
          </a-form-item>
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="终点：">
            <a-select placeholder="请选择" v-decorator="['target_position']">
              <a-select-option v-for="item in statusDic" :key="item" :value="item">
                {{ item }}
              </a-select-option>
            </a-select>
          </a-form-item>

          <a-row>
            <a-col :push="2" :span="6">
              <a-button size="large" class="btnStyle" html-type="submit" type="primary">任务下发
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
import { STable } from '@/components'
// import { getMaterialBy } from '@/api/BaseMaterial'
import { addData } from '@/api/AgvTask'
import { getDropDownListBy } from '@/api/global'
import storage from 'store'
export default {
  name: 'AgvTask',
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
      },
      statusDic: []
    }
  },
  methods: {
    clearData() {
      const temp = { material_code: '', material_name: '', pallet_code: '', location_code: '', status: '' }
      this.form.setFieldsValue(pick(temp, ['material_code', 'material_name', 'pallet_code', 'org_position', 'target_position']))
    },
    bindData(e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        values.creator = this.userInfo.user_name
        console.log(values)
        if (!err) {
          addData(values).then(res => {
            if (res.status) {
              this.$message.success(res.message)
            } else {
              this.$message.warn(res.message)
            }
          })
        }
      })
    },
    // queryData(e) {
    //   e.preventDefault()
    //   this.form.validateFields((err, values) => {
    //     if (!err) {
    //       console.log(values)
    //       getMaterialBy({ pageNo: 1, pageSize: 1, startTime: '1900-01-01', endTime: '3000-01-01' }, values).then(res => {
    //         if (res.status) {
    //           this.$nextTick(() => {
    //             this.form.setFieldsValue(pick(res.result.anything[0], ['material_name']))
    //           })
    //         } else {
    //           this.$message.warn(res.message)
    //         }
    //       })
    //     }
    //   })
    // },
    // 取检索条件的数据字典
    getDic() {
      getDropDownListBy('operation').then(res => {
        console.log(res)
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
