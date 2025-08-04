<template>
  <a-card :bordered="false">
    <!-- 检索相关 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" :form="form">
        <a-row :gutter="48">
          <a-col :md="4" :sm="24">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="料箱编号：">
              <a-input placeholder="料箱编号" v-decorator="['pallet_code']" />
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="24">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="起点：">
              <a-input placeholder="起点" v-decorator="['org_position']" />
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="24">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="终点：">
              <a-input placeholder="终点" v-decorator="['target_position']" />
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="24">
            <span class="table-page-search-submitButtons">
              <a-button @click="taskDown" type="primary">生成任务
              </a-button>
              <a-button style="margin-left: 8px" type="default" @click="clearData">取消
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
// import { getMaterialBy } from '@/api/BaseMaterial'
import { GetCTUByPage, AddCtuTask } from '@/api/CtuTask'
import { getDropDownListBy } from '@/api/global'
import storage from 'store'
const columns = [
  {
    title: '任务号',
    dataIndex: 'task_no'
  },
  {
    title: '任务类型',
    dataIndex: 'task_type'
  },
  {
    title: '料箱编号',
    dataIndex: 'pallet_code'
  },
  {
    title: '起点',
    dataIndex: 'org_position'
  },
  {
    title: '终点',
    dataIndex: 'target_position'
  },
  {
    title: '状态',
    dataIndex: 'status'
  },
  {
    title: '创建时间',
    dataIndex: 'create_time'
  },
  {
    title: '更新时间',
    dataIndex: 'update_time'
  }
]
export default {
  name: 'CtuTask',
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
      statusDic: [],
      loadData: parameter => {
        // parameter.startTime = this.startTime
        // parameter.endTime = this.endTime
        return GetCTUByPage(parameter, {}).then(res => {
          console.log(res)
          return res.result
        })
      }
    }
  },
  methods: {
    clearData() {
      const temp = { material_code: '', material_name: '', pallet_code: '', location_code: '', status: '' }
      this.form.setFieldsValue(pick(temp, ['material_code', 'material_name', 'pallet_code', 'org_position', 'target_position']))
    },
    taskDown(e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        values.creator = this.userInfo.user_name
        values.type = this.taskType
        values.prio = 5
        values.source = values.org_position
        values.target = values.target_position
        console.log(values)
        if (!err) {
          AddCtuTask(values, values.pallet_code).then(res => {
            if (res.status) {
              this.$message.success(res.message)
            } else {
              this.$message.warn(res.message)
            }
          })
        }
      })
    },
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
