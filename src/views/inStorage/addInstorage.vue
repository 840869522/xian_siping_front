<template>

  <a-row style="padding:5% 0">
    <a-col :push="6" :span="12">
      <a-card :bordered="false">
        <a-form class="permission-form" :form="form" @submit="taskDown">
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol"
            :label="storageTypeText == 'B库' ? '目标料箱编号:' : '目标托盘编号:'">
            <a-input :placeholder="storageTypeText == 'B库' ? '目标料箱编号' : '目标托盘编号'"
              v-decorator="['pallet_code']" @change="getMaterial1" />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol"
            :label="storageTypeText == 'B库' ? '目标料箱器材编号:' : '目标托盘器材编号:'">
            <a-input :placeholder="storageTypeText == 'B库' ? '目标料箱器材编号' : '目标托盘器材编号'" disabled
              v-decorator="['material_code']" @change="clearData" />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol"
            :label="storageTypeText == 'B库' ? '目标料箱物料批号:' : '目标托盘物料批号:'">
            <a-input :placeholder="storageTypeText == 'B库' ? '目标料箱物料批号' : '目标托盘物料批号'" disabled
              v-decorator="['batch']" />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol"
            :label="storageTypeText == 'B库' ? '原料箱编号:' : '原托盘编号:'">
            <a-input :placeholder="storageTypeText == 'B库' ? '原料箱编号' : '原托盘编号'"
              v-decorator="['pallet_code2']" @change="getMaterial2" />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol"
            :label="storageTypeText == 'B库' ? '原料箱器材编号:' : '原托盘器材编号:'">
            <a-input :placeholder="storageTypeText == 'B库' ? '原料箱器材编号' : '原托盘器材编号'" disabled
              v-decorator="['material_code2']" @change="clearData" />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol"
            :label="storageTypeText == 'B库' ? '原料箱物料批号:' : '原托盘物料批号:'">
            <a-input :placeholder="storageTypeText == 'B库' ? '原料箱物料批号' : '原托盘物料批号'" disabled
              v-decorator="['batch2']" />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="添加数量">
            <a-input placeholder="添加数量" v-decorator="['inventory_count']" />
          </a-form-item>
          <a-row>
            <a-col :push="2" :span="6">
              <a-button size="large" class="btnStyle" html-type="submit" type="primary">更新库存
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
import { getDataByInventory, dataBind } from '@/api/Inventory'
// import { getDropDownListBy } from '@/api/global'
import storage from 'store'
export default {
  name: 'AddInstorage',
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
      queryParam: { pageNo: 1, pageSize: 1, startTime: '1900-01-01', endTime: '3000-01-01' },
      statusDic1: [],
      statusDic2: [],
      storageTypeText: ''
    }
  },
  methods: {
    getMaterial1() {
      const taskInfo = {}
      taskInfo.pallet_code = this.form.getFieldValue('pallet_code')
      getDataByInventory(this.queryParam, taskInfo).then(res => {
        if (res.status) {
          console.log()
          this.$nextTick(() => {
            this.form.setFieldsValue(pick(res.result.anything[0], ['material_code', 'batch']))
          })
        } else {
          this.$message.warn(res.message)
        }
      })
    },
    getMaterial2() {
      const taskInfo = {}
      taskInfo.pallet_code = this.form.getFieldValue('pallet_code2')
      getDataByInventory(this.queryParam, taskInfo).then(res => {
        if (res.status) {
          res.result.anything[0].material_code2 = res.result.anything[0].material_code
          res.result.anything[0].batch2 = res.result.anything[0].batch
          this.$nextTick(() => {
            this.form.setFieldsValue(pick(res.result.anything[0], ['material_code2', 'batch2']))
          })
        } else {
          this.$message.warn(res.message)
        }
      })
    },
    taskDown(e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          values.creator = this.userInfo.user_name
          dataBind(values, values.location_code, values.location_code2).then(res => {
            if (res.status) {
              console.log(res)
              this.$message.success(res.message)
            } else {
              this.$message.warn(res.message)
            }
          })
        }
      })
    },
    clearData() {
      const temp = { material_code: '', material_name: '', org_position: '', target_position: '' }
      this.form.setFieldsValue(pick(temp, ['material_code', 'material_name', 'org_position', 'target_position']))
    }
  },
  created() {
    this.userInfo = storage.get('userInfo')
    this.storageTypeText = JSON.parse(localStorage.getItem('storageTypeText'))
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
