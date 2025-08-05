<template>
  <a-layout class="container">
    <!-- 顶栏 -->
    <a-layout-header class="header">
      <a-page-header :ghost="true" title="箱组库货架叉车移动终端" />
    </a-layout-header>

    <!-- 内容 -->
    <a-layout-content class="content">
      <!-- ===== 顶部信息 & 按钮 ===== -->
      <div class="top-panel">
        <!-- 1) 任务信息（左） -->
        <div class="task-box">
          <a-descriptions size="small" :column="1" bordered>
            <a-descriptions-item label="任务编号">
              {{ taskInfo.task_no || '-' }}
            </a-descriptions-item>
            <a-descriptions-item label="穿梭板号">
              <a-select
                v-model="shuttleNo"
                style="width: 120px"
                :options="shuttleOpts"
                @change="onShuttleChange"
              />
            </a-descriptions-item>
            <a-descriptions-item label="目标库位">
              {{ taskInfo.location_code || '-' }}
            </a-descriptions-item>
            <a-descriptions-item label="托盘编号">
              {{ taskInfo.pallet_code || '-' }}
            </a-descriptions-item>
          </a-descriptions>

          <div class="task-box-buttons">
            <a-button
              type="primary"
              block
              size="small"
              @click="getShuttleInfo">
              获取穿梭板信息
            </a-button>
            <a-button
              type="primary"
              block
              size="small"
              @click="cmdopt">
              wcs任务强制完成
            </a-button>
          </div>
        </div>

        <!-- 2) 行/列/层显示（中） -->
        <div class="pos-box">
          <div class="pos-line">排号：<span>{{ row }}</span></div>
          <div class="pos-line">列号：<span>{{ col }}</span></div>
          <div class="pos-line">层号：<span>{{ layer }}</span></div>
        </div>

        <!-- 3) 操作按钮（右） -->
        <div class="op-buttons">
          <a-button
            v-for="btn in taskButtons"
            :key="btn.key"
            class="square-btn"
            type="primary"
            @click="btn.handler"
          >
            {{ btn.text }}
          </a-button>
        </div>
      </div>

      <!-- ===== 货架示意 ===== -->
      <div class="shelf-wrapper">
        <div class="control-room">管<br />控<br />间</div>

        <a-row :gutter="[0, 0]">
          <!-- m: 排号 -->
          <a-col
            v-for="m in goodsShelfQty"
            :key="m"
            :span="goodsShelfColSpan"
            :push="2"
          >
            <a-row>
              <!-- n: 列号 -->
              <a-col
                v-for="n in colQty"
                :key="n"
                :span="21"
                class="goodsShelfCol"
              >
                <div
                  class="litiku"
                  :class="{ checkedImage: m === checkedRow && n === checkedCol }"
                  :style="{ backgroundImage: `url(${pageBg})` }"
                >
                  {{ m }}排{{ 11 - n }}列
                </div>
              </a-col>
            </a-row>
          </a-col>
        </a-row>
      </div>
    </a-layout-content>
  </a-layout>
</template>

<script setup>
/* eslint-disable no-unused-vars */
import { ref } from 'vue'
import { message, Modal } from 'ant-design-vue'
import axios from 'axios'
import shelfImg from '@/assets/goodshelf.png'

/* ---------- 常量 ---------- */
const API_BASE = 'http://127.0.0.1:9999/'
const http = axios.create({ baseURL: API_BASE, timeout: 10000 })

/* ---------- 库位参数 ---------- */
const goodsShelfQty = 7
const colQty = 10
const goodsShelfColSpan = 21 / goodsShelfQty

/* ---------- 状态 ---------- */
const pageBg = ref(shelfImg)
const taskInfo = ref({})
const shuttleNo = ref(3001)
const shuttleOpts = [
  { value: 3001, label: '1号穿梭板' },
  { value: 3002, label: '2号穿梭板' }
]

/* 高亮排/列 以及显示位置信息 */
const checkedRow = ref(0)
const checkedCol = ref(0)
const row = ref(0)
const col = ref(0)
const layer = ref(0)

/* ---------- 工具 ---------- */
function userHeader () {
  const info = JSON.parse(localStorage.getItem('userInfo') || '{}')
  return { 'User-Info': encodeURIComponent(info.user_name || '') }
}
function apiPost (url, data = {}) {
  return http.post(url, data, { headers: userHeader() })
}

/* ---------- 业务 ---------- */
function onShuttleChange (val) { shuttleNo.value = val }

async function getShuttleInfo () {
  if (!shuttleNo.value) return message.warning('请选择穿梭板编号')
  const { data } = await apiPost('TaskX/XZKStatus', { shuttleId: shuttleNo.value })
  if (data?.status) {
    const s = data.result?.list?.[0] || {}
    Modal.info({
      title: '穿梭板信息',
      content: [
        `指令号：${s.currentTaskId || '-'}`,
        `当前模式：${s.onlineStatus || '-'}`,
        `电量：${s.currentBattery || '-'}`,
        `报警信息：${s.errMsg || '-'}`
      ].join('\n')
    })
  }
}

