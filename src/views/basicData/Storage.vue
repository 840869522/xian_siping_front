<template>
  <a-card :bordered="false">
    <!-- 检索相关 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" :form="formBy">
        <a-row :gutter="48">
          <a-col :md="4" :sm="24">
            <a-form-item label="所属仓库：">
              <a-select placeholder="请选择仓库" :allowClear="true" v-decorator="['warehouse']">
                <a-select-option v-for="item in storageTypeDicList" :key="item.dic_display_value"
                  :value="item.dic_display_value">
                  {{ item.dic_display_value }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="24">
            <a-form-item label="货位编号：">
              <a-input v-decorator="['location_code']" />
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="24">
            <a-form-item label="载具编号：">
              <a-input v-decorator="['pallet_code']" />
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="24">
            <a-form-item label="状态">
              <a-select placeholder="请选择" v-decorator="['status']" :allowClear="true">
                <a-select-option v-for="item in statusDic" :key="item" :value="item">
                  {{ item }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <span class="table-page-search-submitButtons">

              <a-button @click="getDataBy" type="primary">查询</a-button>
              <a-button style="margin-left: 8px" @click="clearSelectBy">重置</a-button>
              <a-button style="margin-left: 8px" type="primary" @click="printStorageNo"
                v-print="print">打印
              </a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <!-- 表格 -->
    <s-table row-key="location_code" bordered ref="table" size="default" :columns="columns"
      :row-selection="{selectedRowKeys:selectedRowKeys,onChange:onSelectChange}" :data="loadData">
      <a-tag :color="text == '启用' ? 'green' : 'red'" slot="status" slot-scope="text">{{ text }}
      </a-tag>
      <span slot="createTime" slot-scope="text">{{ text | moment }}</span>
      <span slot="action" slot-scope="text, record">
        <a @click="updateSure(record)">状态变更</a>
      </span>
    </s-table>
    <a-modal title="打印预览" style="top: 20px" :width="800" v-model="visiblePrintView" :footer="false">
      <div id="printArea">
        <div style="page-break-after:always;" v-for="item in selectedData"
          :key="item.location_code">
          <img :id="item.location_code" />
          <h4 :hidden="selectedData.length!=0">未选择任何数据！</h4>
        </div>
      </div>
    </a-modal>
  </a-card>
</template>

<script>
import pick from 'lodash.pick'
import { STable } from '@/components'
import { getDataBy, updateData } from '@/api/LocationMap'
import { getDropDownListBy } from '@/api/global'
import JsBarcode from 'jsbarcode'
import storage from 'store'

let storageTypeText = ''
// 表头
const columns = [
  {
    title: '货位编号',
    dataIndex: 'location_code'
  },
  {
    title: 'X轴编号',
    dataIndex: 'location_code_x'
  },
  {
    title: 'Y轴编号',
    dataIndex: 'location_code_y'
  },
  {
    title: 'Z轴编号',
    dataIndex: 'location_code_z'
  },
  {
    title: 'Y轴深度',
    dataIndex: 'location_code_d'
  },

  {
    title: '载具号',
    dataIndex: 'pallet_code'
  },
  {
    title: '货位类型',
    dataIndex: 'warehouse_type'
  },
  {
    title: '所属仓库',
    dataIndex: 'warehouse'
  },
  {
    title: '所属区域',
    dataIndex: 'location_area'
  },
  {
    title: '货位高度',
    dataIndex: 'height'
  },
  {
    title: '已用容量',
    dataIndex: 'volume'
  },
  {
    title: '状态',
    dataIndex: 'status'
  },
  {
    title: '创建人',
    dataIndex: 'updater'
  },
  {
    title: '创建时间',
    dataIndex: 'update_time'
  },
  {
    title: '操作',
    width: '90px',
    dataIndex: 'action',
    scopedSlots: { customRender: 'action' }
  }
]

export default {
  name: 'Storage',
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
        // parameter.pageSize = 2
        this.queryParam.warehouse = storageTypeText
        return getDataBy(parameter, this.queryParam).then(res => {
          this.selectedRowKeys = []
          this.selectedData = []
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
      selectedRowKeys: [],
      selectedData: [],
      storageTypeDicList: []
    }
  },
  methods: {
    onSelectChange(selectedRowKeys, selectedData) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedData = selectedData
    },
    // 打印库位编号
    printStorageNo() {
      this.visiblePrintView = true
      if (this.selectedData.length === 0) {
        this.$message.warn('请选择一条数据！')
      } else {
        this.$nextTick(() => {
          this.selectedData.forEach(ele => {
            // 待生成条码的内容
            JsBarcode('#' + ele.location_code, ele.location_code, {
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
      }
      this.print.closeCallback = () => {
        this.visiblePrintView = false
        this.print = null
      }
    },
    // 条件查询按钮点击事件
    getDataBy() {
      this.queryParam.warehouse = this.formBy.getFieldValue('warehouse')
      this.queryParam.location_code = this.formBy.getFieldValue('location_code')
      this.queryParam.pallet_code = this.formBy.getFieldValue('pallet_code')
      this.queryParam.status = this.formBy.getFieldValue('status')
      console.log(this.queryParam)
      this.$refs.table.refresh(true)
    },
    // 重置检索条件
    clearSelectBy() {
      this.queryParam = {
        warehouse: '',
        location_code: '',
        pallet_code: '',
        status: ''
      }
      this.formBy.setFieldsValue(pick(this.queryParam, ['warehouse', 'location_code', 'status', 'pallet_code']))
      this.$refs.table.refresh(true)
    },
    // 确定更新数据
    updateSure(record) {
      record.status = record.status === '禁用' ? '启用' : '禁用'
      updateData(record).then(res => {
        if (res.status) {
          this.$refs.table.refresh(true)
          this.$message.success(res.message)
        } else {
          this.$message.warn(res.message)
        }
      })
    },
    // 取检索条件的数据字典
    getDic() {
      getDropDownListBy('baseStatus').then(res => {
        this.statusDic = res.result.anything
      })
      this.storageTypeDicList = storage.get('storageTypeDicList')
    }
  },
  created() {
    this.getDic()
    storageTypeText = JSON.parse(localStorage.getItem('storageTypeText'))
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
