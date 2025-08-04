<template>
  <a-card :bordered="false">
    <!-- 检索相关 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @submit="getDataBy" :form="formBy">
        <a-row :gutter="48">
          <a-col :md="5" :sm="24">
            <a-form-item label="单号：">
              <a-input placeholder="请输入单号" v-decorator="['in_order_id']" />
            </a-form-item>
          </a-col>
          <a-col :md="5" :sm="24">
            <a-form-item label="车牌号：">
              <a-input placeholder="请输入单号" v-decorator="['car_no']" />
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
              <a-button style="margin-left: 8px" type="primary" @click="addData">新增入库单</a-button>
            </span>
          </a-col>
          <a-col :md="24" :sm="24">
            <!-- <a-button @click="clearSelectBy" type="primary">生成入库单</a-button> -->
            <a-button @click="printInStorageBills" :disabled="this.checkedData==null"
              v-print="print" type="primary">打印入库单</a-button>
            <!-- <a-button @click="printInStorageBills" :disabled="this.checkedData==null"
              type="primary">打印入库单</a-button> -->

            <div class="uploadContain">
              <a-button style="margin-left: 8px" @click="clearSelectBy" type="primary">
                导入入库单
              </a-button>
              <input class="uploadBtn" type="file" ref="upload" @change="uploadXLSX"
                accept=".xls,.xlsx" />
            </div>
            <a-button style="margin-left: 8px" @click="ToDoExcel" type="primary">导出入库单
            </a-button>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <!-- 表格 -->
    <s-table bordered rowKey="in_order_id" :customRow="customRow" ref="table" size="default"
      :pageSize="5" :columns="columns" :data="loadData">
      <a-tag color="green" slot="status_display_value" slot-scope="text">{{ text }}</a-tag>
      <span slot="createTime" slot-scope="text">{{ text | moment }}</span>
      <span slot="action" slot-scope="text, record">
        <a :disabled="record.status!='创建中'" @click="updateGetValue(record)">编辑</a>
        <a-divider type="vertical" />
        <a href="javascript:;" :disabled="record.status!='创建中'"
          @click="delDataMethod(record,'tableTitle')">删除</a>
        <a-divider type="vertical" />
        <a href="javascript:;" :disabled="record.status!='创建中'" @click="submitStatus(record)">提交</a>
      </span>
    </s-table>
    <div>
      <a-button type="primary" @click="addDataDetail" :disabled="inorderStatus!='创建中'">新增入库明细
      </a-button>
      <span>（选择入库单数据后才可点击此新增按钮）</span>
    </div>
    <!-- <a-divider /> -->
    <s-table rowKey="in_order_detail_id" bordered ref="detailTable" size="default" :pageSize="5"
      :columns="detailColumns" :data="loadDataDetail">
      <a-tag color="green" slot="status_display_value" slot-scope="text">{{ text }}</a-tag>
      <span slot="createTime" slot-scope="text">{{ text | moment }}</span>
      <span slot="action" slot-scope="text, record">
        <a @click="updateGetValueDetail(record)" :disabled="inorderStatus!='创建中'">编辑</a>
        <a-divider type="vertical" />
        <a href="javascript:;" :disabled="inorderStatus!='创建中'"
          @click="delDataMethod(record,'tableContent')">删除</a>
        <!-- <a-divider type="vertical" /> -->
        <!-- <a href="javascript:;" :disabled="record.actual_count===0"
          @click="cancelGetGoods(record,'tableContent')">取消收货</a>
        <a-divider type="vertical" />
        <a href="javascript:;"
          :disabled="inorderStatus=='创建'||inorderStatus=='收货完成'||record.order_count <record.actual_count||record.order_count ==record.actual_count"
          @click="getGoods(record,'tableContent')">收货</a> -->
      </span>
    </s-table>

    <!-- 编辑 -->
    <a-modal title="编辑" style="top: 20px" :width="800" v-model="visibleUpdate" @ok="updateSure">
      <a-form class="permission-form" :form="formUpdate">
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="入库单号">
          <a-input placeholder="入库单号" disabled
            v-decorator="['in_order_id', { rules: [{ required: true, validator, message: '请输入入库单号!' }] }]" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="订单类型">
          <a-select placeholder="请选择"
            v-decorator="['order_type', { rules: [{ required: true, validator, message: '请选择订单类型!' }] }]">
            <a-select-option v-for="item in orderTypeDic" :key="item" :value="item">
              {{ item }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="车牌号">
          <a-input placeholder="车牌号"
            v-decorator="['car_no', { rules: [{ required: true, validator, message: '请输入车牌号!' }] }]" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="原始单号">
          <a-input placeholder="原始单号"
            v-decorator="['org_order', { rules: [{ required: true, validator, message: '请输入原始单号!' }] }]" />
        </a-form-item>

        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="核算科目">
          <a-input placeholder="核算科目"
            v-decorator="['hesuankemu', { rules: [{ required: true, validator, message: '请输入核算科目!' }] }]" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="库房号">
          <a-input placeholder="库房号"
            v-decorator="['kufangmingcheng', { rules: [{ required: true, validator, message: '请输入库房号!' }] }]" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="发物单位">
          <a-input placeholder="发物单位"
            v-decorator="['fawudanwei', { rules: [{ required: true, validator, message: '请输入发物单位!' }] }]" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="合同编号">
          <a-input placeholder="合同编号"
            v-decorator="['hetongbianhao', { rules: [{ required: true, validator, message: '请输入合同编号!' }] }]" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="调拨单号">
          <a-input placeholder="调拨单号"
            v-decorator="['diaobodanhao', { rules: [{ required: true, validator, message: '请输入调拨单号!' }] }]" />
        </a-form-item>
        <!-- <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="单据状态">
          <a-select v-decorator="['status', { initialValue: 2 }]">
            <a-select-option v-for="item in statusDic" :key="item" :value="item">
              {{ item }}
            </a-select-option>
          </a-select>
        </a-form-item> -->
      </a-form>
    </a-modal>
    <!-- 编辑明细 -->
    <a-modal title="编辑" style="top: 20px" :width="800" v-model="visibleUpdateDetail"
      @ok="updateSureDetail">
      <a-form class="permission-form" :form="formUpdateDetail">
        <a-form-item hidden :labelCol="labelCol" :wrapperCol="wrapperCol" label="入库明细单号">
          <a-input placeholder="入库明细单号" v-decorator="['in_order_detail_id']" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="入库单号">
          <a-input placeholder="入库单号" disabled v-decorator="['in_order_id']" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="订单数量">
          <a-input placeholder="订单数量" @blur="testInt"
            v-decorator="['order_count', { rules: [{ required: true, message: '请输入订单数量!' }] }]" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="器材编号">
          <a-input placeholder="器材编号" disabled v-decorator="['material_code']" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="旧器材编号">
          <a-input placeholder="旧器材编号" disabled v-decorator="['udf02']" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="器材名称">
          <a-input placeholder="器材名称" disabled v-decorator="['material_name']" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="批号">
          <a-input placeholder="批号"
            v-decorator="['batch', { rules: [{ required: true, validator, message: '请输入批号' }] }]" />
        </a-form-item>

      </a-form>
    </a-modal>
    <!-- 新增入库单 -->
    <a-modal title="新增入库单" style="top: 20px" :width="800" v-model="visibleAdd" @ok="addDataSure">
      <a-form class="permission-form" :form="formAdd">
        <!-- <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="入库单号">
          <a-input placeholder="入库单号" disabled
            v-decorator="['in_order_id', { rules: [{ required: true, validator, message: '请输入入库单号!' }] }]" />
        </a-form-item> -->
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="订单类型">
          <a-select placeholder="请选择"
            v-decorator="['order_type', { rules: [{ required: true, validator, message: '请选择订单类型!' }] }]">
            <a-select-option v-for="item in orderTypeDic" :key="item" :value="item">
              {{ item }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="车牌号">
          <a-input placeholder="车牌号"
            v-decorator="['car_no', { rules: [{ required: true, validator, message: '请输入车牌号!' }] }]" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="原始单号">
          <a-input placeholder="原始单号"
            v-decorator="['org_order', { rules: [{ required: true, validator, message: '请输入原始单号!' }] }]" />
        </a-form-item>

        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="核算科目">
          <a-input placeholder="核算科目"
            v-decorator="['hesuankemu', { rules: [{ required: true, validator, message: '请输入核算科目!' }] }]" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="库房号">
          <a-input placeholder="库房号"
            v-decorator="['kufangmingcheng', { rules: [{ required: true, validator, message: '请输入库房号!' }] }]" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="发物单位">
          <a-input placeholder="发物单位"
            v-decorator="['fawudanwei', { rules: [{ required: true, validator, message: '请输入发物单位!' }] }]" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="合同编号">
          <a-input placeholder="合同编号"
            v-decorator="['hetongbianhao', { rules: [{ required: true, validator, message: '请输入合同编号!' }] }]" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="调拨单号">
          <a-input placeholder="调拨单号"
            v-decorator="['diaobodanhao', { rules: [{ required: true, validator, message: '请输入调拨单号!' }] }]" />
        </a-form-item>
        <!-- <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="单据状态">
          <a-select v-decorator="['status', { initialValue: 2 }]">
            <a-select-option v-for="item in statusDic"
              :key="item" :value="item">
              {{ item }}
            </a-select-option>
          </a-select>
        </a-form-item> -->
      </a-form>
    </a-modal>
    <!-- 新增入库明细 -->
    <a-modal title="新增入库明细" style="top: 20px" :width="800" v-model="visibleAddDetail"
      @ok="addDataSureDetail">
      <a-form class="permission-form" :form="formAddDetail">
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="入库单号">
          <a-input placeholder="入库单号" disabled
            v-decorator="['in_order_id', { rules: [{ required: true, validator}] }]" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="订单数量">
          <a-input placeholder="订单数量" type="number" @blur="testInt"
            v-decorator="['order_count', { rules: [{ required: true,message: '订单数量不正确'}] }]" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="器材编号">
          <a-input placeholder="器材编号" @blur="queryData"
            v-decorator="['material_code', { rules: [{ required: true, validator}] }]" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="旧器材编号">
          <a-input placeholder="旧器材编号" disabled v-decorator="['udf02']" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="器材名称">
          <a-input placeholder="器材名称" disabled
            v-decorator="['material_name', { rules: [{ required: true, validator}] }]" />
        </a-form-item>
        <!-- <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="单价">
          <a-input placeholder="单价" disabled
            v-decorator="['material_price', { rules: [{ required: true, validator}] }]" />
        </a-form-item> -->
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="质量等级">
          <a-input placeholder="质量等级"
            v-decorator="['zhiliangdengji', { rules: [{ required: true, validator}] }]" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="批号">
          <a-input placeholder="批号"
            v-decorator="['batch', { rules: [{ required: true, validator}] }]" />
        </a-form-item>

        <!-- <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="托盘编号">
          <a-input placeholder="托盘编号"
            v-decorator="['pallet', { rules: [{ required: true, validator, message: '请输入托盘编号!' }] }]" />
        </a-form-item> -->
        <!-- <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="明细状态">
          <a-select v-decorator="['status', { initialValue: 2 }]">
            <a-select-option v-for="item in statusDic"
              :key="item" :value="item">
              {{ item }}
            </a-select-option>
          </a-select>
        </a-form-item> -->
      </a-form>
    </a-modal>

    <!-- 打印入库单弹出框 -->
    <a-modal title="打印入库单预览" style="top: 20px" v-model="visiblePrintView" :footer="false">
      <div id="printArea">
        <div :hidden="checkedData==null">
          <div class="printTitle">{{ printTitle }}</div>
          <a-row>
            <a-col class="col1" :push="2" :span="10">到货通知单：DH202300001</a-col>
            <a-col class="col1" :push="4" :span="8">
              条形码:
              <img id="printBarCode" />
            </a-col>
            <a-col :push="2" :span="10">物料单位：个</a-col>
            <a-col :push="4"
              :span="8">制单日期：{{ checkedData==null?'':checkedData.create_time }}</a-col>
            <a-col :push="2" :span="10">收货单号：{{ checkedData==null?'':checkedData.in_order_id }}
            </a-col>
            <a-col :push="4" :span="8">收货签字：</a-col>
          </a-row>
          <a-table bordered :columns="printDetailColumns" rowKey="printInStorageBills"
            :pagination="false" :data-source="printData">
          </a-table>
        </div>
        <div :hidden="checkedData!=null">未选择任何数据！</div>
      </div>
    </a-modal>
    <!-- 预览导入excel -->
    <a-modal okText="确认" cancelText="取消" title="预览导入数据" style="top: 20px;" :width="800"
      v-model="visibleImportExcel" @ok="ImportExcelSure" @cancel="ImportExcelCancel">
      <a-table bordered style="overflow-y: auto; height:600px" :columns="columnsImportInExcel"
        :pagination="false" :data-source="dataImportExcel" rowKey="index">
      </a-table>
    </a-modal>
  </a-card>
</template>

<script>
import pick from 'lodash.pick'
import { STable } from '@/components'
import storage from 'store'
import { getDataBy, updateData, delData, addData, submitStatus } from '@/api/InOrder'
import { getDataByDetail, addDataDetail, delDataDetail, updateDataDetail, ImportInOrderExcel } from '@/api/InOrderDetail'
// import { addDataInventory, cancelReceiveMaterial } from '@/api/Inventory'
import { getDropDownListBy } from '@/api/global'
import { getMaterialBy } from '@/api/BaseMaterial'
// import QRCode from 'qrcode'
// import { h } from 'vue'
import JsBarcode from 'jsbarcode'
import * as XLSX from 'xlsx'

// 表头
const columns = [
  {
    title: '入库单号',
    dataIndex: 'in_order_id'
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
    title: '库名',
    dataIndex: 'warehouse_name'
  },
  {
    title: '状态',
    dataIndex: 'status'
  },
  {
    title: '核算科目',
    dataIndex: 'hesuankemu',
    width: 100
  },
  {
    title: '库房号',
    dataIndex: 'kufangmingcheng',
    width: 100
  },
  {
    title: '发物单位',
    dataIndex: 'fawudanwei',
    width: 100
  },
  {
    title: '合同编号',
    dataIndex: 'hetongbianhao',
    width: 100
  },
  {
    title: '调拨单号',
    dataIndex: 'diaobodanhao',
    width: 100
  },
  // {
  //   title: '状态',
  //   dataIndex: 'status_display_value',
  //   scopedSlots: { customRender: 'status_display_value' }
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
    title: '操作',
    width: '160px',
    dataIndex: 'action',
    scopedSlots: { customRender: 'action' }
  }
]

const detailColumns = [
  {
    title: '入库单明细ID',
    dataIndex: 'in_order_detail_id'
  },
  {
    title: '订单数量',
    dataIndex: 'order_count'
  },
  {
    title: '收货数量',
    dataIndex: 'actual_count'
  },
  {
    title: '器材编号',
    dataIndex: 'material_code'
  },
  {
    title: '旧器材编号',
    dataIndex: 'udf02'
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
    title: '单价',
    dataIndex: 'material_price'
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
  },
  {
    title: '操作',
    width: '110px',
    dataIndex: 'action',
    scopedSlots: { customRender: 'action' }
  }
]
const columnsImportExcel = [
  {
    title: '入库单号',
    dataIndex: 'in_order_id'
  },
  {
    title: '仓库名称',
    dataIndex: 'warehouse_name'
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
    dataIndex: 'org_order',
    width: 100
  },
  {
    title: '核算科目',
    dataIndex: 'hesuankemu',
    width: 100
  },
  {
    title: '库房号',
    dataIndex: 'kufangmingcheng',
    width: 100
  },
  {
    title: '发物单位',
    dataIndex: 'fawudanwei',
    width: 100
  },
  {
    title: '合同编号',
    dataIndex: 'hetongbianhao',
    width: 100
  },
  {
    title: '调拨单号',
    dataIndex: 'diaobodanhao',
    width: 100
  },

  {
    title: '器材编号',
    dataIndex: 'material_code',
    width: 100
  },
  {
    title: '旧器材编号',
    dataIndex: 'udf02'
  },
  {
    title: '器材名称',
    dataIndex: 'material_name',
    width: 100
  },

  {
    title: '订单数量',
    dataIndex: 'order_count'
  },
  {
    title: '收货数量',
    dataIndex: 'actual_count'
  },
  {
    title: '批号',
    dataIndex: 'batch'
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
  },

  {
    title: '单价',
    dataIndex: 'material_price'
  },
  {
    title: '质量等级',
    dataIndex: 'zhiliangdengji'
  }
]
const columnsImportInExcel = [
  {
    title: '入库单号',
    dataIndex: 'in_order_id'
  },
  {
    title: '仓库名称',
    dataIndex: 'warehouse_name'
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
    dataIndex: 'org_order',
    width: 100
  },
  {
    title: '核算科目',
    dataIndex: 'hesuankemu',
    width: 100
  },
  {
    title: '库房号',
    dataIndex: 'kufangmingcheng',
    width: 100
  },
  {
    title: '发物单位',
    dataIndex: 'fawudanwei',
    width: 100
  },
  {
    title: '合同编号',
    dataIndex: 'hetongbianhao',
    width: 100
  },
  {
    title: '调拨单号',
    dataIndex: 'diaobodanhao',
    width: 100
  },

  {
    title: '器材编号',
    dataIndex: 'material_code',
    width: 100
  },
  {
    title: '旧器材编号',
    dataIndex: 'udf02'
  },
  {
    title: '器材名称',
    dataIndex: 'material_name',
    width: 100
  },

  {
    title: '订单数量',
    dataIndex: 'order_count'
  },
  // {
  //   title: '收货数量',
  //   dataIndex: 'actual_count'
  // },
  {
    title: '批号',
    dataIndex: 'batch'
  },
  {
    title: '单价',
    dataIndex: 'material_price'
  },
  {
    title: '质量等级',
    dataIndex: 'zhiliangdengji'
  }
]
const printDetailColumns = [
  {
    title: '入库单明细ID',
    dataIndex: 'in_order_detail_id'
  },
  {
    title: '订单数量',
    dataIndex: 'order_count'
  },
  {
    title: '收货数量',
    dataIndex: 'actual_count'
  },
  {
    title: '器材编号',
    dataIndex: 'material_code'
  },
  {
    title: '旧器材编号',
    dataIndex: 'udf02'
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
    title: '单价',
    dataIndex: 'material_price'
  },
  // {
  //   title: '质量等级',
  //   dataIndex: 'zhiliangdengji'
  // },
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
  // {
  //   title: '编码',
  //   dataIndex: 'materialCodeTu',
  //   align: 'left',
  //   customRender: (value, row, index) => {
  //     return {
  //       children: h('canvas', { class: { materialCodeTu: true } })
  //     }
  //   }
  // }
]
let storageTypeText = ''
export default {
  name: 'InStorageBills',
  components: {
    STable
  },
  data() {
    return {
      storageName: '',
      visibleImportExcel: false,
      dataImportExcel: '',
      // visibleCancelGetGoods: false,
      visibleGetGoods: false,
      printTitle: '',
      print: {
        id: 'printArea',
        popTitle: '&nbsp' // 打印配置页上方标题
      },
      // 打印入库单预览弹出框是否显示
      visiblePrintView: false,
      columnsImportExcel,
      columnsImportInExcel,
      // 添加模态框是否显示
      visibleAdd: false,
      // 更新模态框是否显示
      visibleUpdate: false,
      // formCancelGetGoods: this.$form.createForm(this),
      formGetGoods: this.$form.createForm(this),
      // 打印入库单form
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
      // 入库单查询参数
      queryParam: { warehouse_name: storageTypeText },
      // 入库明细查询参数
      queryParamDetail: {},
      startTime: '1900-01-01',
      endTime: '3000-01-01',
      dateVar: ['', ''],
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
        this.inorderStatus = null
        this.queryParam.warehouse_name = storageTypeText
        this.queryParamDetail = { in_order_id: '就是让你查不到' }
        console.log(this.queryParam)
        return getDataBy(parameter, this.queryParam).then(res => {
          console.log(res)
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
      inorderStatus: null,
      visibleUpdateDetail: false,
      order_count: 0,
      inventory_count: 0,
      orderTypeDic: []
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
    // cancelGetGoods(record) {
    //   this.visibleCancelGetGoods = true
    //   this.$nextTick(() => {
    //     this.formCancelGetGoods.setFieldsValue(
    //       pick(record, ['in_order_id', 'in_order_detail_id', 'material_name', 'material_code', 'batch', 'actual_count'])
    //     )
    //   })
    // },
    // getGoodsCancelSure(e) {
    //   e.preventDefault()
    //   this.formCancelGetGoods.validateFields((err, values) => {
    //     if (!err) {
    //       cancelReceiveMaterial(values).then(res => {
    //         if (res.status) {
    //           console.log(res)
    //           this.visibleCancelGetGoods = false
    //           this.$refs.detailTable.refresh(true)
    //         } else {
    //           this.visibleCancelGetGoods = false
    //           this.$message.warn(res.message)
    //         }
    //       })
    //     }
    //   })
    // },
    testInt() {
      const orderCount = this.formAddDetail.getFieldValue('order_count')
      if (orderCount < 0 || orderCount === undefined || orderCount % 1 !== 0) {
        this.formAddDetail.setFields({
          order_count: { value: '', errors: [{ message: '请输入正整数', field: 'order_count' }] }
        })
      }
    },
    // test_cancel_count(e) {
    //   const cancelQty = this.formCancelGetGoods.getFieldValue('cancelQty')
    //   const actualCount = this.formCancelGetGoods.getFieldValue('actual_count')
    //   if (Number(cancelQty) > actualCount) {
    //     this.formCancelGetGoods.setFields({
    //       cancelQty: { value: '', errors: [{ message: '取消数量不能大于订单数量！', field: 'cancelQty' }] }
    //     })
    //   }
    // },
    test_inventory_count(e) {
      this.formGetGoods.validateFields((err, values) => {
        if (!err) {
          if (Number(values.inventory_count) + this.inventory_count > this.order_count) {
            this.formGetGoods.setFields({
              inventory_count: { value: '', errors: [{ message: '收货数量不能大于待收数量！', field: 'inventory_count' }] }
            })
          }
        }
      })
    },
    getGoods(record) {
      this.visibleGetGoods = true
      this.order_count = record.order_count
      this.inventory_count = record.actual_count
      record.order_count_temp = this.order_count - record.actual_count
      record.inventory_count = 0
      this.$nextTick(() => {
        this.formGetGoods.setFieldsValue(
          pick(record, ['in_order_id', 'material_name', 'material_code', 'batch', 'order_count_temp', 'inventory_count'])
        )
      })
    },
    // getGoodsSure(e) {
    //   e.preventDefault()
    //   this.formGetGoods.validateFields((err, values) => {
    //     if (!err) {
    //       values.location_code = values.pallet_code
    //       addDataInventory(values).then(res => {
    //         if (res.status) {
    //           console.log(res)
    //           this.visibleGetGoods = false
    //           this.$refs.detailTable.refresh(true)
    //           this.$message.success(res.message)
    //         } else {
    //           this.visibleGetGoods = false
    //           this.$message.warn(res.message)
    //         }
    //       })
    //     }
    //   })
    // },
    queryData() {
      const materialCodeTemp = this.formAddDetail.getFieldValue('material_code')
      getMaterialBy({ pageNo: 1, pageSize: 1, startTime: '1900-01-01', endTime: '3000-01-01' }, { material_code: materialCodeTemp }).then(res => {
        if (res.status) {
          console.log(res)
          this.$nextTick(() => {
            res.result.anything[0].udf02 = res.result.anything[0].org_material_code
            this.formAddDetail.setFieldsValue(pick(res.result.anything[0], ['material_name', 'material_price', 'zhiliangdengji', 'udf02']))
          })
        } else {
          this.$message.warn(res.message)
        }
      })
    },
    // 新增入库单生辰入库单号
    // create_in_order_id() {
    //   createInOrderId().then(res => {
    //     console.log(res)
    //     if (res.status) {
    //       this.formAdd.setFieldsValue(pick({ in_order_id: res.result }, ['in_order_id']))
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
            item.in_order_id,
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
        this.$ToDoExcel(`入库单`, this.titleArr, arr)
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

        const excelImport = this.columnsImportInExcel
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
        // if (isNaN(Number(this.dataImportExcel[i].actual_count))) {
        //   this.$message.warn('第' + (i + 1) + '行' + '收货数量必须为数字！', 15)
        //   return
        // }
        if (isNaN(Number(this.dataImportExcel[i].material_price))) {
          this.$message.warn('第' + (i + 1) + '行' + '单价必须为数字！', 15)
          return
        }
      }
      ImportInOrderExcel(this.dataImportExcel).then(res => {
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
    // 处理excel导入的数据
    // handleData(data) {

    // },
    submitStatus(record) {
      record.status = '待审核'
      submitStatus(record).then(res => {
        if (res.status) {
          this.$message.success(res.message)
          this.$refs.table.refresh(true)
        } else {
          this.$message.warn(res.message)
        }
      })
    },
    // 点击入库单行
    customRow(record, index) {
      return {
        on: {
          // 鼠标单击行
          click: event => {
            // 取到点击行的数据并取到入库明细
            this.queryParamDetail = { in_order_id: record.in_order_id }
            this.$refs.detailTable.refresh(true)
            // 点击入库单给其行设置高亮颜色
            event.currentTarget.parentNode.querySelectorAll('tr').forEach(item => {
              item.style.background = 'white'
            })
            this.checkedData = record
            this.inorderStatus = record.status
            event.currentTarget.style.background = '#e6f7ff'
            getDataByDetail({ pageNo: 1, pageSize: 9999999 }, { in_order_id: this.checkedData.in_order_id }).then(res => {
              console.log(res)
              this.printData = res.result.anything
            })
          }
        }
      }
    },
    onChange(date, dateString) {
      this.startTime = dateString[0]
      this.endTime = dateString[1]
      this.dateVar = [this.startTime, this.endTime]
      // console.log(date, string)
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
      this.queryParam = { in_order_id: '', status: '', car_no: '' }
      this.formBy.setFieldsValue(pick(this.queryParam, ['in_order_id', 'status', 'car_no']))
      this.$refs.table.refresh(true)
    },

    // 新增入库明细按钮点击事件
    addDataDetail(e) {
      if (this.checkedData === null) {
        this.$message.info('请先选择一个入库单！')
        return
      }
      this.visibleAddDetail = true
      this.formAddDetail.resetFields()
      setTimeout(() => {
        this.formAddDetail.setFieldsValue(pick(this.checkedData, ['in_order_id']))
      }, 1000)
    },
    // 确认新增入库明细点击事件
    addDataSureDetail(e) {
      e.preventDefault()
      this.formAddDetail.validateFields((err, values) => {
        if (!err) {
          values.creator = this.userInfo.user_name
          const promise = new Promise((resolve, reject) => {
            const materialCodeTemp = this.formAddDetail.getFieldValue('material_code')
            const orderIdTemp = this.formAddDetail.getFieldValue('in_order_id')
            console.log(orderIdTemp)
            getDataByDetail(
              { pageNo: 1, pageSize: 1, startTime: '1900-01-01', endTime: '3000-01-01' },
              { material_code: materialCodeTemp, in_order_id: orderIdTemp }
            ).then(res => {
              resolve(res)
            })
          })
          promise.then(res => {
            console.log(res)
            if (res.result.totalCount === 0) {
              addDataDetail(values).then(res => {
                this.visibleAddDetail = false
                if (res.status) {
                  this.formAddDetail.setFieldsValue(
                    pick({ order_count: 0, material_code: '', material_name: '', batch: '' }, [
                      'order_count',
                      'material_code',
                      'material_name',
                      'batch'
                    ])
                  )
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
      this.formAdd.resetFields()
    },
    // 确认新增点击事件
    addDataSure(e) {
      e.preventDefault()
      this.formAdd.validateFields((err, values) => {
        if (!err) {
          console.log(values)
          values.creator = this.userInfo.user_name
          values.warehouse_name = this.storageName
          addData(values).then(res => {
            console.log(res)
            this.visibleAdd = false
            if (res.status) {
              this.$refs.table.refresh(true)
              this.$message.success(res.message)
              // this.formAdd.setFieldsValue(
              //   pick({ in_order_id: 0, order_type: '', car_no: '', org_order: '' }, ['in_order_id', 'order_type', 'car_no', 'org_order'])
              // )
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
        this.formUpdate.setFieldsValue(
          pick(record, [
            'in_order_id',
            'order_type',
            'car_no',
            'org_order',
            'status',
            'hesuankemu',
            'kufangmingcheng',
            'fawudanwei',
            'hetongbianhao',
            'diaobodanhao'
          ])
        )
      })
    },
    // 确定更新数据
    updateSure(e) {
      this.visibleUpdate = false
      e.preventDefault()
      this.formUpdate.validateFields((err, values) => {
        if (!err) {
          values.updater = this.userInfo.user_name
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
      this.$nextTick(() => {
        this.formUpdateDetail.setFieldsValue(
          pick(record, ['in_order_detail_id', 'in_order_id', 'order_count', 'material_code', 'material_name', 'batch', 'udf02'])
        )
      })
    },
    // 明细确定更新数据
    updateSureDetail(e) {
      this.formUpdateDetail.validateFields((err, values) => {
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
              temp = { in_order_id: record.in_order_id }
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
              temp = { in_order_detail_id: record.in_order_detail_id }
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
      getDropDownListBy('InOrderStatus').then(res => {
        // console.log(res)
        this.statusDic = res.result.anything
      })
      getDropDownListBy('order_type').then(res => {
        this.orderTypeDic = res.result.anything
      })
    },
    // 打印入库单按钮点击事件
    printInStorageBills() {
      this.visiblePrintView = true
      this.printTitle = '器材仓库' + this.storageName + '入库单'

      this.$nextTick(() => {
        // 待生成条码的内容
        JsBarcode('#printBarCode', this.checkedData.in_order_id, {
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

        // this.printData.forEach((item, index) => {
        //   const materialCode = item.material_code.toString()
        //   console.log(materialCode)
        //   const opts = {
        //     errorCorrectionLevel: 'H', // 容错级别
        //     type: 'image/png', // 生成的二维码类型
        //     quality: 0.3, // 二维码质量
        //     margin: 1, // 二维码留白边距
        //     width: 10, // 宽
        //     height: 10, // 高
        //     text: materialCode, // 二维码内容
        //     color: {
        //       dark: '#333333', // 前景色
        //       light: '#fff' // 背景色
        //     }
        //   }

        //   const canvas = document.querySelectorAll('.materialCodeTu')
        //   // 将获取到的数据（val）画到msg（canvas）上
        //   QRCode.toCanvas(canvas[index], materialCode, opts, res => {
        //     // console.log(res)
        //   })
        // })
        this.print.openCallback = () => {
          this.visiblePrintView = false
        }
        this.print.closeCallback = () => {
          this.visiblePrintView = false
          this.print = null
        }
      })
    },
    useqrcode() {}
  },
  created() {
    this.getDic()
    this.userInfo = storage.get('userInfo')
    this.storageName = storage.get('storageTypeText')
    storageTypeText = JSON.parse(localStorage.getItem('storageTypeText'))
  },
  watch: {
    visibleUpdateDetail(val) {}
  }
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
