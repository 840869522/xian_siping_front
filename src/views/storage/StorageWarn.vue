<template>
  <a-card :bordered="false">
    <!-- 检索相关 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @submit="getDataBy" :form="formBy">
        <a-row :gutter="48">
          <a-col :md="6" :sm="24">
            <a-form-item label="器材编号">
              <a-input v-decorator="['material_code']" />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="器材名称">
              <a-input v-decorator="['material_name']" />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="载具编号">
              <a-input v-decorator="['pallet_code']" />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="批次">
              <a-input v-decorator="['batch']" />
            </a-form-item>
          </a-col>
<!--          <a-col :md="6" :sm="24">-->
<!--            <a-form-item label="库位编号">-->
<!--              <a-input v-decorator="['location_code']" />-->
<!--            </a-form-item>-->
<!--          </a-col>-->
<!--          <a-col :md="6" :sm="24">-->
<!--            <a-form-item label="状态">-->
<!--              <a-select placeholder="请选择" v-decorator="['status']">-->
<!--                <a-select-option v-for="item in statusDic" :key="item" :value="item">-->
<!--                  {{ item }}-->
<!--                </a-select-option>-->
<!--              </a-select>-->
<!--            </a-form-item>-->
<!--          </a-col>-->
          <!-- <a-col :md="6" :sm="24">
            <a-form-item label="选择时间：">
              <a-range-picker :placeholder="['开始时间', '结束时间']" :value="dateVar" @change="onChange" />
            </a-form-item>
          </a-col> -->
          <a-col :md="4" :sm="24">
            <span class="table-page-search-submitButtons">
              <a-button @click="clearSelectBy">重置</a-button>
              <a-button style="margin-left: 8px" html-type="submit" type="primary">查询</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <!-- 表格 -->
    <s-table row-key="inventory_id" bordered ref="table" size="default" :columns="columns"
      :data="loadData">
<!--      <a-tag :color="text !== '已过期' ? 'green' : 'red'" slot="status" slot-scope="text">{{ text }}-->
<!--      </a-tag>-->
      <span slot="createTime" slot-scope="text">{{ text | moment }}</span>
    </s-table>
  </a-card>
</template>

<script>
import pick from 'lodash.pick'
import { STable } from '@/components'
// import { warnStorage } from '@/api/InvenMaterialLocationmap'
import { addData } from '@/api/LocationMap'
import { getDropDownListBy } from '@/api/global'
import { getDataByInventory } from '@/api/Inventory'
// 表头
const columns = [
  {
    title: '器材编号',
    dataIndex: 'material_code'
  },
  {
    title: '器材名称',
    dataIndex: 'material_name'
  },
  {
    title: '库存数量',
    dataIndex: 'inventory_count'
  },
  {
    title: '批号',
    dataIndex: 'batch'
  },
  {
    title: '库位编号',
    dataIndex: 'location_code'
  },
  {
    title: '载具编号',
    dataIndex: 'pallet_code'
  },
  {
    title: '状态',
    dataIndex: 'status',
    scopedSlots: { customRender: 'status' }
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
  name: 'StorageWarn',
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
      // 查询参数
      queryParam: {},
      // 表头
      columns,
      // 加载数据方法 必须为 Promise 对象
      // loadData: parameter => {
      //   parameter.startTime = this.startTime
      //   parameter.endTime = this.endTime
      //   console.log(this.queryParam)
      //   return warnStorage(parameter, this.queryParam).then(res => {
      //     console.log(res)
      //     this.$refs.table._vnode.elm.querySelectorAll('tr').forEach(item => {
      //       console.log(item)
      //     })
      //     return res.result
      //   })
      // },
      loadData: parameter => {
        parameter.startTime = this.startTime
        parameter.endTime = this.endTime
        return getDataByInventory(parameter, this.queryParam).then(res => {
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
      startTime: '1900-01-01',
      endTime: '3000-01-01',
      dateVar: ['', '']
    }
  },
  methods: {
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
      this.queryParam = { material_code: '', material_name: '', pallet_code: '', location_code: '', status: '', batch: '' }
      this.formBy.setFieldsValue(pick(this.queryParam, ['material_code', 'material_name', 'pallet_code', 'location_code', 'status', 'batch']))
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
        this.statusDic = res.result.anything
      })
    },
    onChange(date, dateString) {
      this.startTime = dateString[0]
      this.endTime = dateString[1]
      this.dateVar = [this.startTime, this.endTime]
      // console.log(date, string)
    }
  },
  created() {
    this.getDic()
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
