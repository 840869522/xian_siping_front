<template>
  <a-card :bordered="false">
    <!-- 检索相关 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @submit="getDataBy" :form="formBy">
        <a-row :gutter="48">
          <a-col :md="5" :sm="24">
            <a-form-item label="单号：">
              <a-input placeholder="请输入单号" v-decorator="['out_order_id']" />
            </a-form-item>
          </a-col>
          <a-col :md="5" :sm="24">
            <a-form-item label="状态">
              <a-select placeholder="请选择" v-decorator="['status']">
                <a-select-option v-for="item in statusDic" :key="item" :value="item">
                  {{ item }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <!-- <a-col :md="8" :sm="24">
            <a-form-item label="选择时间：">
              <a-range-picker :placeholder="['开始时间', '结束时间']" v-model="dateVar"
                @change="onChange" />
            </a-form-item>
          </a-col> -->
          <a-col :md="6" :sm="24">
            <span class="table-page-search-submitButtons">
              <a-button html-type="submit" type="primary">查询</a-button>
              <a-button style="margin-left: 8px" @click="clearSelectBy">重置</a-button>
              <a-select style="margin-left: 8px;" placeholder="请选择拣货口" showArrow mode="multiple"
                v-model="jianhuokouArr">
                <a-select-option v-for="item in jianhuokou" :key="item.value" :value="item.value">
                  {{ item.text }}
                </a-select-option>
              </a-select>
              <a-button style="margin-left: 8px" type="primary" @click="pickPallet">配盘</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <!-- 表格 -->
    <s-table bordered rowKey="out_order_id"
      :row-selection="{selectedRowKeys:selectedRowKeys,onChange:onSelectChange}"
      :customRow="customRow" ref="table" size="default" :pageSize="5" :columns="columns"
      :data="loadData">
      <a-tag color="green" slot="status_display_value" slot-scope="text">{{ text }}</a-tag>
      <span slot="createTime" slot-scope="text">{{ text | moment }}</span>
      </span>
    </s-table>

    <s-table rowKey="out_order_detail_id" bordered ref="detailTable" size="default" :pageSize="5"
      :columns="detailColumns" :data="loadDataDetail">
      <a-tag color="green" slot="status_display_value" slot-scope="text">{{ text }}</a-tag>
      <span slot="createTime" slot-scope="text">{{ text | moment }}</span>
    </s-table>
  </a-card>
</template>

<script>
import pick from 'lodash.pick'
import { STable } from '@/components'
import storage from 'store'
import { getDataBy, updateData, delData, addData, submitStatus } from '@/api/OutOrder'
import { getDataByDetail, addDataDetail, delDataDetail, updateDataDetail } from '@/api/OutOrderDetail'
import { getDataByInventory } from '@/api/Inventory'
import { getDropDownListBy } from '@/api/global'
import { getMaterialBy } from '@/api/BaseMaterial'
import { OrderPick } from '@/api/OutPick'

import JsBarcode from 'jsbarcode'
import * as XLSX from 'xlsx'

// 表头
const columns = [
  {
    title: '出库单号',
    dataIndex: 'out_order_id'
  },
  {
    title: '订单类型',
    dataIndex: 'order_type'
  },
  {
    title: '车牌号',
    dataIndex: 'car_no'
  },
  {
    title: '原始单号',
    dataIndex: 'org_order'
  },
  {
    title: '状态',
    dataIndex: 'status'
  },
  {
    title: '核算科目',
    dataIndex: 'hesuankemu'
  },
  {
    title: '收物单位',
    dataIndex: 'shouwudanwei'
  },
  {
    title: '分队请领编号',
    dataIndex: 'fenduiqinglingbianhao'
  },
  {
    title: '调拨单号',
    dataIndex: 'diaobodanhao'
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

const detailColumns = [
  {
    title: '出库单明细ID',
    dataIndex: 'out_order_detail_id'
  },
  {
    title: '订单数量',
    dataIndex: 'order_count'
  },
  {
    title: '出库数量',
    dataIndex: 'actual_count'
  },
  {
    title: '配盘数量',
    dataIndex: 'pick_count'
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
    title: '质量等级',
    dataIndex: 'zhiliangdengji'
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
  name: 'InStorageBills',
  components: {
    STable
  },
  data() {
    return {
      jianhuokouArr: [],
      jianhuokou: [],
      orderTypeDic: [],
      visibleGetGoods: false,
      printTitle: '',
      print: {
        id: 'printArea',
        popTitle: '&nbsp' // 打印配置页上方标题
      },
      // 打印出库单预览弹出框是否显示
      visiblePrintView: false,
      // 添加模态框是否显示
      visibleAdd: false,
      showSelect: true,
      // 更新模态框是否显示
      visibleUpdate: false,
      formGetGoods: this.$form.createForm(this),
      // 打印出库单form
      printView: this.$form.createForm(this),
      // 编辑form
      formUpdate: this.$form.createForm(this),
      formUpdateDetail: this.$form.createForm(this),
      // 条件查询form
      formBy: this.$form.createForm(this),
      // 新增form
      formAdd: this.$form.createForm(this),
      // 新增form
      formAddDetail: this.$form.createForm(this),
      // 出库单查询参数
      queryParam: {},
      // 出库明细查询参数
      queryParamDetail: {},
      startTime: '1900-01-01',
      endTime: '3000-01-01',
      dateVar: ['', ''],
      // 表头
      columns,
      detailColumns,
      printData: [],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        const storageName = storage.get('storageTypeText')
        console.log(storageName)
        if (storageName === 'H库') {
          this.showSelect = true
        } else {
          this.showSelect = false
        }
        parameter.startTime = this.startTime
        parameter.endTime = this.endTime
        this.checkedData = null
        this.outorderStatus = null
        // this.queryParamDetail = { out_order_id: '就是让你查不到' }
        // this.loadDataDetail({ pageNo: 1, pageSize: 3 })
        return getDataBy(parameter, this.queryParam).then(res => {
          // console.log(res, parameter, this.queryParam)
          this.$refs.table._vnode.elm.querySelectorAll('tr').forEach(item => {
            item.style.background = 'white'
          })
          this.$refs.detailTable.refresh(true)
          // console.log(res.result)
          return res.result
        })
      },
      loadDataDetail: parameter => {
        return getDataByDetail(parameter, this.queryParamDetail).then(res => {
          if (this.checkedData == null) {
            res.result.anything = []
          }
          this.printData = res.result.anything
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
      },

      checkedData: null,
      outorderStatus: null,
      visibleUpdateDetail: false,
      order_count: 0,
      inventory_count: 0,
      selectedRowKeys: [],
      selectedData: [],
      storageName: ''
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
    onSelectChange(selectedRowKeys, selectedData) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedData = selectedData
      // console.log(this.selectedData)
    },
    submitStatus(record) {
      submitStatus(record).then(res => {
        if (res.status) {
          this.$message.success(res.message)
          this.$refs.table.refresh(true)
        } else {
          this.$message.warn(res.message)
        }
      })
    },
    testInt() {
      const orderCount = this.formAddDetail.getFieldValue('order_count')
      if (orderCount < 0 || orderCount === undefined || orderCount % 1 !== 0) {
        this.formAddDetail.setFields({
          order_count: { value: '', errors: [{ message: '请输入正整数', field: 'order_count' }] }
        })
      }
    },
    onChange(date, dateString) {
      this.startTime = dateString[0]
      this.endTime = dateString[1]
      this.dateVar = [this.startTime, this.endTime]
    },
    queryDataBatch() {
      const palletCodeTemp = this.formGetGoods.getFieldValue('pallet_code')
      getDataByInventory(
        {
          pageNo: 1,
          pageSize: 1,
          startTime: '1900-01-01',
          endTime: '3000-01-01'
        },
        { palletCodeTemp }
      ).then(res => {
        if (res.status) {
          console.log(res.result.anything[0])
          this.$nextTick(() => {
            this.formGetGoods.setFieldsValue(pick(res.result.anything[0], ['batch']))
          })
          return false
        } else {
          this.$message.warn(res.message)
        }
      })
    },
    // setGoods(record) {
    //   this.visibleGetGoods = true
    //   this.order_count = record.order_count
    //   this.inventory_count = record.actual_count
    //   this.$nextTick(() => {
    //     this.formGetGoods.setFieldsValue(
    //       pick(record, ['out_order_id', 'out_order_detail_id', 'order_type', 'car_no', 'material_code', 'org_order', 'status'])
    //     )
    //   })
    // },
    // setGoodsSure(e) {
    //   e.preventDefault()
    //   this.formGetGoods.validateFields((err, values) => {
    //     if (!err) {
    //       values.location_code = values.pallet_code
    //       addDataInventory(values).then(res => {
    //         if (res.status) {
    //           this.visibleGetGoods = false
    //           this.$refs.detailTable.refresh(true)
    //         } else {
    //           this.visibleGetGoods = false
    //           this.$message.warn(res.message)
    //         }
    //       })
    //     }
    //   })
    // },
    queryData(e) {
      e.preventDefault()
      const materialCodeTemp = this.formAddDetail.getFieldValue('material_code')
      getMaterialBy(
        {
          pageNo: 1,
          pageSize: 1,
          startTime: '1900-01-01',
          endTime: '3000-01-01'
        },
        { material_code: materialCodeTemp }
      ).then(res => {
        if (res.status) {
          console.log(res)
          this.$nextTick(() => {
            this.formAddDetail.setFieldsValue(pick(res.result.anything[0], ['material_name']))
          })
        } else {
          this.$nextTick(() => {
            this.formAddDetail.setFieldsValue(pick({ material_name: '' }, ['material_name']))
          })
          this.$message.warn(res.message)
        }
      })
    },
    // 新增出库单生辰出库单号
    // create_out_order_id() {
    //   createOutOrderId().then(res => {
    //     console.log(res)
    //     if (res.status) {
    //       this.formAdd.setFieldsValue(pick({ out_order_id: res.result.anything }, ['out_order_id']))
    //     } else {
    //       this.$message.warn(res.message)
    //     }
    //   })
    // },
    // 导出EXCEL
    ToDoExcel() {
      // 屈经理说单独写接口
      getDataBy({ pageNo: 1, pageSize: 1000000 }, this.queryParam).then(res => {
        console.log(res)
        // 定义表格数据
        const arr = []
        res.result.anything.map(item => {
          arr.push([
            item.car_no,
            item.create_time,
            item.creator,
            item.out_order_id,
            item.order_type,
            item.org_order,
            item.status,
            item.udf01,
            item.udf02,
            item.udf03,
            item.udf04,
            item.udf05,
            item.update_time,
            item.updater
          ])
        })
        // 调用导出EXCEL的方法
        this.$ToDoExcel(`出库单`, this.titleArr, arr)
      })
    },
    // 导入excel
    uploadXLSX(info) {
      const { files } = event.target
      const vali = /\.(xls|xlsx)$/
      if (files.length <= 0) {
        // 如果没有文件名
        return false
      }
      if (!vali.test(files[0].name.toLowerCase())) {
        this.$Message.error('上传格式不正确，请上传xls或者xlsx格式')
        return false
      }
      const file = event.target.files[0]
      const reader = new FileReader()
      console.log(file, 'file')

      reader.onload = e => {
        // 读取成功后result中的数据
        const data = e.target.result
        // 以base64方法读取 结果
        const workbook = XLSX.read(data, { type: 'binary' })
        // 获取数据的表名
        const sheetName = workbook.SheetNames[0]
        // workSheet 是该excel表格中的数据
        const sheet = workbook.Sheets[sheetName]
        console.log(sheet)
        for (const j in sheet) {
          if (j.search('1')) {
            for (let i = 0; i < this.columns.length; i++) {
              if (columns[i].title === sheet[j].h) {
                sheet[j].h = columns[i].dataIndex
                sheet[j].v = columns[i].dataIndex
                sheet[j].w = columns[i].dataIndex
              }
            }
          }
        }

        // 数据解析,输出JSON格式
        const jsonData = XLSX.utils.sheet_to_json(sheet)
        console.log(jsonData)
        // do something with jsonData
      }
      reader.readAsBinaryString(file)
    },
    handleData(data) {},
    // 配盘

    pickPallet() {
      if (this.selectedData.length !== 1) {
        this.$message.warn('请选择一条数据')
        return
      }
      // this.jianhuokouArr = [1]
      OrderPick(this.selectedData[0], this.jianhuokouArr).then(result => {
        if (result.status) {
          this.$message.success(result.message)
        } else {
          this.$message.warn(result.message)
        }
      })
    },
    // 点击出库单行
    customRow(record, index) {
      return {
        on: {
          // 鼠标单击行
          click: event => {
            // 取到点击行的数据并取到出库明细
            this.queryParamDetail = { out_order_id: record.out_order_id }
            this.$refs.detailTable.refresh(true)
            // 点击出库单给其行设置高亮颜色
            event.currentTarget.parentNode.querySelectorAll('tr').forEach(item => {
              item.style.background = 'white'
            })
            this.checkedData = record
            this.outorderStatus = record.status
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
          this.selectedRowKeys = []
          this.selectedData = []
          this.queryParam = values
          this.$refs.table.refresh(true)
        }
      })
    },
    // 重置检索条件
    clearSelectBy() {
      this.startTime = '1900-01-01'
      this.endTime = '3000-01-01'
      this.dateVar = ['', '']
      this.queryParam = { out_order_id: '', status: '' }
      this.formBy.setFieldsValue(pick(this.queryParam, ['out_order_id', 'status']))
      this.$refs.table.refresh(true)
    },

    // 新增出库明细按钮点击事件
    addDataDetail(e) {
      if (this.checkedData === null) {
        this.$message.info('请先选择一个出库单！')
        return
      }
      this.visibleAddDetail = true
      setTimeout(() => {
        this.formAddDetail.setFieldsValue(pick(this.checkedData, ['out_order_id']))
      }, 1000)
    },
    // 确认新增出库明细点击事件
    addDataSureDetail(e) {
      e.preventDefault()
      this.formAddDetail.validateFields((err, values) => {
        if (!err) {
          values.creator = this.userInfo.user_name
          const promise = new Promise((resolve, reject) => {
            const materialCodeTemp = this.formAddDetail.getFieldValue('material_code')
            const orderIdTemp = this.formAddDetail.getFieldValue('out_order_id')
            // console.log(orderIdTemp)
            getDataByDetail(
              { pageNo: 1, pageSize: 1, startTime: '1900-01-01', endTime: '3000-01-01' },
              { material_code: materialCodeTemp, out_order_id: orderIdTemp }
            ).then(res => {
              resolve(res)
            })
          })
          promise.then(res => {
            // console.log(res)
            if (res.result.totalCount === 0) {
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
            } else {
              this.$message.warn('该入库单此物料已存在！')
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
    updateGetValue(record) {
      this.visibleUpdate = true
      console.log(record)
      this.$nextTick(() => {
        this.formUpdate.setFieldsValue(pick(record, ['out_order_id', 'order_type', 'car_no', 'org_order', 'status']))
      })
    },
    // 确定更新数据
    updateSure(e) {
      this.visibleUpdate = false
      e.preventDefault()
      this.formUpdate.validateFields((err, values) => {
        if (!err) {
          values.updater = this.userInfo.user_name
          console.log(values)
          updateData(values).then(res => {
            console.log(res)
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
    // 明细编辑按钮取值给模态框
    updateGetValueDetail(record) {
      this.visibleUpdateDetail = true
      setTimeout(() => {
        this.formUpdateDetail.setFieldsValue(
          pick(record, ['out_order_detail_id', 'out_order_id', 'order_count', 'material_code', 'material_name', 'batch'])
        )
      }, 1000)
    },
    // 明细确定更新数据
    updateSureDetail(e) {
      e.preventDefault()
      this.formUpdateDetail.validateFields((err, values) => {
        console.log(err, values)
        if (!err) {
          values.updater = this.userInfo.user_name

          updateDataDetail(values).then(res => {
            console.log(res)
            if (res.status) {
              this.$refs.detailTable.refresh(true)
              this.$message.success(res.message)
            } else {
              this.$message.warn(res.message)
            }
            this.visibleUpdateDetail = false
          })
        }
      })
    },
    // 删除数据
    delDataMethod(record, type) {
      const _this = this
      const modal = this.$confirm({
        content: '确定删除此数据吗？',
        okText: '删除',
        cancelText: '取消',
        onOk() {
          let temp = {}
          console.log(record)
          switch (type) {
            case 'tableTitle':
              temp = { out_order_id: record.out_order_id }
              delData(temp).then(res => {
                if (res.status) {
                  _this.$refs.table.refresh(true)
                  _this.$message.success(res.message)
                } else {
                  _this.$message.warn(res.message)
                }
              })
              break
            case 'tableContent':
              temp = { out_order_detail_id: record.out_order_detail_id }
              delDataDetail(temp).then(res => {
                if (res.status) {
                  _this.$refs.detailTable.refresh(true)
                  _this.$message.success(res.message)
                } else {
                  _this.$message.warn(res.message)
                }
              })
              break
            default:
          }
        },
        onCancel() {
          modal.destroy()
        }
      })
    },
    // 取检索条件的数据字典
    getDic() {
      getDropDownListBy('OutOrderStatus').then(res => {
        console.log(res)
        this.statusDic = res.result.anything
      })
      getDropDownListBy('order_type').then(res => {
        this.orderTypeDic = res.result.anything
      })
    },
    // 打印出库单按钮点击事件
    printInStorageBills() {
      this.visiblePrintView = true
      this.$nextTick(() => {
        // 待生成条码的内容
        JsBarcode('#printBarCode', this.checkedData.out_order_id, {
          // 选择要使用的条形码类型
          format: 'CODE128',
          // 设置条之间的宽度
          width: 1,
          // 高度
          height: 30,
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
          textMargin: 5,
          // 设置文本的大小
          fontSize: 8,
          // 设置条和文本的颜色。
          lineColor: '#000',
          // 设置条形码周围的空白边距
          margin: 0
        })
      })
      const storageName = storage.get('storageTypeText')
      this.printTitle = '器材仓库' + storageName + '出库单'
      this.print.openCallback = () => {
        this.visiblePrintView = false
      }
      this.print.closeCallback = () => {
        this.visiblePrintView = false
        this.print = null
      }
    }
  },

  created() {
    this.getDic()
    this.userInfo = storage.get('userInfo')
    this.storageName = storage.get('storageTypeText')
    switch (this.storageName) {
      case 'D库':
        this.jianhuokou = [
          { text: '操作口1', value: 'A01' },
          { text: '操作口2', value: 'A02' }
        ]
        break
      case 'B库':
        this.jianhuokou = [
          { value: '4012', text: '出库口1' },
          { value: '4079', text: '出库口2' },
          { value: '3016', text: '一楼拣选3016' },
          { value: '3019', text: '一楼拣选3019' },
          { value: '3020', text: '一楼拣选3020' },
          { value: '3042', text: '一楼拣选3042' },
          { value: '3043', text: '一楼拣选3043' },
          { value: '3059', text: '一楼拣选3059' },
          { value: '6011', text: '二楼拣选6011' },
          { value: '6012', text: '二楼拣选6012' },
          { value: '6013', text: '二楼拣选6013' },
          { value: '6014', text: '二楼拣选6014' },
          { value: '6015', text: '二楼拣选6015' }
        ]
        break
      case 'P库':
        this.jianhuokou = [
          { value: '1041', text: '出口1' },
          { value: '1026', text: '出口2' },
          { value: '1009', text: '出口3' },
          { value: '1033', text: '出入库口1' },
          { value: '1023', text: '出入库口2' },
          { value: '1011', text: '出入库口3' },
          { value: '1067', text: '拣选/补货口1' },
          { value: '1054', text: '拣选/补货口2' },
          { value: '1051', text: '拣选/补货口3' }
        ]
        break
    }
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
