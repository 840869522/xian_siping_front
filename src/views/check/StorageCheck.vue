<template>
  <a-card :bordered="false">
    <!-- 检索相关 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @submit="getDataBy" :form="formBy">
        <a-row :gutter="48">
          <a-col :md="5" :sm="24">
            <a-form-item label="盘点单号：">
              <a-input placeholder="请输入单号" v-decorator="['checkCode']" />
            </a-form-item>
          </a-col>
          <a-col :md="5" :sm="24">
            <a-form-item label="盘库依据：">
              <a-input placeholder="请输入单号" v-decorator="['panKuYiJu']" />
            </a-form-item>
          </a-col>
          <a-col :md="5" :sm="24">
            <a-form-item label="核算科目：">
              <a-select placeholder="核算科目"
                        v-decorator="['heSuanKeMu']">
                <a-select-option v-for="item in orderTypeDic" :key="item" :value="item">
                  {{ item }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="5" :sm="24">
            <a-form-item label="状态">
              <a-select placeholder="请选择" v-decorator="['status']">
                <a-select-option v-for="item in statusDic" :key="item.value" :value="item.value">
                  {{ item.value }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <span class="table-page-search-submitButtons">
              <a-button html-type="submit" type="primary">查询</a-button>
              <a-button style="margin-left: 8px" @click="clearSelectBy">重置</a-button>
              <a-button style="margin-left: 8px" type="primary" @click="addData">新增盘点单</a-button>
              <a-button style="margin-left: 8px" type="primary" @click="callback">一键回传</a-button>
            </span>
          </a-col>
          <a-col :md="24" :sm="24">
            <a-button @click="printInStorageBills" :disabled="this.checkedData==null"
                      v-print="print" type="primary">打印盘点单
            </a-button>
<!--            <div class="uploadContain">-->
<!--              <a-button style="margin-left: 8px" @click="clearSelectBy" type="primary">-->
<!--                导入盘点单-->
<!--              </a-button>-->
<!--              <input class="uploadBtn" type="file" ref="upload" @change="uploadXLSX"-->
<!--                     accept=".xls,.xlsx" />-->
<!--            </div>-->
<!--            <a-button style="margin-left: 8px" @click="ToDoExcel" type="primary">导出盘点单-->
<!--            </a-button>-->
          </a-col>
        </a-row>
      </a-form>
    </div>
    <!-- 表格 -->
    <s-table bordered rowKey="out_order_id" :customRow="customRow" ref="table" size="default"
             :pageSize="5" :columns="columns" :data="loadData">
      <a-tag color="green" slot="status_display_value" slot-scope="text">{{ text }}</a-tag>
      <span slot="createTime" slot-scope="text">{{ text | moment }}</span>
      <span slot="action" slot-scope="text, record">
        <a :disabled="record.status!='草稿'" @click="updateGetValue(record)">编辑</a>
        <a-divider type="vertical" />
        <a href="javascript:;" :disabled="record.status!='草稿'"
           @click="delDataMethod(record,'tableTitle')">删除</a>
        <a-divider type="vertical" />
        <a href="javascript:;" :disabled="record.status!='草稿'" @click="updateStart(record)">开始盘点</a>
        <a-divider type="vertical" />
        <a href="javascript:;" :disabled="record.status!='盘点中'" @click="allotAddress(record)">配盘</a>
      </span>
    </s-table>
    <div>
      <a-button type="primary" @click="addDataDetail" :disabled="outorderStatus!='草稿'">新增盘点明细
      </a-button>
      <span>（选择盘点单数据后才可点击此新增按钮）</span>
    </div>
    <!-- <a-divider /> -->
    <s-table rowKey="out_order_detail_id" bordered ref="detailTable" size="default" :pageSize="5"
             :columns="detailColumns" :data="loadDataDetail">
      <a-tag color="green" slot="status_display_value" slot-scope="text">{{ text }}</a-tag>
      <span slot="createTime" slot-scope="text">{{ text | moment }}</span>
      <span slot="action" slot-scope="text, record">
        <a @click="updatePanDetail(record)" :disabled="record.status!='已配盘'">盘点</a>
        <!--        <a-divider type="vertical" />-->
        <!--        <a @click="updateGetValueDetail(record)" :disabled="outorderStatus!='草稿'">编辑</a>-->
        <a-divider type="vertical" />
        <a href="javascript:;" :disabled="outorderStatus!='草稿'"
           @click="delDataMethod(record,'tableContent')">删除</a>
      </span>
    </s-table>

    <!-- 配盘 -->
    <a-modal title="配盘" style="top: 20px" :width="800" v-model="peipan" @ok="pickPallet">
      <a-form class="permission-form" :form="formPeipan">
        <a-form-item :labelCol="labelCol" hidden :wrapperCol="wrapperCol" label="主键">
          <a-input placeholder="主键" v-decorator="['checkId']" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" hidden :wrapperCol="wrapperCol" label="状态">
          <a-input placeholder="状态" v-decorator="['status']" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" hidden :wrapperCol="wrapperCol" label="库房">
          <a-input placeholder="库房" v-decorator="['warehouseName']" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="盘点单号">
          <a-input placeholder="盘点单号" disabled v-decorator="['checkCode']" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" hidden :wrapperCol="wrapperCol" label="盘库依据">
          <a-input placeholder="盘库依据"
                   v-decorator="['panKuYiJu', { rules: [{ required: true, message: '请输入盘库依据!' }] }]" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" hidden :wrapperCol="wrapperCol" label="核算科目">
          <a-select placeholder="核算科目"
                    v-decorator="['heSuanKeMu',{rules: [{ required: true, message: '请选择核算科目' }]}]">
            <a-select-option v-for="item in orderTypeDic" :key="item" :value="item">
              {{ item }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="拣货口">
          <a-select style="margin-left: 8px;" placeholder="请选择拣货口" showArrow mode="multiple"
                    v-decorator="['jianhuokouArr',{rules: [{ required: true, message: '请选择拣货口' }]}]">
            <a-select-option v-for="item in jianhuokou" :key="item.value" :value="item.value">
              {{ item.text }}
            </a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- 编辑 -->
    <a-modal title="编辑" style="top: 20px" :width="800" v-model="visibleUpdate" @ok="updateSure">
      <a-form class="permission-form" :form="formUpdate">
        <a-form-item :labelCol="labelCol" hidden :wrapperCol="wrapperCol" label="器材编号">
          <a-input placeholder="主键" v-decorator="['checkId']" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="盘点单号">
          <a-input placeholder="盘点单号" disabled v-decorator="['checkCode']" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="盘库依据">
          <a-input placeholder="盘库依据"
                   v-decorator="['panKuYiJu', { rules: [{ required: true, message: '请输入盘库依据!' }] }]" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="核算科目">
          <a-select placeholder="核算科目"
                    v-decorator="['heSuanKeMu',{rules: [{ required: true, message: '请选择核算科目' }]}]">
            <a-select-option v-for="item in orderTypeDic" :key="item" :value="item">
              {{ item }}
            </a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal>
    <!-- 盘点明细 -->
    <a-modal title="盘点" style="top: 20px" :width="800" v-model="panDetail" @ok="updateSureDetail">
      <a-form class="permission-form" :form="formUpdateDetail">
        <a-form-item :labelCol="labelCol" hidden :wrapperCol="wrapperCol" label="盘点单号">
          <a-input placeholder="盘点单号" v-decorator="['checkDetailId']" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" hidden :wrapperCol="wrapperCol" label="盘点单号">
          <a-input placeholder="盘点单号" v-decorator="['checkCode']" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="器材编号">
          <a-input placeholder="器材编号" disabled
                   v-decorator="['materialCode', { rules: [{ required: true, message: '请输入器材编号!' }] }]" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="器材名称">
          <a-input placeholder="器材名称" disabled
                   v-decorator="['materialName', { rules: [{ required: true, message: '请输入器材名称!' }] }]" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="价格">
          <a-input placeholder="价格" disabled
                   v-decorator="['materialPrice', { rules: [{ required: true, message: '请输入价格!' }] }]" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="批次">
          <a-input placeholder="批次" disabled
                   v-decorator="['batch', { rules: [{ required: true, message: '请输入批次!' }] }]" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="库存数量">
          <a-input placeholder="库存数量" disabled
                   v-decorator="['inventoryCount', { rules: [{ required: true, message: '请输入库存数量!' }] }]" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="库存数量">
          <a-input placeholder="盘点数量"
                   v-decorator="['checkCount', { rules: [{ required: true, message: '请输入盘点数量!' }] }]" />
        </a-form-item>
      </a-form>
    </a-modal>
    <!-- 新增出库单 -->
    <a-modal title="新增盘点单" style="top: 20px" :width="800" v-model="visibleAdd" @ok="addDataSure">
      <a-form class="permission-form" :form="formAdd">
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="盘库依据">
          <a-input placeholder="盘库依据"
                   v-decorator="['panKuYiJu', { rules: [{ required: true, validator, message: '请输入盘库依据!' }] }]" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="核算科目">
          <a-select placeholder="核算科目"
                    v-decorator="['heSuanKeMu',{rules: [{  required: true, message: '请选择核算科目' }]}]">
            <a-select-option v-for="item in orderTypeDic" :key="item" :value="item">
              {{ item }}
            </a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal>
    <!-- 新增出库明细 -->
    <a-modal title="新增盘点明细" style="top: 20px" :width="800" v-model="visibleAddDetail"
             @ok="addDataSureDetail">
      <a-form class="permission-form" :form="formAddDetail">
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="出库单号">
          <a-input placeholder="盘点单号" disabled v-decorator="['checkCode']" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="器材编号">
          <a-input placeholder="器材编号" @blur="queryData"
                   v-decorator="['materialCode', { rules: [{ required: true, message: '请输入器材编号!' }] }]" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="器材名称">
          <a-input placeholder="器材名称" disabled
                   v-decorator="['materialName', { rules: [{ required: true, message: '请输入器材名称!' }] }]" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="价格">
          <a-input placeholder="价格" disabled
                   v-decorator="['materialPrice', { rules: [{ required: true, message: '请输入价格!' }] }]" />
        </a-form-item>
        <!--        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="质量等级">-->
        <!--          <a-input placeholder="质量等级" disabled-->
        <!--                   v-decorator="['materialName', { rules: [{ required: true, validator, message: '请输入质量等级!' }] }]" />-->
        <!--        </a-form-item>-->
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="批次">
          <a-input placeholder="批次" disabled
                   v-decorator="['batch', { rules: [{ required: true, message: '请输入批次!' }] }]" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="库存数量">
          <a-input placeholder="库存数量" disabled
                   v-decorator="['inventoryCount', { rules: [{ required: true, message: '请输入库存数量!' }] }]" />
        </a-form-item>
      </a-form>
    </a-modal>
    <!-- 打印出库单弹出框 -->
    <a-modal title="打印盘点单预览" style="top: 20px" :width="800" v-model="visiblePrintView"
             :footer="false">
      <div id="printArea">
        <div :hidden="checkedData==null">
          <div class="printTitle">{{ printTitle }}</div>
          <a-row>
            <a-col class="col1" :push="2" :span="10">物料盘点</a-col>
            <a-col class="col1" :push="4" :span="8">
              条形码:
              <img id="printBarCode" />
            </a-col>
            <a-col :push="2" :span="10">仓库名称：{{ checkedData == null ? '' : checkedData.warehouseName }}</a-col>
            <a-col :push="4" :span="8">制单日期：{{ checkedData == null ? '' : checkedData.createTime }}</a-col>
            <a-col :push="2" :span="10">盘点单号：{{ checkedData == null ? '' : checkedData.checkCode }}
            </a-col>
            <a-col :push="4" :span="8">盘点签字：</a-col>
          </a-row>
          <a-table bordered :columns="printDetailColumns" :pagination="false" id="printTable"
                   :data-source="printData">
          </a-table>
        </div>
        <div :hidden="checkedData!=null">未选择任何数据！</div>
      </div>
    </a-modal>
    <!-- 预览导入excel -->
    <a-modal okText="确认" cancelText="取消" title="预览导入数据" style="top: 20px;" :width="800"
             v-model="visibleImportExcel" @ok="ImportExcelSure" @cancel="ImportExcelCancel">
      <a-table bordered style="overflow-y: auto; height:600px" :columns="columnsImportOutExcel"
               :pagination="false" :data-source="dataImportExcel" rowKey="index">
      </a-table>
    </a-modal>
  </a-card>
</template>

<script>
import pick from 'lodash.pick'
import { STable } from '@/components'
import storage from 'store'
import { getDataBy } from '@/api/OutOrder'
import {
  ImportOutOrderExcel
} from '@/api/OutOrderDetail'
import {
  getPage,
  editCheck,
  saveCheck,
  getPageDetail,
  getMaterial,
  editCheckDetail,
  updateCheck,
  checkDelete,
  deleteCheckDetail,
  saveCheckDetail,
  checkOutPick, callbackUp
} from '@/api/CheckAPI'

import QRCode from 'qrcode'
import JsBarcode from 'jsbarcode'
import * as XLSX from 'xlsx'

// 表头
const columns = [
  {
    title: '盘点单号',
    dataIndex: 'checkCode'
  },
  {
    title: '核算科目',
    dataIndex: 'heSuanKeMu'
  },
  {
    title: '盘库依据',
    dataIndex: 'panKuYiJu'
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
    dataIndex: 'createTime'
  },
  {
    title: '操作',
    width: '240px',
    dataIndex: 'action',
    scopedSlots: { customRender: 'action' }
  }
]

const detailColumns = [
  {
    title: '器材编号',
    dataIndex: 'materialCode'
  },
  {
    title: '器材名称',
    dataIndex: 'materialName'
  },
  {
    title: '批次',
    dataIndex: 'batch'
  },
  {
    title: '库存数量',
    dataIndex: 'inventoryCount'
  },
  {
    title: '盘点数量',
    dataIndex: 'checkCount'
  },
  {
    title: '状态',
    dataIndex: 'status'
  },
  {
    title: '操作',
    width: '110px',
    dataIndex: 'action',
    scopedSlots: { customRender: 'action' }
  }
]
const columnsImportOutExcel = [
  {
    title: '盘点单号',
    dataIndex: 'checkCode'
  },
  {
    title: '仓库名称',
    dataIndex: 'warehouseName'
  },
  {
    title: '器材编号',
    dataIndex: 'materialCode'
  },
  {
    title: '器材名称',
    dataIndex: 'materialName'
  },
  {
    title: '批次',
    dataIndex: 'batch'
  },
  {
    title: '状态',
    dataIndex: 'status'
  },
  {
    title: '库存数量',
    dataIndex: 'inventoryCount'
  },
  {
    title: '盘点数量',
    dataIndex: 'checkCount'
  }
]
const printDetailColumns = [
  {
    title: '盘点单号',
    dataIndex: 'checkCode',
    width: 300
  },
  {
    title: '器材编号',
    dataIndex: 'materialCode',
    width: 300
  },
  {
    title: '器材名称',
    dataIndex: 'materialName',
    width: 300
  },
  {
    title: '批次',
    dataIndex: 'batch',
    width: 300
  },
  {
    title: '状态',
    dataIndex: 'status',
    width: 140
  },
  {
    title: '库存数量',
    dataIndex: 'inventoryCount',
    width: 100
  },
  {
    title: '盘点数量',
    dataIndex: 'checkCount',
    width: 100
  }
]
let storageTypeText = ''
export default {
  name: 'InStorageBills',
  components: {
    STable
  },
  data() {
    return {
      jianhuokouArr: [],
      jianhuokou: [],
      panDetail: false,
      storageName: '',
      visibleImportExcel: false,
      dataImportExcel: '',
      columnsImportOutExcel,
      orderTypeDic: ['上级调拨', '本级自筹'],
      visibleGetGoods: false,
      userInfo: {},
      printTitle: '',
      print: {
        id: 'printArea',
        popTitle: '&nbsp' // 打印配置页上方标题
      },
      // 打印出库单预览弹出框是否显示
      visiblePrintView: false,
      // 添加模态框是否显示
      visibleAdd: false,
      // 更新模态框是否显示
      visibleUpdate: false,
      peipan: false,
      formPeipan: this.$form.createForm(this),
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
      queryParam: { warehouse_name: storageTypeText },
      // 出库明细查询参数
      queryParamDetail: {},
      startTime: '1900-01-01',
      endTime: '3000-01-01',
      dateVar: ['', ''],
      detailStatus: '草稿',
      // 表头
      columns,
      detailColumns,
      printDetailColumns,
      printData: [],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        parameter.startTime = this.startTime
        parameter.endTime = this.endTime
        this.checkedData = null
        this.outorderStatus = null
        this.queryParam.warehouse_name = storageTypeText
        return getPage(parameter, this.queryParam).then(res => {
          this.$refs.table._vnode.elm.querySelectorAll('tr').forEach(item => {
            item.style.background = 'white'
          })
          return res.result
        })
      },
      loadDataDetail: parameter => {
        return getPageDetail(parameter, this.queryParamDetail).then(res => {
          return res.result
        })
      },
      // 状态字典列表
      statusDic: [
        {
          key: 0,
          value: '草稿'
        },
        {
          key: 1,
          value: '盘点中'
        },
        {
          key: 2,
          value: '已完成'
        }
      ],
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
      inventory_count: 0
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
    pickPallet(e) {
      this.peipan = false
      e.preventDefault()
      this.formPeipan.validateFieldsAndScroll((err, values) => {
        if (!err) {
          console.log(values)
          checkOutPick(values, values.jianhuokouArr).then(res => {
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
    // 开始盘点
    updateStart(record) {
      console.log(record)
      record.updater = this.userInfo.user_name
      record.status = '盘点中'
      updateCheck(record).then(res => {
        if (res.status) {
          this.$message.success(res.message)
        } else {
          this.$message.warn(res.message)
        }
        this.$refs.table.refresh(true)
      })
    },
    onChange(date, dateString) {
      this.startTime = dateString[0]
      this.endTime = dateString[1]
      this.dateVar = [this.startTime, this.endTime]
    },
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
            item.udf02,
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
      reader.onload = e => {
        // 读取成功后result中的数据
        const data = e.target.result
        // 以base64方法读取 结果
        const workbook = XLSX.read(data, { type: 'binary' })
        // 获取数据的表名
        const sheetName = workbook.SheetNames[0]
        // workSheet 是该excel表格中的数据
        const sheet = workbook.Sheets[sheetName]

        const excelImport = this.columnsImportOutExcel
        for (const j in sheet) {
          if (j.search('1')) {
            for (let i = 0; i < excelImport.length; i++) {
              if (excelImport[i].title === sheet[j].h) {
                sheet[j].h = excelImport[i].dataIndex
                sheet[j].v = excelImport[i].dataIndex
                sheet[j].w = excelImport[i].dataIndex
              }
            }
          }
        }

        // 数据解析,输出JSON格式
        const jsonData = XLSX.utils.sheet_to_json(sheet, { defval: '' })
        this.dataImportExcel = jsonData
        this.visibleImportExcel = true
      }
      reader.readAsBinaryString(file)
    },
    ImportExcelSure() {
      console.log(this.dataImportExcel)
      for (let i = 0; i < this.dataImportExcel.length; i++) {
        for (const key in this.dataImportExcel[i]) {
          if (key === '创建人' || key === '创建时间' || key === '更新人' || key === '更新时间') {
            delete this.dataImportExcel[i][key]
            continue
          }
          if (key === 'warehouse_name') {
            if (this.dataImportExcel[i][key] !== this.storageName) {
              console.log(this.dataImportExcel[i][key], this.storageName)
              this.$message.warn('第' + (i + 1) + '行,库名称与当前库不相符！', 15)
              return
            }
          }
          if (this.dataImportExcel[i][key] === '') {
            this.$message.warn('第' + (i + 1) + '行,第' + key + '列不能为空！', 15)
            return
          }
        }
        if (isNaN(Number(this.dataImportExcel[i].order_count))) {
          this.$message.warn('第' + (i + 1) + '行' + '订单数量必须为数字！', 15)
          return
        }
        if (isNaN(Number(this.dataImportExcel[i].actual_count))) {
          this.$message.warn('第' + (i + 1) + '行' + '收货数量必须为数字！', 15)
          return
        }
        if (isNaN(Number(this.dataImportExcel[i].material_price))) {
          this.$message.warn('第' + (i + 1) + '行' + '单价必须为数字！', 15)
          return
        }
      }
      ImportOutOrderExcel(this.dataImportExcel).then(res => {
        this.$message.success(res.message)
        this.$refs.table.refresh(true)
      })
      this.$refs.upload.value = ''
      this.visibleImportExcel = false
    },
    ImportExcelCancel() {
      this.$refs.upload.value = ''
      this.visibleImportExcel = false
    },
    // 点击出库单行
    customRow(record, index) {
      return {
        on: {
          // 鼠标单击行
          click: event => {
            // 取到点击行的数据并取到出库明细
            this.queryParamDetail = { checkCode: record.checkCode }
            this.$refs.detailTable.refresh(true)
            // 点击出库单给其行设置高亮颜色
            event.currentTarget.parentNode.querySelectorAll('tr').forEach(item => {
              item.style.background = 'white'
            })
            this.checkedData = record

            this.outorderStatus = record.status
            event.currentTarget.style.background = '#e6f7ff'
            getPageDetail({
              pageNo: 1,
              pageSize: 9999999
            }, { checkCode: this.checkedData.checkCode }).then(res => {
              this.printData = res.result.anything
              console.log(this.printData)
            })
          }
        }
      }
    },
    // 明细编辑按钮取值给模态框
    updateGetValueDetail(record) {
      console.log(record)
      this.detailStatus = record.status
      this.visibleUpdateDetail = true
      this.panDetail = false
      this.$nextTick(() => {
        setTimeout(() => {
          this.formUpdateDetail.setFieldsValue(record)
        })
      })
    },
    // 盘点明细按钮
    updatePanDetail(record) {
      this.detailStatus = record.status
      this.visibleUpdateDetail = false
      this.panDetail = true
      this.$nextTick(() => {
        this.formUpdateDetail.setFieldsValue(pick(record, ['checkDetailId', 'checkCode', 'materialCode', 'materialName', 'materialPrice', 'batch', 'inventoryCount', 'checkCount']))
      })
    },

    allotAddress(record) {
      this.peipan = true
      this.$nextTick(() => {
        this.formPeipan.setFieldsValue(record)
      })
    },
    // 明细确定更新数据
    updateSureDetail(e) {
      e.preventDefault()
      this.formUpdateDetail.validateFields((err, values) => {
        console.log(!err)
        if (!err) {
          // values.updater = this.userInfo.user_name
          editCheckDetail(values).then(res => {
            console.log(res)
            if (res.status) {
              this.$message.success(res.message)
            } else {
              this.$message.warn(res.message)
            }
            this.$refs.detailTable.refresh(true)
            this.visibleUpdateDetail = false
            this.panDetail = false
          })
        }
      })
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
      this.startTime = '1900-01-01'
      this.endTime = '3000-01-01'
      this.dateVar = ['', '']
      this.queryParam = { checkCode: '', heSuanKeMu: '', panKuYiJu: '', status: '' }
      this.formBy.setFieldsValue(pick(this.queryParam, ['checkCode', 'status', 'heSuanKeMu', 'panKuYiJu']))
      this.$refs.table.refresh(true)
    },

    // 新增出库明细按钮点击事件
    addDataDetail(e) {
      if (this.checkedData === null) {
        this.$message.info('请先选择一个出库单！')
        return
      }
      this.visibleAddDetail = true
      this.$nextTick(() => {
        this.formAddDetail.setFieldsValue(pick(this.checkedData, ['checkCode']))
      })
    },
    // 确认新增出库明细点击事件
    addDataSureDetail(e) {
      e.preventDefault()
      console.log('!err', e)
      this.formAddDetail.validateFields((err, values) => {
        console.log('values', values)
        if (!err) {
          values.creator = this.userInfo.user_name
          const promise = new Promise((resolve, reject) => {
            const materialCode = this.formAddDetail.getFieldValue('materialCode')
            const checkCode = this.formAddDetail.getFieldValue('checkCode')
            // console.log(orderIdTemp)
            getPageDetail(
              { pageNo: 1, pageSize: 1, startTime: '1900-01-01', endTime: '3000-01-01' },
              { materialCode: materialCode, checkCode: checkCode }
            ).then(res => {
              resolve(res)
            })
          })
          promise.then(res => {
            if (res.result.totalCount === 0) {
              values.creator = this.userInfo.user_name
              saveCheckDetail(values).then(res => {
                this.visibleAddDetail = false
                if (res.status) {
                  this.$refs.detailTable.refresh(true)
                  this.$message.success(res.message)
                  this.formAddDetail.resetFields()
                } else {
                  this.$message.warn(res.message)
                }
              })
            } else {
              this.$message.warn('该盘点单此物料已存在！')
            }
          })
        }
      })
    },

    // 新增按钮点击事件
    addData(e) {
      this.visibleAdd = true
    },
    callback() {
      callbackUp().then(res => {
        if (res.status) {
          this.$refs.table.refresh(true)
          this.$message.success(res.message)
        } else {
          this.$message.warn(res.message)
        }
      })
    },
    // 确认新增点击事件
    addDataSure(e) {
      e.preventDefault()
      this.formAdd.validateFields((err, values) => {
        if (!err) {
          values.creator = this.userInfo.user_name
          values.warehouseName = this.storageName
          console.log(values)
          saveCheck(values).then(res => {
            console.log(res)
            this.visibleAdd = false
            if (res.status) {
              this.$refs.table.refresh(true)
              this.$message.success(res.message)
              this.formAdd.resetFields()
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
      this.$nextTick(() => {
        this.formUpdate.setFieldsValue(record)
      })
    },
    // 确定更新数据
    updateSure(e) {
      this.visibleUpdate = false
      e.preventDefault()
      this.formUpdate.validateFieldsAndScroll((err, values) => {
        if (!err) {
          console.log('values: ', values)
          values.updater = this.userInfo.user_name
          editCheck(values).then(res => {
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
    queryData(e) {
      e.preventDefault()
      const materialCodeTemp = this.formAddDetail.getFieldValue('materialCode')
      getMaterial({ materialCode: materialCodeTemp, warehouseName: this.storageName }).then(res => {
        if (res.status) {
          console.log(res)
          this.$nextTick(() => {
            this.formAddDetail.setFieldsValue(pick(res.result[0], ['materialName', 'materialPrice', 'batch', 'inventoryCount']))
          })
        } else {
          this.$nextTick(() => {
            this.formAddDetail.setFieldsValue(
              pick(
                {
                  materialName: '',
                  materialPrice: '',
                  batch: '',
                  inventoryCount: ''
                },
                ['materialName', 'materialPrice', 'batch', 'inventoryCount']
              )
            )
          })
          this.$message.warn(res.message)
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
              temp = { checkCode: record.checkCode }
              checkDelete(temp).then(res => {
                if (res.status) {
                  _this.$refs.table.refresh(true)
                  _this.$message.success(res.message)
                } else {
                  _this.$message.warn(res.message)
                }
              })
              break
            case 'tableContent':
              temp = { checkDetailId: record.checkDetailId }
              deleteCheckDetail(temp).then(res => {
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
    // 打印出库单按钮点击事件
    printInStorageBills() {
      if (this.checkedData.status !== '已配盘') {
        this.$message.warn('请选择已配盘的单据!')
        return
      }
      this.visiblePrintView = true
      this.printTitle = '盘点单'
      this.$nextTick(() => {
        // 待生成条码的内容
        JsBarcode('#printBarCode', this.checkedData.checkCode, {
          // 选择要使用的条形码类型
          format: 'CODE128',
          // 设置条之间的宽度
          width: 2,
          // 高度
          height: 40,
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
        this.printData.forEach((item, index) => {
          const materialCode = (item.materialCode + '_' + item.materialName + '_' + item.batch + '_' + item.inventoryCount).toString()
          const opts = {
            errorCorrectionLevel: 'H', // 容错级别
            type: 'image/png', // 生成的二维码类型
            quality: 0.3, // 二维码质量
            margin: 1, // 二维码留白边距
            width: 1, // 宽
            height: 1, // 高
            text: materialCode, // 二维码内容
            color: {
              dark: '#333333', // 前景色
              light: '#fff' // 背景色
            }
          }
          const canvas = document.querySelectorAll('.materialCodeTu')
          // 将获取到的数据（val）画到msg（canvas）上
          QRCode.toCanvas(canvas[index], materialCode, opts, res => {
            console.log(res)
          })
        })
      })
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
    this.userInfo = storage.get('userInfo')
    this.storageName = storage.get('storageTypeText')
    storageTypeText = storage.get('storageTypeText')
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
<style media="print">
#printTable {
  font-size: 25px !important;
}
</style>
