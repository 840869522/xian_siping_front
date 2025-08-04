<template>
  <a-card :bordered="false">
    <!-- 检索相关 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" :form="form">
        <a-row :gutter="48">
          <a-col :md="5" :sm="24">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="库位类型">
              <a-radio-group v-model="storageType" @change="storageChange">
                <a-radio value="1">托盘搬运</a-radio>
                <a-radio value="2">木箱搬运</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="24">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="任务类型">
              <a-radio-group v-model="taskType" @change="taskChange">
                <a-radio value="1">入库</a-radio>
                <a-radio value="2">出库</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="24">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="托盘编号：">
              <a-input placeholder="托盘编号" :disabled="storageType == '2'"
                v-decorator="['pallet_code']" />
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="24">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="起点：">
              <!-- <a-input placeholder="起点" v-decorator="['org_position']" /> -->
              <a-select placeholder="起点" v-decorator="['org_position']"
                :disabled="storageType=='2'&&taskType=='2'">
                <a-select-option v-for="item in selectPointStart" :key="item.value"
                  :value="item.value">
                  {{ item.text }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="24">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="终点">
              <!-- <a-input placeholder="终点：" v-decorator="['target_position']" /> -->
              <a-select placeholder="终点：" v-decorator="['target_position']"
                :disabled="storageType=='2'&&taskType=='2'">
                <a-select-option v-for="item in selectPointEnd" :key="item.value"
                  :value="item.value">
                  {{ item.text }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="24">
            <span class="table-page-search-submitButtons">
              <a-button @click="taskDown" type="primary"
                :disabled="storageType == '2' && taskType == '2'">生成任务
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
import { AddAgvTask, GetAGVByPage } from '@/api/AgvTask'
import { getDropDownListBy } from '@/api/global'
import storage from 'store'
const columns = [
  {
    title: '任务编号',
    dataIndex: 'task_no'
  },
  {
    title: '托盘编号',
    dataIndex: 'pallet_code'
  },
  {
    title: '任务类型',
    dataIndex: 'task_type'
  },
  {
    title: '起点位置',
    dataIndex: 'org_position'
  },
  {
    title: '终点位置',
    dataIndex: 'target_position'
  },
  {
    title: '区域类型',
    dataIndex: 'udf01'
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
  }
]
export default {
  name: 'AgvTask',
  components: {
    STable
  },
  data() {
    return {
      // 入库暂存区
      selectPoint1: [
        { value: 'ZR010501', text: 'ZR010501' },
        { value: 'ZR020501', text: 'ZR020501' },
        { value: 'ZR010401', text: 'ZR010401' },
        { value: 'ZR020401', text: 'ZR020401' },
        { value: 'ZR010301', text: 'ZR010301' },
        { value: 'ZR020301', text: 'ZR020301' },
        { value: 'ZR010201', text: 'ZR010201' },
        { value: 'ZR020201', text: 'ZR020201' },
        { value: 'ZR010101', text: 'ZR010101' },
        { value: 'ZR020101', text: 'ZR020101' }
      ],
      // 出库暂存区
      selectPoint2: [
        { value: 'ZC010501', text: 'ZC010501' },
        { value: 'ZC020501', text: 'ZC020501' },
        { value: 'ZC010401', text: 'ZC010401' },
        { value: 'ZC020401', text: 'ZC020401' },
        { value: 'ZC010301', text: 'ZC010301' },
        { value: 'ZC020301', text: 'ZC020301' },
        { value: 'ZC010201', text: 'ZC010201' },
        { value: 'ZC020201', text: 'ZC020201' },
        { value: 'ZC010101', text: 'ZC010101' },
        { value: 'ZC020101', text: 'ZC020101' }
      ],
      // 木箱暂存区
      selectPoint3: [
        { value: 'ZZ010401', text: 'ZZ010401' },
        { value: 'ZZ010301', text: 'ZZ010301' },
        { value: 'ZZ010201', text: 'ZZ010201' },
        { value: 'ZZ010101', text: 'ZZ010101' }
      ],
      // 拣选口agv位置
      selectPoint4: [
        { value: 'ZD010101', text: 'ZD010101' },
        { value: 'ZD020101', text: 'ZD020101' },
        { value: 'ZD030101', text: 'ZD030101' }
      ],
      // 托盘线出库口
      selectPoint5: [
        { value: '1041', text: '出口1' },
        { value: '1026', text: '出口2' },
        { value: '1009', text: '出口3' }
      ],
      // 托盘线出入库口
      selectPoint6: [
        { value: '1076', text: '空托盘收集口' },
        { value: '1033', text: '出入库口1' },
        { value: '1023', text: '出入库口2' },
        { value: '1011', text: '出入库口3' }
      ],
      selectPoint7: [{ value: '1501', text: '入库码垛口' }],
      selectPointStart: [],
      selectPointEnd: [],
      taskType: '1',
      storageType: '1',
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
        return GetAGVByPage(parameter, {}).then(res => {
          console.log(res)
          return res.result
        })
      }
    }
  },
  methods: {
    selectPointStartMethods() {
      if ((this.taskType === '1') & (this.storageType === '1')) {
        this.selectPointStart = this.selectPoint1
      } else if ((this.storageType === '1') & (this.taskType === '2')) {
        this.selectPointStart = [...this.selectPoint4, ...this.selectPoint5, ...this.selectPoint6]
      } else if ((this.storageType === '2') & (this.taskType === '1')) {
        this.selectPointStart = this.selectPoint3
      } else if ((this.storageType === '2') & (this.taskType === '2')) {
        this.selectPointStart = this.selectPoint7
      }
    },
    selectPointEndMethods() {
      if ((this.storageType === '1') & (this.taskType === '1')) {
        this.selectPointEnd = [...this.selectPoint4, ...this.selectPoint6]
      } else if ((this.storageType === '1') & (this.taskType === '2')) {
        this.selectPointEnd = this.selectPoint2
      } else if ((this.storageType === '2') & (this.taskType === '1')) {
        this.selectPointEnd = this.selectPoint7
      } else if ((this.storageType === '2') & (this.taskType === '2')) {
        this.selectPointEnd = this.selectPoint3
      }
    },
    storageChange(e) {
      this.storageType = e.target.value
      console.log(this.storageType)
      if (this.storageType === '2') {
        this.$nextTick(() => {
          this.form.setFieldsValue(pick({ pallet_code: '木箱' }, ['pallet_code']))
        })
      } else {
        this.$nextTick(() => {
          this.form.setFieldsValue(pick({ pallet_code: '' }, ['pallet_code']))
        })
      }
      this.selectPointStartMethods()
      this.selectPointEndMethods()
    },
    taskChange(e) {
      this.taskType = e.target.value
      console.log(this.taskChange)
      this.selectPointStartMethods()
      this.selectPointEndMethods()
    },
    clearData() {
      const temp = { material_code: '', material_name: '', pallet_code: '', location_code: '', status: '' }
      this.form.setFieldsValue(pick(temp, ['material_code', 'material_name', 'pallet_code', 'org_position', 'target_position']))
    },
    taskDown(e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          const storageTypeText = JSON.parse(localStorage.getItem('storageTypeText'))
          if (storageTypeText === 'B库' || storageTypeText === 'C库') {
            if (values.pallet_code.length !== 8) {
              this.$message.warn('该载具编号长度不正确')
              return
            }
            if (values.pallet_code.charAt(0) !== 'B') {
              this.$message.warn('该载具不属于此库')
              return
            }
          } else if (storageTypeText === 'X库' || storageTypeText === 'D库' || storageTypeText === 'P库') {
            if (values.pallet_code.length !== 7) {
              this.$message.warn('该载具编号长度不正确')
              return
            }
            if (values.pallet_code.charAt(0) !== 'P') {
              this.$message.warn('该载具不属于此库')
              return
            }
          }
          values.creator = this.userInfo.user_name
          values.type = this.taskType
          values.prio = 5
          values.source = values.org_position
          values.target = values.target_position
          console.log(values)
          AddAgvTask(values, values.pallet_code).then(res => {
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
    this.selectPointStart = this.selectPoint1
    this.selectPointEnd = [...this.selectPoint4, ...this.selectPoint6]
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
