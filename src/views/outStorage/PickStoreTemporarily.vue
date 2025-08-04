<template>

  <a-row style="padding:5% 0">
    <a-col :push="6" :span="12">
      <a-card :bordered="false">
        <a-form class="permission-form" :form="form" @submit="bindData">
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol"
            :label="storageTypeText == 'B库' ? '原料箱编号:' : '原托盘编号:'">
            <a-input :placeholder="storageTypeText == 'B库' ? '原料箱编号' : '原托盘编号'" @blur="queryData"
              v-decorator="['pallet_code', { rules: [{ required: true, validator, message: '原载具编号不能为空!' }] }]" />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="出库单：">
            <a-input placeholder="出库单" disabled
              v-decorator="['out_order_id', { rules: [{ required: true, validator, message: '出库单号不能为空!' }] }]" />
          </a-form-item>
          <!-- <a-form-item>
            <s-table bordered ref="table" size="default" :pageSize="3" :columns="columns"
              :data="loadData">
            </s-table>
          </a-form-item> -->
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="器材编号：">
            <a-input placeholder="器材编号" disabled
              v-decorator="['material_code', { rules: [{ required: true, validator, message: '器材编号不能为空!' }] }]" />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="器材名称：">
            <a-input placeholder="器材名称" disabled v-decorator="['material_name']" />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="批号">
            <a-input placeholder="批号" disabled v-decorator="['batch']" />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="配盘数量">
            <a-input placeholder="配盘数量" disabled v-decorator="['pick_qty']" />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol"
            :label="storageTypeText == 'B库' ? '目标料箱编号:' : '目标托盘编号:'">
            <a-input :placeholder="storageTypeText == 'B库' ? '目标料箱编号' : '目标托盘编号'"
              v-decorator="['pallet_code_new', { rules: [{ required: true, validator, message: '目标载具编号不能为空!' }] }]" />
          </a-form-item>
          <!-- <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="目标暂存区号：">
            <a-input placeholder="目标暂存区号："
              v-decorator="['pallet_code_new', { rules: [{ required: true, validator, message: '目标暂存区号不能为空!' }] }]" />
          </a-form-item> -->
          <a-row type="flex" justify="space-around">
            <a-col :span="6">
              <a-button size="large" class="btnStyle" html-type="submit" type="primary">拣选完成
              </a-button>
            </a-col>
            <!-- <a-col :span="6">
              <a-button size="large" class="btnStyle" @click="nextTask" type="primary">下一任务
              </a-button> -->
            <!-- </a-row></a-form></a-card></a-col> -->
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
import { getDataBy, pickPallet } from '@/api/OutPick'
const columns = [
  {
    title: '托盘编号',
    dataIndex: 'pallet_code'
  },
  {
    title: '配盘数量',
    dataIndex: 'pick_qty'
  },
  {
    title: '明细id',
    dataIndex: 'out_order_detail_id'
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
    title: '批号',
    dataIndex: 'batch'
  },
  {
    title: '库存数量',
    dataIndex: 'inventory_count'
  }
]
export default {
  name: 'PickStoreTemporarily',
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
      validator: (rule, value, cbfn) => {
        // console.log(rule, value, cbfn)
        if (!value) {
          cbfn('请输入有效值')
        } else if (!value.trim().length) {
          cbfn('请输入有效值')
        }
        cbfn()
      },
      checkedData: null,
      storageTypeText: ''
      // queryParam: { out_order_id: 9999999999 },
      // loadData: parameter => {
      //   console.log(parameter, this.queryParam)
      //   return getDataBy(parameter, this.queryParam).then(res => {
      //     console.log(res)
      //     return res.result
      //   })
      // }
    }
  },
  methods: {
    // nextTask(e) {
    //   const outOrderId = this.form.getFieldValue('pallet_code')
    //   if (outOrderId === '' || outOrderId === undefined) {
    //     this.$message.warn('请扫描托盘编号！')
    //     return
    //   }
    //   this.queryData(e)
    // },
    clearData() {
      this.queryParam = { material_code: '', material_name: '', pallet_code: '', location_code: '', out_order_id: '', pallet_code_new: '' }
      this.formBy.setFieldsValue(
        pick(this.queryParam, ['material_code', 'material_name', 'pallet_code', 'location_code', 'out_order_id', 'pallet_code_new'])
      )
    },
    bindData(e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          const palletCodeNew = values.pallet_code_new
          pickPallet(this.checkedData, palletCodeNew).then(res => {
            if (res.status) {
              this.$message.success(res.message)
            } else {
              this.$message.warn(res.message)
            }
          })
        }
      })
    },
    queryData(e) {
      e.preventDefault()
      const palletCode = this.form.getFieldValue('pallet_code')
      getDataBy({ pageSize: 1, pageNo: 1 }, { pallet_code: palletCode, status: '待执行' }).then(res => {
        if (res.status) {
          this.checkedData = res.result.anything[0]
          this.form.setFieldsValue(pick(res.result.anything[0], ['material_code', 'material_name', 'batch', 'pick_qty', 'out_order_id']))
        } else {
          this.$message.warn(res.message)
        }
      })
    }
  },
  created() {
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
