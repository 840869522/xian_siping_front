<template>
  <a-card :bordered="false">
    <!-- 检索相关 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @submit="getDataBy" :form="formBy">
        <a-row :gutter="48">
          <a-col :md="5" :sm="24">
            <a-form-item label="载具编号">
              <a-input v-decorator="['pallet_code']" />
            </a-form-item>
          </a-col>
          <a-col :md="5" :sm="24">
            <a-form-item label="是否已打印">
              <a-select placeholder="请选择" v-decorator="['isprint']" :allowClear="true">
                <a-select-option v-for="item in isprintDic" :key="item" :value="item">
                  {{ item }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="5" :sm="24">
            <a-form-item label="状态">
              <a-select placeholder="请选择" v-decorator="['status']" :allowClear="true">
                <a-select-option v-for="item in statusDic" :key="item" :value="item">
                  {{ item }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <span class="table-page-search-submitButtons">
              <a-button html-type="submit" type="primary">查询</a-button>
              <a-button style="margin-left: 8px" @click="clearSelectBy">重置</a-button>
              <a-button style="margin-left: 8px" type="primary" @click="addData">添加载具</a-button>
              <a-button style=" margin-left: 8px;" type="primary" @click="printVehicleNo"
                v-print="print">打印</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <!-- 表格 -->
    <s-table :customRow="customRow" row-key="vehicle_id"
      :row-selection="{selectedRowKeys:selectedRowKeys,onChange:onSelectChange}" bordered
      ref="table" size="default" :columns="columns" :data="loadData">
      <a-tag :color="text == '启用' ? 'green' : 'red'" slot="status" slot-scope="text">{{ text }}
      </a-tag>
      <span slot="createTime" slot-scope="text">{{ text | moment }}</span>
      <span slot="action" slot-scope="text, record">
        <a @click="updateGetValue(record)">编辑</a>
        <a-divider type="vertical" />
        <a href="javascript:;" @click="delData(record)">删除</a>
      </span>
    </s-table>
    <!-- 编辑 -->
    <!-- <a-modal title="编辑" style="top: 20px" :width="800" v-model="visibleUpdate" @ok="updateSure">
      <a-form class="permission-form" :form="formUpdate">
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="登录账号" hasFeedback
          validateStatus="success">
          <a-input placeholder="登录账号" disabled="disabled" v-decorator="['login_name']" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="用户姓名" hasFeedback
          validateStatus="success">
          <a-input placeholder="用户姓名" v-decorator="['user_name']" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="角色名称" hasFeedback
          validateStatus="success">
          <a-input placeholder="角色名称" v-decorator="['role_name']" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="账号状态" hasFeedback
          validateStatus="warning">
          <a-select v-decorator="['status', { initialValue: 1 }]">
            <a-select-option v-for="item in statusDic" :hidden="item.dic_value == 100"
              :key="item.dic_value" :value="item.dic_value">
              {{ item.dic_display_value }}
            </a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal> -->
    <!-- 新增 -->
    <a-modal title="新增" style="top: 20px" :width="800" v-model="visibleAdd" @ok="addDataSure">
      <a-form class="permission-form" :form="formAdd">
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="载具编号">
          <a-input placeholder="载具编号"
            v-decorator="['pallet_code', { rules: [{ required: true, validator}] }] "
            @blur="distinct" />
        </a-form-item>
      </a-form>
    </a-modal>
    <a-modal title="打印预览" style="top: 20px" :width="800" v-model="visiblePrintView" :footer="false">
      <div id="printArea">
        <div style="page-break-after:always;" v-for="item in selectedData" :key="item.pallet_code">
          <img :id="item.pallet_code" />
          <h4 :hidden="selectedData.length!=0">未选择任何数据！</h4>
        </div>
      </div>
    </a-modal>
  </a-card>
</template>

<script>
import pick from 'lodash.pick'
import { STable } from '@/components'
import { getDataBy, addData, updateData } from '@/api/BasePallet'
import { getDropDownListBy } from '@/api/global'
import storage from 'store'
import JsBarcode from 'jsbarcode'
// 表头
const columns = [
  {
    title: '载具编号',
    dataIndex: 'pallet_code'
  },
  {
    title: '是否已打印',
    dataIndex: 'isprint'
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
  },
  {
    title: '更新人',
    dataIndex: 'updater'
  },
  {
    title: '更新时间',
    dataIndex: 'update_time'
  }
]

export default {
  name: 'Vehicle',
  components: {
    STable
  },
  data() {
    return {
      print: {
        id: 'printArea',
        popTitle: '&nbsp' // 打印配置页上方标题
      },
      // 打印入库单form
      printView: this.$form.createForm(this),
      visiblePrintView: false,
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
      // 查询参数
      queryParam: {},
      // 表头
      columns,
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        this.checkedData = null

        console.log(parameter)
        return getDataBy(parameter, this.queryParam).then(res => {
          this.selectedRowKeys = []
          this.selectedData = []
          this.$refs.table._vnode.elm.querySelectorAll('tr').forEach(item => {
            item.style.background = 'white'
          })
          return res.result
        })
      },
      // 状态字典列表
      statusDic: [],
      isprintDic: ['是', '否'],
      // 动态栅格
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
      checkedData: null,
      validator: (rule, value, cbfn) => {
        // console.log(rule, value, cbfn)
        if (!value) {
          cbfn('请输入有效值')
        } else if (!value.trim().length) {
          cbfn('请输入有效值')
        }
        cbfn()
      },
      selectedRowKeys: [],
      selectedData: []
    }
  },
  methods: {
    onSelectChange(selectedRowKeys, selectedData) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedData = selectedData
    },
    distinct() {
      this.formAdd.validateFields((err, values) => {
        if (!err) {
          values.creator = this.userInfo.user_name
          getDataBy({ pageNo: 1, pageSize: 10 }, values).then(res => {
            if (res.status) {
              if (res.result.anything.length > 0) {
                this.$message.warn('该载具已存在！')
                this.formAdd.setFieldsValue(pick({ pallet_code: '' }, ['pallet_code']))
              }
            }
          })
        }
      })
    },
    // 打印载具编号
    printVehicleNo() {
      this.visiblePrintView = true
      if (this.selectedData.length === 0) {
        this.$message.warn('请选择一条数据！')
      } else {
        this.$nextTick(() => {
          this.selectedData.forEach(ele => {
            ele.isprint = '是'
            // 待生成条码的内容
            JsBarcode('#' + ele.pallet_code, ele.pallet_code, {
              // 选择要使用的条形码类型
              format: 'CODE128',
              // 设置条之间的宽度
              width: 2,
              // 高度
              height: 80,
              // 是否在条形码下方显示文字
              displayValue: true,
              // 覆盖显示的文本       text: '456',
              // 使文字加粗体或变斜体
              fontOptions: 'bold italic',
              // 设置文本的字体
              font: 'fantasy',
              // 设置文本的水平对齐方式
              textAlign: 'center',
              // 设置文本的垂直位置
              textPosition: 'bottom',
              // 设置条形码和文本之间的间距
              textMargin: 8,
              // 设置文本的大小
              fontSize: 30,
              // 设置条和文本的颜色。
              lineColor: '#000',
              // 设置条形码周围的空白边距
              margin: 18
            })
          })
        })
      }
      this.print.openCallback = () => {
        this.visiblePrintView = false
        console.log(1)
        updateData(this.selectedData).then(res => {
          if (res.status) {
            this.$message.success('打印成功！')
          }
        })
      }
      this.print.closeCallback = () => {
        this.visiblePrintView = false
        this.print = null
      }
    },
    // 点击入库单行
    customRow(record, index) {
      return {
        on: {
          // 鼠标单击行
          click: event => {
            // 点击入库单给其行设置高亮颜色
            event.currentTarget.parentNode.querySelectorAll('tr').forEach(item => {
              item.style.background = 'white'
            })
            this.checkedData = record.pallet_code
            event.currentTarget.style.background = '#e6f7ff'
          }
        }
      }
    },
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
      this.queryParam = { pallet_code: '', status: '', isprint: '' }
      this.formBy.setFieldsValue(pick(this.queryParam, ['pallet_code', 'status', 'isprint']))
      this.$refs.table.refresh(true)
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
          values.isprint = '否'
          values.status = '可用'
          values.creator = this.userInfo.user_name
          addData(values).then(res => {
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
    // 取检索条件的数据字典
    getDic() {
      getDropDownListBy('baseStatus').then(res => {
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
</style>
