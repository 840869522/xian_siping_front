<template>
  <a-card :bordered="false">
    <!-- 检索相关 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @submit="getDataBy" :form="formBy">
        <a-row :gutter="48">
          <a-col :md="5" :sm="24">
            <a-form-item label="设备名称：">
              <a-input placeholder="请输入设备名称" v-decorator="['equipment_name']" />
            </a-form-item>
          </a-col>
          <a-col :md="5" :sm="24">
            <a-form-item label="设备编号：">
              <a-input placeholder="请输入设备编号" v-decorator="['equipment_code']" />
            </a-form-item>
          </a-col>
          <!--          <a-col :md="5" :sm="24">-->
          <!--            <a-form-item label="状态">-->
          <!--              <a-select placeholder="请选择" v-decorator="['status']">-->
          <!--                <a-select-option v-for="item in statusDic" :key="item" :value="item">-->
          <!--                  {{ item }}-->
          <!--                </a-select-option>-->
          <!--              </a-select>-->
          <!--            </a-form-item>-->
          <!--          </a-col>-->
          <a-col :md="6" :sm="24">
            <span class="table-page-search-submitButtons">
              <a-button html-type="submit" type="primary">查询</a-button>
              <a-button style="margin-left: 8px" @click="clearSelectBy">重置</a-button>
              <a-button style="margin-left: 8px" type="primary" @click="addData">新增设备</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <!-- 表格 -->
    <s-table bordered :customRow="customRow" ref="table" size="default" :pageSize="5"
      :columns="columns" :data="loadData">
      <a-tag color="green" slot="status_display_value" slot-scope="text">{{ text }}</a-tag>
      <span slot="createTime" slot-scope="text">{{ text | moment }}</span>
      <!-- <span slot="action" slot-scope="text, record">
        <a @click="updateGetValue(record)">编辑</a>
        <a-divider type="vertical" /> -->
      <!-- <a href="javascript:;" @click="delData(record)">删除</a>
        <a-divider type="vertical" /> -->
      <!-- <a href="javascript:;" @click="updateGetValue(record)">提交</a> -->
      <!-- </span> -->
    </s-table>
    <div>
      <a-button type="primary" @click="addDataDetail">新增保养/维修记录</a-button>
    </div>
    <!-- <a-divider /> -->
    <s-table bordered ref="detailTable" size="default" :pageSize="5" :columns="detailColumns"
      :data="loadDataDetail">
      <!-- <a-tag color="green" slot="status_display_value" slot-scope="text">{{ text }}</a-tag> -->
      <!-- <span slot="createTime" slot-scope="text">{{ text | moment }}</span> -->
      <!-- <span slot="action" slot-scope="text, record">
        <a @click="updateGetValue(record)">编辑</a>
        <a-divider type="vertical" />
        <a href="javascript:;" @click="delData(record)">删除</a>
      </span> -->
    </s-table>

    <!-- 编辑 -->
    <!-- <a-modal title="编辑" style="top: 20px" :width="800" v-model="visibleUpdate" @ok="updateSure">
      <a-form class="permission-form" :form="formUpdate">
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="入库单号">
          <a-input placeholder="入库单号"
            v-decorator="['in_order_id', { rules: [{ required: true, validator, message: '请输入入库单号!' }] }]" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="订单类型">
          <a-input placeholder="订单类型"
            v-decorator="['order_type', { rules: [{ required: true, validator, message: '请输入订单类型!' }] }]" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="车牌号">
          <a-input placeholder="车牌号"
            v-decorator="['car_no', { rules: [{ required: true, validator, message: '请输入车牌号!' }] }]" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="原始单号">
          <a-input placeholder="原始单号"
            v-decorator="['org_order', { rules: [{ required: true, validator, message: '请输入原始单号!' }] }]" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="单据状态">
          <a-select v-decorator="['status', { initialValue: 2 }]">
            <a-select-option v-for="item in statusDic" :hidden="item.dic_value == 100"
              :key="item.dic_value" :value="item.dic_value">
              {{ item.dic_display_value }}
            </a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal> -->
    <!-- 新增设备 -->
    <a-modal title="新增设备" style="top: 20px" :width="800" v-model="visibleAdd" @ok="addDataSure">
      <a-form class="permission-form" :form="formAdd">
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="设备编号：">
          <a-input placeholder="设备编号" v-decorator="['equipment_code']" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="设备名称：">
          <a-input placeholder="设备名称" v-decorator="['equipment_name']" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="保养期限：">
          <a-input placeholder="保养期限" v-decorator="['period']" />
        </a-form-item>
      </a-form>
    </a-modal>
    <!-- 新增设备保养明细 -->
    <a-modal title="新增保养/维修记录" style="top: 20px" :width="800" v-model="visibleAddDetail"
      @ok="addDataSureDetail">
      <a-form class="permission-form" :form="formAddDetail">
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="设备编号：">
          <a-input disabled placeholder="设备编号：" v-decorator="['equipment_code']" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="设备名称：">
          <a-input disabled placeholder="设备名称：" v-decorator="['equipment_name']" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="保养/维修内容：">
          <a-textarea placeholder="保养/维修内容" v-decorator="['maintenance_content' ]" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="保养/维修人：">
          <a-input placeholder="保养/维修人" v-decorator="['maintenance_person']" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="保养/维修时间：">
          <a-input placeholder="保养/维修时间" v-decorator="['maintenance_date']" />
        </a-form-item>
      </a-form>
    </a-modal>
  </a-card>