async function getTask () {
  const { data } = await apiPost('TaskX/CarGetFirstTask?carNo=01')
  if (data?.status) {
    taskInfo.value = data.result
    checkedRow.value = Number(taskInfo.value.location_code?.substring(2, 4))
    checkedCol.value = 11 - Number(taskInfo.value.location_code?.substring(4, 6))
    row.value = checkedRow.value
    col.value = taskInfo.value.location_code?.substring(4, 6)
    layer.value = taskInfo.value.location_code?.substring(6, 8)
    message.success(data.message)
  } else {
    Modal.error({ title: '提示', content: data?.message || '获取失败' })
  }
}

async function sendShuttleTask () {
  if (!shuttleNo.value) return message.warning('请选择穿梭板编号')
  if (!taskInfo.value.task_type) return message.warning('请先获取任务')
  const url = taskInfo.value.task_type === '出库' ? 'TaskX/XZKOut' : 'TaskX/XZKIn'
  const { data } = await apiPost(url, { shuttleId: shuttleNo.value, wmsTaskId: taskInfo.value.task_no })
  data?.status ? message.success(data.message)
    : Modal.error({ title: '提示', content: data.message })
}

async function cmdopt () {
  if (!shuttleNo.value) return message.warning('请选择穿梭板编号')
  const { data: first } = await apiPost('/TaskX/XZKTask', { shuttleId: shuttleNo.value })
  const wmsTaskId = first.result?.list?.[0]?.wmsTaskId
  if (!wmsTaskId) return Modal.error({ title: '提示', content: '未查询到任务' })
  const { data } = await apiPost('TaskX/XZKCmdopt', { wmsTaskId })
  data?.status ? message.success(data.message)
    : Modal.error({ title: '提示', content: data.message })
  await cancelTask(wmsTaskId)
}

async function cancelTask (taskNo) {
  const { data } = await apiPost('TaskX/UpdateTaskXStatusByTaskNo', {
    task_no: taskNo,
    status: '已取消'
  })
  data?.status ? message.success('已取消')
    : Modal.error({ title: '提示', content: data.message })
  if (data?.status) taskInfo.value = {}
}

async function upStorageFinish () {
  if (!taskInfo.value.task_no) return message.warning('无任务可完成')
  const payload = { ...taskInfo.value, shuttleId: shuttleNo.value }
  const { data } = await apiPost('TaskX/TaskXFinish', payload)
  data?.status ? message.success(data.message)
    : Modal.error({ title: '提示', content: data.message })
  if (data?.status) taskInfo.value = {}
}

/* ---------- 顶部 3 个按钮定义 ---------- */
const taskButtons = [
  { key: 'get', text: '获取任务', handler: getTask },
  { key: 'send', text: '下发指令', handler: sendShuttleTask },
  { key: 'finish', text: '任务完成', handler: upStorageFinish }
]
</script>

<style scoped>
/* ===== 整体 & 顶栏 ===== */
.container { width:100%; min-height:100vh; display:flex; flex-direction:column; background:#fff; }
.header    { background:#007AFF; padding:0 16px; }
:deep(.ant-page-header-heading-title){ color:#fff; }
.content   { flex:1; padding:12px; display:flex; flex-direction:column; overflow-y:auto; }

/* ===== 顶部面板 ===== */
.top-panel { display:flex; gap:16px; flex-wrap:wrap; width:100%; }
.task-box  {
  flex:1 1 0;          /* 参与平分宽度 */
  max-width:960px;     /* 不让信息卡过宽 */
  border:3px solid #63b2ee; border-radius:6px; padding:8px;
}
.task-box-buttons { margin-top:8px; display:flex; flex-direction:column; gap:8px; }

.pos-box  {
  flex:1 1 0;
  display:flex; flex-direction:column; justify-content:center;
  font-size:32px; font-weight:700; line-height:1.2;
}
.pos-box span { font-weight:400; }

.op-buttons {
  flex:1 1 0;
  display:flex; justify-content:center; gap:16px; flex-wrap:wrap;
}
.square-btn{
  flex:1 1 0;
  max-width:200px;          /* 限制最大 */
  aspect-ratio:1;           /* 自动等宽高 */
  font-size:24px; padding:0;
}

/* ===== 货架区域 ===== */
.shelf-wrapper { position:relative; margin-top:20px; }
.control-room{
  position:absolute; left:0; top:0;
  transform-origin:top right;
  white-space:nowrap;
  font-weight:700; font-size:16px;
  padding:2px 6px; border:3px solid grey; background:#fff;
}

.goodsShelfCol{ text-align:center; }
.litiku{
  width:80%; height:34px; margin:0 auto 2px;
  background-repeat:no-repeat; background-position:center; background-size:100% 100%;
  border-radius:4px; color:#fff; font-size:12px; display:flex; align-items:center; justify-content:center;
  text-shadow:0 1px 2px rgba(0,0,0,.6);
}
.checkedImage{ border:3px solid red; }
</style>
