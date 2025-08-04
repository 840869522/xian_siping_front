<template>
  <a-card :bordered="false">
    <!-- 检索相关 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @submit="getDataBy" :form="formBy">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="角色名称">
              <a-select placeholder="请选择角色" showArrow v-decorator="['role_name']">
                <a-select-option v-for="item in roleList" :key="item.role_id"
                  :value="item.role_name">
                  {{ item.role_name }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="状态">
              <a-select placeholder="请选择" v-decorator="['status']">
                <a-select-option v-for="item in statusDic" :key="item.dic_value"
                  :value="item.dic_value">
                  {{ item.dic_display_value }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <span class="table-page-search-submitButtons">
              <a-button html-type="submit" type="primary">查询</a-button>
              <a-button style="margin-left: 8px" @click="clearSelectBy">重置</a-button>
              <a-button style="margin-left: 8px" type="primary" @click="addRoleData">新增角色</a-button>
              <a-button style="margin-left: 8px" type="primary" @click="updatePermissionData">编辑权限
              </a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <!-- 表格 -->
    <s-table bordered ref="table" rowKey="role_id" size="default" :columns="columns"
      :data="loadData">
      <a-tag :color="text == '启用' ? 'green' : 'red'" slot="status_display_value" slot-scope="text">
        {{ text }}
      </a-tag>
      <span slot="createTime" slot-scope="text">{{ text | moment }}</span>
      <span slot="action" slot-scope="text, record">
        <a :hidden="record.component_id !== 'index'" @click="updateStatus(record)">状态变更</a>
        <!-- <a-divider type="vertical" />
        <a href="javascript:;" @click="delData(record)">删除</a> -->
      </span>
    </s-table>
    <!-- 编辑状态 -->
    <a-modal title="编辑状态" style="top: 20px" :width="800" v-model="visibleUpdateStatus"
      @ok="updateStatusSure">
      <a-form class="permission-form" :form="formUpdateStatus">
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="角色名称">
          <a-select v-decorator="['role_name']" @change="refreshMenu" placeholder="请选择角色" showArrow>
            <a-select-option v-for="item in roleList" :key="item.role_id" :value="item.role_name">
              {{ item.role_name }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="状态">
          <a-select placeholder="请选择" v-decorator="['status']">
            <a-select-option v-for="item in statusDic" :key="item.dic_value"
              :value="item.dic_value">
              {{ item.dic_display_value }}
            </a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal>
    <!-- 编辑权限 -->
    <a-modal title="编辑权限" style="top: 20px" :width="800" v-model="visibleUpdate" @ok="updateSure">
      <a-form class="permission-form" :form="formUpdate">
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="角色名称">
          <a-select
            v-decorator="['role_name', { rules: [{ required: true, message: '请输入角色名称!' }] }]"
            @change="refreshMenu" placeholder="请选择角色" showArrow>
            <a-select-option v-for="item in roleList" :key="item.role_id" :value="item.role_name">
              {{ item.role_name }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="权限配置">
          <div>
            <a-tree checkable
              :replaceFields="{ children: 'children', title: 'title', key: 'component_id' }"
              :expanded-keys="expandedKeysUpdate" :auto-expand-parent="autoExpandParentUpdate"
              :tree-data="VIPPermission" @expand="onExpandUpdate" @check="checkKeysUpdate"
              :checkStrictly="false" :checkedKeys="checkedMenuUpdate" />
          </div>
        </a-form-item>
      </a-form>
    </a-modal>
    <!-- 新增 -->
    <a-modal title="新增角色" style="top: 20px" :width="800" v-model="visibleAddRole" @ok="addDataSure">
      <a-form class="permission-form" :form="formAdd">
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="角色名称">
          <a-input placeholder="请输入角色名称" v-decorator="['role_name']" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="仓库名称">
          <a-select showArrow placeholder="请选择仓库名称" mode="multiple"
            v-decorator="['storage_name', { rules: [{ required: true, message: '请输入角色名称!' }] }]">
            <a-select-option v-for="item in this.storageTypeDicList" :key="item.dic_value"
              :value="item.dic_value">
              {{ item.dic_display_value }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="权限配置">
          <div>
            <a-tree checkable @check="checkKeysAdd"
              :replaceFields="{ children: 'children', title: 'title', key: 'component_id' }"
              :expanded-keys="expandedKeysAdd" :auto-expand-parent="autoExpandParentAdd"
              :tree-data="VIPPermission" @expand="onExpandAdd" />
          </div>
        </a-form-item>
      </a-form>
    </a-modal>
  </a-card>
</template>

<script>
import pick from 'lodash.pick'
import { STable } from '@/components'
import storage from 'store'
import { getDataBy, addData, modifySysRoleStatus, getMenuBysysRoleName, modifySysRoleInfo } from '@/api/role'
import { getDicBy, getRoleBy } from '@/api/global'
// 表头
const columns = [
  {
    title: '角色ID',
    dataIndex: 'role_id'
  },
  {
    title: '角色名称',
    dataIndex: 'role_name'
  },
  {
    title: '菜单名称',
    dataIndex: 'title'
  },
  {
    title: '菜单ID',
    dataIndex: 'component_id'
  },
  {
    title: '菜单图标',
    dataIndex: 'icon'
  },
  {
    title: '父级菜单',
    dataIndex: 'parent_id'
  },
  {
    title: '状态值',
    dataIndex: 'status'
  },
  {
    title: '更新人',
    dataIndex: 'updater',
    sorter: true
  },
  {
    title: '更新时间',
    dataIndex: 'updateTime',
    sorter: true
  },
  {
    title: '操作',
    width: '100px',
    dataIndex: 'action',
    scopedSlots: { customRender: 'action' }
  }
]

export default {
  name: 'RoleList',
  components: {
    STable
  },
  data() {
    return {
      // 添加模态框是否显示
      visibleAddRole: false,
      // 更新模态框是否显示
      visibleUpdate: false,
      // 编辑form
      formUpdate: this.$form.createForm(this),
      // 条件查询form
      formBy: this.$form.createForm(this),
      // 新增form
      formAdd: this.$form.createForm(this),
      // 编辑状态form
      formUpdateStatus: this.$form.createForm(this),
      // 查询参数
      queryParam: {},
      // 表头
      columns,
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return getDataBy(parameter, this.queryParam).then(res => {
          return res.result
        })
      },
      // 状态字典列表
      statusDic: [],
      // 超级管理员所有权限
      VIPPermission: [],
      // 动态栅格
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
      // 从数据库取得角色列表
      roleList: [],
      // 库名字典列表
      storageTypeDicList: [],
      // 校验规则
      validator: (rule, value, cbfn) => {
        // console.log(rule, value, cbfn)
        if (!value) {
          cbfn('请输入有效值')
        } else if (!value.trim().length) {
          cbfn('请输入有效值')
        }
        cbfn()
      },
      // 新增---展开的树结构
      expandedKeysAdd: [],
      // 新增---自动展开父级开关
      autoExpandParentAdd: true,
      // 新增---选中的数组（包含子集和父级）
      checkedKeysAdd: [],
      // 编辑---展开的树结构
      expandedKeysUpdate: [],
      // 编辑---自动展开父级开关
      autoExpandParentUpdate: true,
      // 编辑---下拉选择的菜单列表（只包含子菜单）
      checkedMenuUpdate: [],
      // 更新---超级管理员所有菜单线性列表
      checkedMenuUpdateVip: [],
      // 更新---新选择的菜单（包含子集和父级）
      checkedMenuUpdateNew: [],
      // 更新---旧的菜单（包含子集和父级）
      checkedMenuUpdateOld: [],
      // 编辑状态模态框是否显示
      visibleUpdateStatus: false
    }
  },
  methods: {
    // 编辑---当选择角色时联合查询出其角色对应的权限
    refreshMenu(value) {
      console.log(value)
      this.checkedMenuUpdate = []
      this.checkedMenuUpdateOld = []
      this.getMenuBysysRoleName(value, false)
    },
    // 根据角色取菜单的线性列表
    getMenuBysysRoleName(value, updateFlag) {
      getMenuBysysRoleName({ role_name: value }).then(res => {
        console.log(res)
        const temp = res.result.anything
        for (let i = 0; i < temp.length; i++) {
          if (updateFlag) {
            this.checkedMenuUpdateVip.push(temp[i])
          } else {
            this.checkedMenuUpdateOld.push(temp[i].component_id)
            if (temp[i].component == null) {
              this.checkedMenuUpdate.push(temp[i].component_id)
            }
          }
        }
        // console.log(this.checkedMenuUpdateOld)
      })
    },
    // 选择复选框后合并数组给checkedMenuUpdateNew赋值，并所有选中的子菜单给checkedMenuUpdate赋值
    checkKeysUpdate(checkedKeys, e) {
      console.log(checkedKeys, e)
      this.checkedMenuUpdateNew = [...checkedKeys, ...e.halfCheckedKeys]
      const temp = checkedKeys
      for (let i = 0; i < this.checkedMenuUpdateVip.length; i++) {
        for (let j = 0; j < temp.length; j++) {
          if (this.checkedMenuUpdateVip[i].component_id === temp[j]) {
            if (this.checkedMenuUpdateVip[i].component !== null) {
              temp.splice(j, 1)
            }
          }
        }
      }
      this.checkedMenuUpdate = temp
      // console.log(this.checkedMenuUpdateNew)
    },
    // 编辑---用于展开树结构
    onExpandUpdate(expandedKeys) {
      this.expandedKeysUpdate = expandedKeys
      this.autoExpandParentUpdate = false
    },
    // 新增---选择复选框后合并数组
    checkKeysAdd(checkedKeys, e) {
      this.checkedKeysAdd = [...checkedKeys, ...e.halfCheckedKeys]
      console.log(this.checkedKeys)
    },
    // 新增---用于展开树结构
    onExpandAdd(expandedKeys) {
      this.expandedKeysAdd = expandedKeys
      this.autoExpandParentAdd = false
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
      this.queryParam = { role_name: '', status: '' }
      this.formBy.setFieldsValue(pick(this.queryParam, ['role_name', 'status']))
      this.$refs.table.refresh(true)
    },
    // 新增角色按钮点击事件
    addRoleData() {
      this.visibleAddRole = true
      this.getVIPPermission()
    },
    // 编辑权限按钮点击事件
    updatePermissionData() {
      this.visibleUpdate = true
      this.getMenuBysysRoleName('超级管理员', true)
      this.getVIPPermission()
      this.checkedMenuUpdateNew = []
      this.formUpdate.setFieldsValue(pick({ role_name: '' }, ['role_name']))
      this.checkedMenuUpdate = []
    },
    // 编辑按钮点击事件
    updateStatus(record) {
      this.visibleUpdateStatus = true
      // console.log(record)
      const timer = setTimeout(() => {
        this.formUpdateStatus.setFieldsValue(pick({ role_name: record.role_name, status: record.status }, ['role_name', 'status']))
        clearTimeout(timer)
      }, 1000)
    },
    // 确认更新状态
    updateStatusSure() {
      this.formUpdateStatus.validateFields((err, values) => {
        if (!err) {
          console.log(values)
          values.updater = this.userInfo.user_name
          modifySysRoleStatus(values).then(res => {
            console.log(res)
            this.visibleUpdateStatus = false
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
    // 确认新增点击事件
    addDataSure(e) {
      e.preventDefault()
      this.formAdd.validateFields((err, values) => {
        console.log(err, values)
        if (!err) {
          values.checkedKeysAdd = this.checkedKeysAdd
          console.log(values)
          values.creator = this.userInfo.user_name
          addData(values).then(res => {
            console.log(res)
            this.visibleAddRole = false
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
    // 确定更新数据
    updateSure(e) {
      e.preventDefault()
      this.formUpdate.validateFields((err, values) => {
        if (!err) {
          this.visibleUpdate = false
          if (this.checkedMenuUpdateNew.length === 0) {
            this.checkedMenuUpdateNew = this.checkedMenuUpdateOld
          }
          values.updater = this.userInfo.user_name
          console.log(this.checkedMenuUpdateOld, this.checkedMenuUpdateNew)
          values.checkedKeys = [this.checkedMenuUpdateOld, this.checkedMenuUpdateNew]
          modifySysRoleInfo(values).then(res => {
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
    // 删除数据
    // delData (record) {
    //   const _this = this
    //   const modal = this.$confirm({
    //     content: '确定删除此角色吗？',
    //     okText: '删除',
    //     cancelText: '取消',
    //     onOk () {
    //       delData({ login_name: record.login_name })
    //         .then(res => {
    //           _this.$refs.table.refresh(true)
    //         })
    //     },
    //     onCancel () {
    //       modal.destroy()
    //     }
    //   })
    // },
    // 取检索条件的数据字典
    getDic() {
      getDicBy({ dic_name: 'sys_role' }).then(res => {
        this.statusDic = res.result.anything
      })
    },
    // 获取超级管理员的所有权限
    getVIPPermission() {
      getDataBy(
        { pageNo: 1, pageSize: 10000 },
        {
          role_name: '超级管理员'
        }
      ).then(res => {
        console.log(res)
        this.VIPPermission = res.result.anything
      })
    },
    // 取角色名称列表
    getRoleBy() {
      getRoleBy().then(res => {
        console.log(res)
        this.roleList = res.result.anything
      })
    },
    // 取检索条件的数据字典
    getStorageDic() {
      getDicBy({ dic_name: 'store_classify' }).then(res => {
        console.log(res)
        this.storageTypeDicList = res.result.anything
      })
    }
  },
  created() {
    this.getDic()
    this.getRoleBy()
    this.getStorageDic()
    this.userInfo = storage.get('userInfo')
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
