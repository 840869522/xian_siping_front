<template>
  <a-card :bordered="false">
    <!-- 检索相关 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" :form="form">
        <a-row :gutter="48">
          <a-col :md="5" :sm="24">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="任务类型">
              <a-radio-group v-model="isYiku" @change="yikuMethod">
                <a-radio value="入库">入库</a-radio>
                <a-radio value="移库">移库</a-radio>
                <a-radio value="满入">满入</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="24">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="托盘编号：">
              <a-input placeholder="扫描托盘编号"
                v-decorator="['pallet_code', { rules: [{ required: false,message: '托盘编号填写'}] }]"
                @blur="queryData" />
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="24">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="目标库位号">
              <a-input placeholder="目标库位号" v-decorator="['location_code']" />
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="24">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="操作口:"
              :hidden="isYiku!=='入库'">
              <a-select v-decorator="['prot_no',{initialValue:'A01'}]">
                <a-select-option :key="'A01'" :value="'A01'">
                  操作口1
                </a-select-option>
                <a-select-option :key="'A02'" :value="'A02'">
                  操作口2
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="24">
            <span class="table-page-search-submitButtons">
              <a-button @click="taskDown" type="primary">生成任务
              </a-button>
              <a-button style="margin-left: 8px" type="default" @click="clearData">取消
              </a-button>
              <a-button style="margin-left: 8px" type="default" @click="refresh">刷新
              </a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <!-- 表格 -->
    <s-table bordered row-key="material" ref="table" :pageSize="20" size="default"
      :columns="columns" :data="loadData">
    </s-table>
  </a-card>

</template>

<script>
import pick from 'lodash.pick'
import { STable } from '@/components'
import { GetLocationmap } from '@/api/InvenMaterialLocationmap'
// import { getDataBy } from '@/api/LocationMap'
import { TaskDInsert, GetTaskDByPage } from '@/api/TaskX'
import { getDropDownListBy } from '@/api/global'
import storage from 'store'
const columns = [
  {
    title: '任务号',
    dataIndex: 'task_no'
  },
  {
    title: '货位号',
    dataIndex: 'location_code'
  },
  {
    title: '任务类型',
    dataIndex: 'task_type'
  },
  {
    title: '载具编号',
    dataIndex: 'pallet_code'
  },
  {
    title: '状态',
    dataIndex: 'status'
  }
]
export default {
  name: 'DInstorage',
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
      // startTime: '1900-01-01',
      // endTime: '3000-01-01',
      // queryParam: { pallet_code: 9999999999 },
      loadData: parameter => {
        // parameter.startTime = this.startTime
        // parameter.endTime = this.endTime
        return GetTaskDByPage(parameter, {}).then(res => {
          console.log(res)
          return res.result
        })
      },
      statusDic: [],
      // clickCurrent: {},
      isYiku: '入库'
    }
  },
  methods: {
    refresh() {
      this.$refs.table.refresh()
    },
    yikuMethod(e) {
      this.isYiku = e.target.value
    },
    // customRow(record, index) {
    //   return {
    //     on: {
    //       // 鼠标单击行
    //       click: event => {
    //         this.$refs.table.refresh(true)
    //         // 点击入库单给其行设置高亮颜色
    //         event.currentTarget.parentNode.querySelectorAll('tr').forEach(item => {
    //           item.style.background = 'white'
    //         })
    //         // this.clickCurrent = record
    //         // this.form.setFieldsValue(pick(record, ['pallet_code', 'location_code']))
    //         // this.form.setFieldsValue(pick({ location_code: record.location_code }, ['location_code']))
    //         event.currentTarget.style.background = '#e6f7ff'
    //       }
    //     }
    //   }
    // },

    queryData(e) {
      const palletCode = this.form.getFieldValue('pallet_code')
      if (palletCode === '' || palletCode === null || palletCode === undefined) {
        this.$message.warn('托盘编号为空')
        return
      }
      GetLocationmap({ pallet_code: palletCode }).then(res => {
        console.log(res)
        if (res.status) {
          this.$nextTick(() => {
            this.form.setFieldsValue(pick(res.result, ['location_code']))
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
          const storageTypeText = JSON.parse(localStorage.getItem('storageTypeText'))
          const validatePalletCode = this.validate.validatePalletCode(storageTypeText, values.pallet_code)
          if (!validatePalletCode.status) {
            this.form.setFields({
              pallet_code: { value: '', errors: [validatePalletCode] }
            })
            return
          }
          values.status = '待执行'
          values.task_type = this.isYiku
          values.creator = this.userInfo.user_name
          console.log(values)
          TaskDInsert(values).then(res => {
            if (res.status) {
              this.$message.success(res.message)
            } else {
              this.$message.warn(res.message)
            }
          })
        }
      })
    },
    clearData() {
      const temp = { material_code: '', material_name: '', batch: '', pallet_code: '', inventory_count: '' }
      this.form.setFieldsValue(pick(temp, ['material_code', 'material_name', 'batch', 'inventory_count', 'pallet_code']))
    },
    bindData() {},
    getDic() {
      getDropDownListBy('baseStatus').then(res => {
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