</template>

<script>
import pick from 'lodash.pick'
import { STable } from '@/components'
import storage from 'store'
import { getDataBy, addData } from '@/api/BaseEquipment'
import { addDataDetail, getDataByDetail } from '@/api/BaseEquipmentDetail'
import { getDropDownListBy } from '@/api/global'

// 表头
const columns = [
  {
    title: '设备编号',
    dataIndex: 'equipment_code'
  },
  {
    title: '设备名称',
    dataIndex: 'equipment_name'
  },
  {
    title: '保养期限（天）',
    dataIndex: 'period'
  },
  // {
  //   title: '状态',
  //   dataIndex: 'status'
  // },
  {
    title: '创建人',
    dataIndex: 'creator'
  },
  {
    title: '创建时间',
    dataIndex: 'create_time'
  },
  {
    title: '编辑人',
    dataIndex: 'updater'
  },
  {
    title: '编辑时间',
    dataIndex: 'update_time'
  }
  // {
  //   title: '操作',
  //   width: '150px',
  //   dataIndex: 'action',
  //   scopedSlots: { customRender: 'action' }
  // }
]

const detailColumns = [
  {
    title: '设备编号',
    dataIndex: 'equipment_code'
  },
  {
    title: '设备名称',
    dataIndex: 'equipment_name'
  },
  {
    title: '保养/维修时间',
    dataIndex: 'maintenance_date'
  },
  {
    title: '保养/维修内容',
    dataIndex: 'maintenance_content'
  },
  {
    title: '保养/维修人',
    dataIndex: 'maintenance_person'
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
  name: 'Equip',
  components: {
    STable
  },
  data() {
    return {
      // 添加模态框是否显示
      visibleAdd: false,
      // 更新模态框是否显示
      visibleUpdate: false,
      // 编辑form
      formUpdate: this.$form.createForm(this),
      // 条件查询form
      formBy: this.$form.createForm(this),
      // 新增form
      formAdd: this.$form.createForm(this),
      // 新增form
      formAddDetail: this.$form.createForm(this),
      // 入库明细查询参数
      queryParamDetail: {},
      queryParam: {},
      // 表头
      columns,
      detailColumns,
      // 当前选中的设备数据
      checkedEquipData: null,
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return getDataBy(parameter, this.queryParam).then(res => {
          this.checkedEquipData = null
          this.$refs.table._vnode.elm.querySelectorAll('tr').forEach(item => {
            item.style.background = 'white'
          })
          console.log(res.result)
          return res.result
        })
      },
      loadDataDetail: parameter => {
        return getDataByDetail(parameter, this.queryParamDetail).then(res => {
          console.log(res)
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
      visibleAddDetail: false,
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
  computed: {
    //  定义导出的EXCEL表头数据
    titleArr() {
      const arr = []
      this.columns.map(item => {
        arr.push(item.title)
      })
      return arr
    }
  },
  methods: {
    // 点击单行
    customRow(record, index) {
      // this.checkedEquipData = record
      return {
        on: {
          // 鼠标单击行
          click: event => {
            // 取到点击行的数据并取到入库明细
            this.queryParamDetail = { equipment_code: record.equipment_code }
            // console.log(this.queryParamDetail)
            this.$refs.detailTable.refresh(true)
            // 点击设备列表给其行设置高亮颜色
            event.currentTarget.parentNode.querySelectorAll('tr').forEach(item => {
              item.style.background = 'white'
            })
            this.checkedEquipData = record
            event.currentTarget.style.background = '#e6f7ff'
          }
        }
      }
    },
    onChange() {},
    // 条件查询按钮点击事件
    getDataBy(e) {
      e.preventDefault()
      this.formBy.validateFields((err, values) => {
        if (!err) {
          this.queryParam = values
          this.$refs.table.refresh(true)
        }
      })
    },
    // 重置检索条件
    clearSelectBy() {
      this.queryParam = { equipment_code: '', equipment_name: '', status: '' }
      this.formBy.setFieldsValue(pick(this.queryParam, ['equipment_code', 'equipment_name', 'status']))
      this.$refs.table.refresh(true)
    },

    // 新增设备保养按钮点击事件
    addDataDetail(e) {
      if (this.checkedEquipData === null) {
        this.$message.warning('请选择一条设备数据！')
      } else {
        this.visibleAddDetail = true
        const _this = this
        setTimeout(() => {
          const temp = { equipment_code: _this.checkedEquipData.equipment_code, equipment_name: _this.checkedEquipData.equipment_name }
          _this.formAddDetail.setFieldsValue(pick(temp, ['equipment_code', 'equipment_name']))
        }, 1000)
      }
    },
    // 确认新增设备保养点击事件
    addDataSureDetail(e) {
      e.preventDefault()
      this.formAddDetail.validateFields((err, values) => {
        if (!err) {
          console.log(values)
          values.creator = this.userInfo.user_name
          addDataDetail(values).then(res => {
            this.visibleAddDetail = false
            if (res.status) {
              this.$refs.detailTable.refresh(true)
              this.$message.success(res.message)
            } else {
              this.$message.warn(res.message)
            }
          })
        }
      })
    },

    // 新增按钮点击事件
    addData(e) {
      this.visibleAdd = true
    },
    // 确认新增点击事件
    addDataSure(e) {
      e.preventDefault()
      this.formAdd.validateFields((err, values) => {
        if (!err) {
          console.log(values)
          values.creator = this.userInfo.user_name
          addData(values).then(res => {
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
    // updateGetValue(record) {
    //   this.visibleUpdate = true
    //   this.$nextTick(() => {
    //     this.formUpdate.setFieldsValue(pick(record, ['in_order_id', 'order_type', 'car_no', 'org_order', 'status']))
    //   })
    // },
    // 确定更新数据
    // updateSure(e) {
    //   this.visibleUpdate = false
    //   e.preventDefault()
    //   this.formUpdate.validateFields((err, values) => {
    //     if (!err) {
    //       values.updater = this.userInfo.user_name
    //       updateData(values).then(res => {
    //         console.log(res)
    //         if (res.status) {
    //           this.$refs.table.refresh(true)
    //           this.$message.success(res.message)
    //         } else {
    //           this.$message.warn(res.message)
    //         }
    //       })
    //     }
    //   })
    // },
    // 取检索条件的数据字典
    getDic() {
      getDropDownListBy('baseStatus').then(res => {
        this.statusDic = res.result.anything
      })
    }
  },
  created() {
    // this.getDic()
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
#printArea {
  padding: 0 20px;
  .printTitle {
    font-size: 16px;
    font-weight: bolder;
    text-align: center;
    padding-top: 30px;
  }
  .ant-row {
    padding-top: 20px;
    .ant-col:not([col1]) {
      padding: 10px 0;
    }
  }
}
@page {
  size: auto;
  margin: 0mm;
  padding: 5mm;
}
.uploadContain {
  display: inline-block;
  position: relative;
}
.ant-form input[type='file'] {
  height: 32px;
  background: red;
  width: 102px;
  display: inline-block;
  position: absolute;
  z-index: 2;
  left: 8px;
  opacity: 0;
}
</style>
