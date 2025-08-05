<template>
  <a-layout class="container">
    <!-- 顶部导航 -->
    <a-layout-header class="header">
      <a-page-header :ghost="true" title="箱组库平库叉车移动终端" />
    </a-layout-header>

    <!-- 内容区 -->
    <a-layout-content class="content">
      <div class="grid-wrap">
        <a-row :gutter="[16, 16]">
          <!-- 24 栅格：span=6 => 每行 4 列 -->
          <a-col
            v-for="item in storageNoArr"
            :key="item.id || (item.location_code_x + '-' + item.location_code_y)"
            :span="6"
            class="goodsShelfCol"
          >
            <div
              class="litiku"
              :class="{ checkedImage: item.pallet_code == null }"
              :style="{ backgroundImage: `url(${pageBg})` }"
              role="img"
              aria-label="货架图片"
            >
              <span class="shelf-label">
                {{ item.location_code_x }}排{{ item.location_code_y }}列
              </span>
            </div>
          </a-col>
        </a-row>
      </div>
    </a-layout-content>
  </a-layout>
</template>

<script setup>
/* eslint-disable no-unused-vars */
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { message } from 'ant-design-vue'
import axios from 'axios'
import shelfImg from '@/assets/goodshelf.png'// ← 静态资源

/* ---------------- 网络 ---------------- */
const API_BASE = 'http://127.0.0.1:9999/'
const http = axios.create({
  baseURL: API_BASE,
  timeout: 10000
})

/* ---------------- 数据 ---------------- */
const storageNoArr = ref([])
const pageBg = ref(shelfImg)
let timer = null

async function getStorageNo () {
  try {
    const res = await http.post(
      'LocationMap/GetAllLocationMapByFuzzy?pageSize=100&pageNo=1',
      { location_code: 'XD' }// ← 与原 uni-app 保持一致
    )
    if (res.data && res.data.status) {
      storageNoArr.value = res.data.result?.anything || []
    } else {
      message.error(res.data?.message || '查询失败')
    }
  } catch (e) {
    message.error(e?.message || '网络异常')
  }
}

/* ---------------- 生命周期 ---------------- */
onMounted(() => {
  getStorageNo()// 首次拉取
  timer = window.setInterval(getStorageNo, 5000)// 5s 轮询
})

onBeforeUnmount(() => {
  if (timer) window.clearInterval(timer)
})
</script>

<style scoped>
.container {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #fff;
}

/* 顶部栏 */
.header {
  background: #007AFF;
  padding: 0 16px;
}
:deep(.ant-page-header-heading-title) {
  color: #fff;
}

/* 内容 */
.content {
  padding: 24px;
  flex: 1;
}
.grid-wrap {
  margin: 0 auto;
  height: 70vh;              /* 对齐原 “height:70%” */
}

/* 货架块 */
.goodsShelfCol { text-align: center; }
.litiku {
  width: 80%;
  height: 140px;
  margin: 0 auto;
  background-repeat: no-repeat;
  background-position: center;
  background-size: 100% 100%;
  position: relative;
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0,0,0,.08);
}
.checkedImage { border: 5px solid limegreen; }
.shelf-label {
  position: absolute;
  bottom: 6px;
  left: 50%;
  transform: translateX(-50%);
  color: #fff;
  font-weight: 600;
  text-shadow: 0 1px 2px rgba(0,0,0,.6);
}
</style>
