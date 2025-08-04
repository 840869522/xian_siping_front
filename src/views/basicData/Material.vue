<template>
  <a-card :bordered="false">
    <!-- 检索相关 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @submit="getDataBy" :form="formBy">
        <a-row :gutter="48">
          <a-col :md="5" :sm="24">
            <a-form-item label="器材编号">
              <a-input v-decorator="['material_code']" />
            </a-form-item>
          </a-col>
          <a-col :md="5" :sm="24">
            <a-form-item label="器材名称">
              <a-input v-decorator="['material_name']" />
            </a-form-item>
          </a-col>
          <a-col :md="5" :sm="24">
            <a-form-item label="所属仓库">
              <a-select placeholder="所属仓库" :allowClear="true"
                v-decorator="['material_storage_area']">
                <a-select-option v-for="item in storageTypeDicList" :key="item.dic_value"
                  :value="item.dic_value">
                  {{ item.dic_display_value }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="24">
            <span class="table-page-search-submitButtons">
              <a-button html-type="submit" type="primary">查询</a-button>
              <a-button style="margin-left: 8px" @click="clearSelectBy">重置</a-button>
              <a-button style="margin-left: 8px" type="primary" @click="addData">新增</a-button>
              <a-button style="margin-left: 8px" type="primary" @click="printMaterial"
                v-print="print">打印
              </a-button>
              <!-- <a-button style="margin-left: 8px" type="primary" @click="printMaterial">打印
              </a-button> -->
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <!-- 表格 -->
    <s-table bordered class="tableScroll" row-key="material_code" ref="table" size="default"
      :columns="columns" :data="loadData"
      :row-selection="{selectedRowKeys:selectedRowKeys,onChange:onSelectChange}">
      <span slot="action" slot-scope="text, record">
        <a @click="updateGetValue(record)">编辑</a>
        <a-divider type="vertical" />
        <a @click="seeData(record)">详情</a>
      </span>
    </s-table>
    <!-- 新增 -->
    <a-modal title="新增" style="top: 20px" :width="800" v-model="visibleAdd" @ok="addDataSure">
      <a-form class="permission-form" :form="formAdd">
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="装备代码">
          <a-input placeholder="装备代码"
            v-decorator="['equip_code', { rules: [{ required: false, validator}] }]" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="装备名称">
          <a-input placeholder="装备名称"
            v-decorator="['equip_name', { rules: [{ required: false, validator}] }]" />
        </a-form-item>

        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="原品种标识码">
          <a-input placeholder="原品种标识码"
            v-decorator="['org_material_type', { rules: [{ required: false, validator}] }]" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="旧器材代码">
          <a-input placeholder="旧器材代码"
            v-decorator="['org_material_code', { rules: [{ required: false, validator}] }]" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="器材价格">
          <a-input placeholder="器材价格" type="number" step="0.01" :min="0"
            v-decorator="['material_price', { rules: [{ required: true}] }]" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="器材编号">
          <a-input placeholder="器材编号"
            v-decorator="['material_code', { rules: [{ required: false, validator}] }]"
            @blur="distinctMaterial" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="器材名称">
          <a-input placeholder="器材名称"
            v-decorator="['material_name', { rules: [{ required: false, validator}] }]" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="所属仓库">
          <a-select placeholder="所属仓库"
            v-decorator="['material_storage_area', { rules: [{ required: true, message: '请选择仓库！' }] }]">
            <a-select-option v-for="item in storageTypeDicList" :key="item.dic_value"
              :value="item.dic_value">
              {{ item.dic_display_value }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="类别">
          <a-select v-decorator="['material_type', { rules: [{ required: false, validator}] }]">
            <a-select-option v-for="item in typeDic" :key="item" :value="item">
              {{ item }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="生产单位：">
          <a-input placeholder="生产单位"
            v-decorator="['supplier', { rules: [{ required: false, validator}] }]" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="规格：">
          <a-input placeholder="规格"
            v-decorator="['material_spec', { rules: [{ required: false, validator}] }]"
            suffix="cm" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="单位：">
          <a-select v-decorator="['material_unit', { rules: [{ required: false, validator}] }]">
            <a-select-option v-for="(item,index) in unit" :key="index" :value="item">
              {{ item }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="长">
          <a-input placeholder="长" type="number" :min="0"
            v-decorator="['lengths', { rules: [{ required: false, validator}] }]" suffix="cm" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="宽">
          <a-input placeholder="宽" suffix="cm" type="number" :min="0"
            v-decorator="['wide', { rules: [{ required: false, validator}] }]" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="高">
          <a-input placeholder="高" suffix="cm" type="number" :min="0"
            v-decorator="['hight', { rules: [{ required: false, validator}] }]" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="重量">
          <a-input placeholder="重量" type="number" :min="0"
            v-decorator="['weight', { rules: [{ required: false, validator}] }]" suffix="kg" />
        </a-form-item>

        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="有效期">
          <a-input placeholder="有效期" type="number" :min="0"
            v-decorator="['quality', { rules: [{ required: false, validator}] }]" suffix="天" />
        </a-form-item>

        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="状态：">
          <a-radio-group name="radioGroup"
            v-decorator="['status', { rules: [{ required: false, validator}] }]">
            <a-radio v-for="(item,index) in statusDic" :key="index" :value="item">{{ item }}
            </a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="方式：">
          <a-radio-group name="radioGroup" @change="stackTypeAddChange"
            v-decorator="['stack_type', { rules: [{ required: false, validator}] }]">
            <a-radio value="自动码垛">自动码垛</a-radio>
            <a-radio value="人工码垛">人工码垛</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item v-if="stackTypeAdd" :labelCol="labelCol" :wrapperCol="wrapperCol" label="图号">
          <a-input placeholder="图号" v-decorator="['draw_no']" />
        </a-form-item>
        <a-form-item v-if="stackTypeAdd" :labelCol="labelCol" :wrapperCol="wrapperCol" label="合格证">
          <a-input placeholder="合格证" v-decorator="['certificate']" />
        </a-form-item>
        <a-form-item v-if="stackTypeAdd" :labelCol="labelCol" :wrapperCol="wrapperCol"
          label="最低库存量">
          <a-input placeholder="最低库存量" type="number" :min="0" v-decorator="['min_stock']" />
        </a-form-item>
        <a-form-item v-if="stackTypeAdd" :labelCol="labelCol" :wrapperCol="wrapperCol" label="垛型编号">
          <a-select v-decorator="['stack_no']">
            <a-select-option v-for="(item,index) in stackTypeDicList" :key="index"
              :value="item.dic_display_value">
              {{ item.dic_display_value }}
            </a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal>
    <!-- 编辑 -->
    <a-modal title="编辑" style="top: 20px" :width="800" v-model="visibleUpdate" @ok="updateSure">
      <a-form class="permission-form" :form="formUpdate">
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="装备代码">
          <a-input placeholder="装备代码"
            v-decorator="['equip_code', { rules: [{ required: false, validator}] }]" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="装备名称">
          <a-input placeholder="装备名称"
            v-decorator="['equip_name', { rules: [{ required: false, validator}] }]" />
        </a-form-item>

        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="原品种标识码">
          <a-input placeholder="原品种标识码"
            v-decorator="['org_material_type', { rules: [{ required: false, validator}] }]" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="旧器材代码">
          <a-input placeholder="旧器材代码"
            v-decorator="['org_material_code', { rules: [{ required: false, validator}] }]" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="器材价格">
          <a-input placeholder="器材价格" type="number" step="0.01" :min="0"
            v-decorator="['material_price', { rules: [{ required: true}] }]" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="器材编号">
          <a-input placeholder="器材编号"
            v-decorator="['material_code', { rules: [{ required: false, validator}] }]"
            @blur="distinctMaterial" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="器材名称">
          <a-input placeholder="器材名称"
            v-decorator="['material_name', { rules: [{ required: false, validator}] }]" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="所属仓库">
          <a-select placeholder="所属仓库"
            v-decorator="['material_storage_area', { rules: [{ required: true, message: '请选择仓库！' }] }]">
            <a-select-option v-for="item in storageTypeDicList" :key="item.dic_value"
              :value="item.dic_value">
              {{ item.dic_display_value }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="类别">
          <a-select v-decorator="['material_type', { rules: [{ required: false, validator}] }]">
            <a-select-option v-for="item in typeDic" :key="item" :value="item">
              {{ item }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="生产单位：">
          <a-input placeholder="生产单位"
            v-decorator="['supplier', { rules: [{ required: false, validator}] }]" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="规格：">
          <a-input placeholder="规格"
            v-decorator="['material_spec', { rules: [{ required: false, validator}] }]"
            suffix="cm" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="单位：">
          <a-select v-decorator="['material_unit', { rules: [{ required: false, validator}] }]">
            <a-select-option v-for="(item,index) in unit" :key="index" :value="item">
              {{ item }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="长">
          <a-input placeholder="长" type="number" :min="0"
            v-decorator="['lengths', { rules: [{ required: false, validator}] }]" suffix="cm" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="宽">
          <a-input placeholder="宽" suffix="cm" type="number" :min="0"
            v-decorator="['wide', { rules: [{ required: false, validator}] }]" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="高">
          <a-input placeholder="高" suffix="cm" type="number" :min="0"
            v-decorator="['hight', { rules: [{ required: false, validator}] }]" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="重量">
          <a-input placeholder="重量" type="number" :min="0"
            v-decorator="['weight', { rules: [{ required: false, validator}] }]" suffix="kg" />
        </a-form-item>

        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="有效期">
          <a-input placeholder="有效期" type="number" :min="0"
            v-decorator="['quality', { rules: [{ required: false, validator}] }]" suffix="天" />
        </a-form-item>

        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="状态：">
          <a-radio-group name="radioGroup"
            v-decorator="['status', { rules: [{ required: false, validator}] }]">
            <a-radio v-for="(item) in statusDic" :key="item" :value="item">{{ item }}
            </a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="方式：">
          <a-radio-group name="radioGroup" @change="stackTypeAddChange"
            v-decorator="['stack_type', { rules: [{ required: false, validator}] }]">
            <a-radio value="自动码垛">自动码垛</a-radio>
            <a-radio value="人工码垛">人工码垛</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item v-if="stackTypeAdd" :labelCol="labelCol" :wrapperCol="wrapperCol" label="存储区域">
          <a-select v-decorator="['material_storage_area']">
            <a-select-option v-for="(item,index) in storageTypeDicList" :key="index"
              :value="item.dic_display_value">
              {{ item.dic_display_value }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item v-if="stackTypeAdd" :labelCol="labelCol" :wrapperCol="wrapperCol" label="图号">
          <a-input placeholder="图号" v-decorator="['draw_no']" />
        </a-form-item>
        <a-form-item v-if="stackTypeAdd" :labelCol="labelCol" :wrapperCol="wrapperCol" label="合格证">
          <a-input placeholder="合格证" v-decorator="['certificate']" />
        </a-form-item>
        <a-form-item v-if="stackTypeAdd" :labelCol="labelCol" :wrapperCol="wrapperCol"
          label="最低库存量">
          <a-input placeholder="最低库存量" type="number" :min="0" v-decorator="['min_stock']" />
        </a-form-item>
        <a-form-item v-if="stackTypeAdd" :labelCol="labelCol" :wrapperCol="wrapperCol" label="垛型编号">
          <a-select v-decorator="['stack_no']">
            <a-select-option v-for="(item,index) in stackTypeDicList" :key="index"
              :value="item.dic_display_value">
              {{ item.dic_display_value }}
            </a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal>
    <a-modal title="详情" style="top: 20px" :width="800" v-model="visibleSee">
      <template #footer>
        <a-button key="back" @click="handleCancel">取消</a-button>
      </template>
      <a-form class="permission-form" :form="formUpdate">
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="装备代码">
          <a-input placeholder="装备代码" :disabled="true"
            v-decorator="['equip_code', { rules: [{ required: false, validator}] }]" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="装备名称">
          <a-input placeholder="装备名称" :disabled="true"
            v-decorator="['equip_name', { rules: [{ required: false, validator}] }]" />
        </a-form-item>

        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="原品种标识码">
          <a-input placeholder="原品种标识码" :disabled="true"
            v-decorator="['org_material_type', { rules: [{ required: false, validator}] }]" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="旧器材代码">
          <a-input placeholder="旧器材代码" :disabled="true"
            v-decorator="['org_material_code', { rules: [{ required: false, validator}] }]" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="器材价格">
          <a-input placeholder="器材价格" type="number" step="0.01" :min="0" :disabled="true"
            v-decorator="['material_price', { rules: [{ required: true}] }]" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="器材编号">
          <a-input placeholder="器材编号" :disabled="true"
            v-decorator="['material_code', { rules: [{ required: false, validator}] }]"
            @blur="distinctMaterial" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="器材名称">
          <a-input placeholder="器材名称" :disabled="true"
            v-decorator="['material_name', { rules: [{ required: false, validator}] }]" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="所属仓库">
          <a-select placeholder="所属仓库" :disabled="true"
            v-decorator="['material_storage_area', { rules: [{ required: true, message: '请选择仓库！' }] }]">
            <a-select-option v-for="item in storageTypeDicList" :key="item.dic_value"
              :value="item.dic_value">
              {{ item.dic_display_value }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="类别">
          <a-select :disabled="true"
            v-decorator="['material_type', { rules: [{ required: false, validator}] }]">
            <a-select-option v-for="item in typeDic" :key="item" :value="item">
              {{ item }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="生产单位：">
          <a-input placeholder="生产单位" :disabled="true"
            v-decorator="['supplier', { rules: [{ required: false, validator}] }]" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="规格：">
          <a-input placeholder="规格" :disabled="true"
            v-decorator="['material_spec', { rules: [{ required: false, validator}] }]"
            suffix="cm" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="单位：">
          <a-select :disabled="true"
            v-decorator="['material_unit', { rules: [{ required: false, validator}] }]">
            <a-select-option v-for="(item,index) in unit" :key="index" :value="item">
              {{ item }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="长">
          <a-input placeholder="长" type="number" :min="0" :disabled="true"
            v-decorator="['lengths', { rules: [{ required: false, validator}] }]" suffix="cm" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="宽">
          <a-input placeholder="宽" suffix="cm" type="number" :min="0" :disabled="true"
            v-decorator="['wide', { rules: [{ required: false, validator}] }]" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="高">
          <a-input placeholder="高" suffix="cm" type="number" :min="0" :disabled="true"
            v-decorator="['hight', { rules: [{ required: false, validator}] }]" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="重量">
          <a-input placeholder="重量" type="number" :min="0" :disabled="true"
            v-decorator="['weight', { rules: [{ required: false, validator}] }]" suffix="kg" />
        </a-form-item>

        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="有效期">
          <a-input placeholder="有效期" type="number" :min="0" :disabled="true"
            v-decorator="['quality', { rules: [{ required: false, validator}] }]" suffix="天" />
        </a-form-item>

        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="状态：">
          <a-radio-group name="radioGroup" :disabled="true"
            v-decorator="['status', { rules: [{ required: false, validator}] }]">
            <a-radio v-for="(item) in statusDic" :key="item" :value="item">{{ item }}
            </a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="方式：">
          <a-radio-group name="radioGroup" @change="stackTypeAddChange" :disabled="true"
            v-decorator="['stack_type', { rules: [{ required: false, validator}] }]">
            <a-radio value="自动码垛">自动码垛</a-radio>
            <a-radio value="人工码垛">人工码垛</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item v-if="stackTypeAdd" :labelCol="labelCol" :wrapperCol="wrapperCol" label="存储区域">
          <a-select :disabled="true" v-decorator="['material_storage_area']">
            <a-select-option v-for="(item,index) in storageTypeDicList" :key="index"
              :value="item.dic_display_value">
              {{ item.dic_display_value }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item v-if="stackTypeAdd" :labelCol="labelCol" :wrapperCol="wrapperCol" label="图号">
          <a-input placeholder="图号" v-decorator="['draw_no']" :disabled="true" />
        </a-form-item>
        <a-form-item v-if="stackTypeAdd" :labelCol="labelCol" :wrapperCol="wrapperCol" label="合格证">
          <a-input placeholder="合格证" v-decorator="['certificate']" :disabled="true" />
        </a-form-item>
        <a-form-item v-if="stackTypeAdd" :labelCol="labelCol" :wrapperCol="wrapperCol"
          label="最低库存量">
          <a-input placeholder="最低库存量" type="number" :min="0" v-decorator="['min_stock']" />
        </a-form-item>
        <a-form-item v-if="stackTypeAdd" :labelCol="labelCol" :wrapperCol="wrapperCol" label="垛型编号">
          <a-select :disabled="true" v-decorator="['stack_no']">
            <a-select-option v-for="(item,index) in stackTypeDicList" :key="index"
              :value="item.dic_display_value">
              {{ item.dic_display_value }}
            </a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal>
    <a-modal title="打印预览" style="top: 20px" :width="600" v-model="visiblePrintView" :footer="false">
      <div id="printArea">
        <div style="page-break-after:always;" v-for="item in selectedData"
          :key="item.material_code">
          <a-table bordered ref="printTable" size="default" :columns="printColumns"
            style="width:550px" :showHeader="false" :rowKey="(record,index)=>{return index}"
            :pagination="false" :data-source="printData">
            <h4 :hidden="selectedData.length!=0">未选择任何数据！</h4>
          </a-table>

        </div>
      </div>
    </a-modal>
  </a-card>
</template>

<script>
import pick from 'lodash.pick'
import { STable } from '@/components'
import { getMaterialBy, addData, updateData } from '@/api/BaseMaterial'
import { getDropDownListBy, getDicBy } from '@/api/global'
import storage from 'store'
import { h } from 'vue'
import QRCode from 'qrcode'

// 表头
const columns = [
  {
    title: '器材编号',
    dataIndex: 'material_code',
    width: 100
  },
  {
    title: '器材名称',
    dataIndex: 'material_name',
    width: 100
  },
  {
    title: '装备代码',
    dataIndex: 'equip_code',
    width: 100
  },
  {
    title: '装备名称',
    dataIndex: 'equip_name',
    width: 100
  },
  // {
  //   title: '原品种标识码',
  //   dataIndex: 'org_material_type',
  //   width: 120
  // },
  // {
  //   title: '旧器材代码',
  //   dataIndex: 'org_material_code',
  //   width: 120
  // },
  // {
  //   title: '器材价格',
  //   dataIndex: 'material_price',
  //   width: 100
  // },
  {
    title: '类别',
    dataIndex: 'material_type',
    width: 100
  },
  {
    title: '生产单位',
    dataIndex: 'supplier',
    width: 200
  },
  {
    title: '规格',
    dataIndex: 'material_spec',
    width: 100
  },
  // {
  //   title: '单位',
  //   dataIndex: 'material_unit',
  //   width: 100
  // },
  // {
  //   title: '长',
  //   dataIndex: 'lengths',
  //   width: 100
  // },
  // {
  //   title: '宽',
  //   dataIndex: 'wide',
  //   width: 100
  // },
  // {
  //   title: '高',
  //   dataIndex: 'hight',
  //   width: 100
  // },
  // {
  //   title: '重量',
  //   dataIndex: 'weight',
  //   width: 100
  // },
  {
    title: '存储区域',
    dataIndex: 'material_storage_area',
    width: 120
  },
  // {
  //   title: '图号',
  //   dataIndex: 'draw_no',
  //   width: 100
  // },
  // {
  //   title: '合格证',
  //   dataIndex: 'certificate',
  //   width: 100
  // },
  // {
  //   title: '有效期',
  //   dataIndex: 'quality',
  //   width: 100
  // },
  // {
  //   title: '最低库存量',
  //   dataIndex: 'min_stock',
  //   width: 110
  // },
  // {
  //   title: '码垛方式',
  //   dataIndex: 'stack_type',
  //   width: 100
  // },
  // {
  //   title: '垛型编号',
  //   dataIndex: 'stack_no',
  //   width: 100
  // },
  {
    title: '状态',
    dataIndex: 'status',
    width: 100
  },
  {
    title: '创建人',
    dataIndex: 'creator',
    width: 120
  },
  {
    title: '创建时间',
    dataIndex: 'create_time',
    width: 200
  },
  // {
  //   title: '是否单品',
  //   dataIndex: 'issingle',
  //   width: 200
  // },
  {
    title: '操作',
    width: '120px',
    dataIndex: 'action',
    scopedSlots: { customRender: 'action' }
  }
]
// 打印表头
const printColumns = [
  {
    title: 'columns1',
    dataIndex: 'columns1',
    align: 'center',
    width: 100,
    customRender: (value, row, index) => {
      if (index === 0) {
        return {
          children: value,
          attrs: {
            colSpan: 4,
            rowSpan: 1
          }
        }
      }
      return {
        children: value,
        attrs: {
          colSpan: 1,
          rowSpan: 1
        }
      }
    }
  },
  {
    title: 'columns2',
    dataIndex: 'columns2',
    align: 'center',
    width: 150,
    customRender: (value, row, index) => {
      if (index === 0) {
        return {
          children: value,
          attrs: {
            colSpan: 0,
            rowSpan: 1
          }
        }
      }
      if (index === 1 || index === 2 || index === 3) {
        return {
          children: value,
          attrs: {
            colSpan: 2,
            rowSpan: 1
          }
        }
      }
      return {
        children: value,
        attrs: {
          rowSpan: 1,
          colSpan: 1
        }
      }
    }
  },
  {
    title: 'columns3',
    dataIndex: 'columns3',
    align: 'center',
    width: 100,
    customRender: (value, row, index) => {
      if (index === 4) {
        return {
          children: h('canvas', { class: { columns3: true } }),
          attrs: {
            rowSpan: 6,
            colSpan: 1
          }
        }
      }
      return {
        children: value,
        attrs: {
          rowSpan: 0,
          colSpan: 0
        }
      }
    }
  }
]

export default {
  name: 'Material',
  components: {
    STable
  },
  data() {
    return {
      print: {
        id: 'printArea',
        popTitle: '&nbsp' // 打印配置页上方标题
      },
      selectedRowKeys: [],
      selectedData: [],
      visiblePrintView: false,
      // 添加模态框是否显示
      visibleAdd: false,
      // 更新模态框是否显示
      visibleUpdate: false,
      visibleSee: false,
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
      printData: [
        {
          columns1: '维修器材标签'
        },
        {
          columns1: '装备名称',
          columns2: '1'
        },
        {
          columns1: '器材代码',
          columns2: '2'
        },
        {
          columns1: '器材名称',
          columns2: '3'
        },
        {
          columns1: '型号规格',
          columns2: '4',
          columns3: 'columns3'
        },
        {
          columns1: '批号',
          columns2: '6'
        },
        {
          columns1: '单价',
          columns2: '7'
        },
        {
          columns1: '数量',
          columns2: '8'
        },
        {
          columns1: '生产单位',
          columns2: '9'
        },
        {
          columns1: '生产日期',
          columns2: '10'
        }
      ],
      printColumns,
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        parameter.startTime = this.startTime
        parameter.endTime = this.endTime
        console.log(parameter, this.queryParam)
        return getMaterialBy(parameter, this.queryParam).then(res => {
          this.selectedRowKeys = []
          this.selectedData = []
          return res.result
        })
      },
      // 状态字典列表
      statusDic: [],
      unit: [],
      storageTypeDicList: [],
      typeDic: [],
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
      startTime: '1900-01-01',
      endTime: '3000-01-01',
      dateVar: ['', ''],
      stackTypeAdd: true,
      stackTypeUpdate: '人工码垛',
      stackTypeDicList: []
    }
  },
  methods: {
    testPrice() {
      //  this.formAdd.setFields({
      //         pallet_code: { value: '', errors: "[validatePalletCode]" }
      //       })
    },
    onSelectChange(selectedRowKeys, selectedData) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedData = selectedData
    },
    // 打印库位编号
    printMaterial() {
      if (this.selectedData.length === 0) {
        this.$message.warn('请选择一条数据！')
      } else {
        this.visiblePrintView = true
      }
      this.print.openCallback = () => {
        this.visiblePrintView = false
      }
      this.print.closeCallback = () => {
        this.visiblePrintView = false
        this.print = null
      }
    },
    distinctMaterial() {
      const materialCode = this.formAdd.getFieldValue('material_code')
      console.log(materialCode)
      getMaterialBy(
        {
          pageNo: 1,
          pageSize: 10,
          startTime: '1900-01-01',
          endTime: '3000-01-01'
        },
        { material_code: materialCode }
      ).then(res => {
        console.log(res)
        if (res.status) {
          if (res.result.anything.length > 0) {
            this.formAdd.setFields({
              material_code: { value: '', errors: [{ message: '该物料已存在！', field: 'material_code' }] }
            })
          }
        }
      })
    },
    // 条件查询按钮点击事件
    getDataBy(e) {
      e.preventDefault()
      this.formBy.validateFields((err, values) => {
        if (!err) {
          console.log(values)
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
      this.queryParam = {
        material_code: '',
        material_name: '',
        material_storage_area: ''
      }
      this.formBy.setFieldsValue(pick(this.queryParam, ['material_code', 'material_name', 'material_storage_area']))
      this.$refs.table.refresh(true)
    },
    clearForm() {
      this.formData = {
        equip_code: '',
        equip_name: '',
        org_material_type: '',
        org_material_code: '',
        material_price: '',
        material_code: '',
        material_name: '',
        material_storage_area: '',
        material_type: '',
        supplier: '',
        material_spec: '',
        material_unit: '',
        lengths: '',
        wide: '',
        hight: '',
        weight: '',
        quality: '',
        status: '',
        stack_type: '',
        order_id: ''
      }
      this.formAdd.setFieldsValue(
        pick(this.formData, [
          'equip_code',
          'equip_name',
          'org_material_type',
          'org_material_code',
          'material_price',
          'material_code',
          'material_name',
          'material_storage_area',
          'material_type',
          'supplier',
          'material_spec',
          'material_unit',
          'lengths',
          'wide',
          'hight',
          'weight',
          'quality',
          'status',
          'stack_type',
          'order_id'
        ])
      )
      this.formUpdate.setFieldsValue(
        pick(this.formData, [
          'equip_code',
          'equip_name',
          'org_material_type',
          'org_material_code',
          'material_price',
          'material_code',
          'material_name',
          'material_storage_area',
          'material_type',
          'supplier',
          'material_spec',
          'material_unit',
          'lengths',
          'wide',
          'hight',
          'weight',
          'quality',
          'status',
          'stack_type',
          'order_id'
        ])
      )
    },
    // 新增按钮点击事件
    addData(e) {
      this.clearForm()
      this.visibleAdd = true
      this.$nextTick(() => {
        this.formAdd.setFieldsValue(pick({ status: '启用' }, ['status']))
        this.formAdd.setFieldsValue(pick({ stack_type: '自动码垛' }, ['stack_type']))
      })
    },
    // 确认新增点击事件
    addDataSure(e) {
      e.preventDefault()
      this.formAdd.validateFields((err, values) => {
        if (!err) {
          // values.material_code = values.equip_code
          values.creator = this.userInfo.user_name
          console.log(values)
          addData(values)
            .then(res => {
              this.visibleAdd = false
              if (res.status) {
                this.$refs.table.refresh(true)
                this.$message.success(res.message)
              } else {
                this.$message.warn(res.message)
              }
            })
            .catch(e => {
              this.$message.error(e.message)
            })
        }
      })
    },
    updateSure(e) {
      console.log(e)
      e.preventDefault()
      this.formUpdate.validateFields((err, values) => {
        if (!err) {
          console.log(values)
          values.creator = this.userInfo.user_name
          updateData(values).then(res => {
            this.visibleUpdate = false
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
      this.clearForm()
      this.visibleUpdate = true
      this.$nextTick(() => {
        console.log(record)
        this.formUpdate.setFieldsValue({
          equip_code: record.equip_code,
          equip_name: record.equip_name,
          org_material_type: record.org_material_type,
          org_material_code: record.org_material_code,
          material_price: record.material_price,
          material_code: record.material_code,
          material_name: record.material_name,
          material_storage_area: record.material_storage_area,
          material_type: record.material_type,
          supplier: record.supplier,
          material_spec: record.material_spec,
          material_unit: record.material_unit,
          lengths: record.lengths,
          wide: record.wide,
          hight: record.hight,
          weight: record.weight,
          quality: record.quality,
          status: record.status,
          stack_type: record.stack_type,
          draw_no: record.draw_no,
          certificate: record.certificate,
          min_stock: record.min_stock,
          stack_no: record.stack_no
        })
        if (record.stack_type === '自动码垛') {
          this.stackTypeUpdate = '自动码垛'
        } else {
          this.stackTypeUpdate = '人工码垛'
        }
      })
    },
    handleCancel() {
      this.visibleSee = false
      this.clearForm()
    },
    // 编辑按钮取值给模态框
    seeData(record) {
      this.clearForm()
      this.visibleSee = true
      this.$nextTick(() => {
        console.log(record)
        this.formUpdate.setFieldsValue({
          equip_code: record.equip_code,
          equip_name: record.equip_name,
          org_material_type: record.org_material_type,
          org_material_code: record.org_material_code,
          material_price: record.material_price,
          material_code: record.material_code,
          material_name: record.material_name,
          material_storage_area: record.material_storage_area,
          material_type: record.material_type,
          supplier: record.supplier,
          material_spec: record.material_spec,
          material_unit: record.material_unit,
          lengths: record.lengths,
          wide: record.wide,
          hight: record.hight,
          weight: record.weight,
          quality: record.quality,
          status: record.status,
          stack_type: record.stack_type,
          draw_no: record.draw_no,
          certificate: record.certificate,
          min_stock: record.min_stock,
          stack_no: record.stack_no
        })
        if (record.stack_type === '自动码垛') {
          this.stackTypeUpdate = '自动码垛'
        } else {
          this.stackTypeUpdate = '人工码垛'
        }
      })
    },
    // 日期选择器
    onChange(date, dateString) {
      this.startTime = dateString[0]
      this.endTime = dateString[1]
      this.dateVar = [this.startTime, this.endTime]
    },

    // 取检索条件的数据字典
    getDic() {
      getDropDownListBy('baseStatus').then(res => {
        // console.log(res)
        this.statusDic = res.result.anything
      })
      getDropDownListBy('MaterialType').then(res => {
        this.typeDic = res.result.anything
      })
      getDropDownListBy('unit').then(res => {
        this.unit = res.result.anything
      })
      getDicBy({ dic_name: 'store_classify' }).then(res => {
        this.storageTypeDicList = res.result.anything
      })
      getDicBy({ dic_name: 'base_material_stackno' }).then(res => {
        this.stackTypeDicList = res.result.anything
      })
    },
    stackTypeAddChange(e) {
      if (e.target.value === '人工码垛') {
        this.stackTypeAdd = false
      } else {
        this.stackTypeAdd = true
      }
    },
    stackTypeUpdateChange(e) {
      if (e.target.value === '人工码垛') {
        this.stackTypeUpdate = '人工码垛'
      } else {
        this.stackTypeUpdate = '自动码垛'
      }
    },
    clearData() {
      const temp = { equip_code: '', equip_name: '', org_material_type: '', org_material_code: '', status: '' }
      this.form.setFieldsValue(pick(temp, ['equip_code', 'equip_name', 'pallet_code', 'org_position', 'target_position']))
    }
  },
  created() {
    this.getDic()
    this.userInfo = storage.get('userInfo')
  },
  watch: {
    visiblePrintView(val) {
      if (val) {
        console.log(this.selectedData)
        this.$nextTick(() => {
          this.selectedData.forEach((item, index) => {
            const temp = item.material_code + '+' + item.material_name
            // console.log(temp)
            this.printData[1].columns2 = item.equip_name
            this.printData[2].columns2 = item.material_code
            this.printData[3].columns2 = item.material_name
            this.printData[4].columns2 = item.material_spec
            this.printData[5].columns2 = item.batch
            this.printData[6].columns2 = item.material_price
            this.printData[7].columns2 = item.equip_name
            this.printData[8].columns2 = item.supplier
            this.printData[9].columns2 = item.quality
            const opts = {
              errorCorrectionLevel: 'H', // 容错级别
              type: 'image/png', // 生成的二维码类型
              quality: 0.3, // 二维码质量
              margin: 0, // 二维码留白边距
              width: 150, // 宽
              height: 150, // 高
              text: temp, // 二维码内容
              color: {
                dark: '#333333', // 前景色
                light: '#fff' // 背景色
              }
            }
            const canvas = document.querySelectorAll('.columns3')
            // 将获取到的数据（val）画到msg（canvas）上
            QRCode.toCanvas(canvas[index], temp, opts, res => {
              // this.printData[4].columns3 = res
            })
          })
        })
      }
    }
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
</style>
