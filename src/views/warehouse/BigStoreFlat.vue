<template>
  <a-layout class="container">
    <a-layout-header class="header">
      <a-page-header
        :ghost="true"
        title="大件库平库叉车移动终端"
      />
    </a-layout-header>

    <a-layout-content class="content">
      <div class="grid-wrap">
        <a-row :gutter="[16, 16]">
          <!-- 24 栅格：span=6 => 每行 4 列，可按需调整 -->
          <a-col
            v-for="item in storageNoArr"
            :key="item.id || (item.location_code_x + '-' + item.location_code_y)"
            :span="6"
            class="goodsShelfCol"
          >
            <div
              class="litiku"
              :class="{'checkedImage': item.pallet_code == null}"
              :style="{ backgroundImage: `url(${pageBg})` }"
              aria-label="货架图片"
              role="img"
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
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { message } from 'ant-design-vue'
import axios from 'axios'
import shelfImg from '@/assets/goodshelf.png' // 静态资源

const API_BASE = 'http://127.0.0.1:9999/'
const http = axios.create({
  baseURL: API_BASE,
  timeout: 10000
})

// 响应式数据
const storageNoArr = ref([])
const pageBg = ref(shelfImg)
console.log(pageBg)
let timer

async function getStorageNo () {
  try {
    const res = await http.post(
      'LocationMap/GetAllLocationMapByFuzzy?pageSize=100&pageNo=1',
      { location_code: 'DD' }
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

onMounted(() => {
  getStorageNo()
  timer = window.setInterval(getStorageNo, 5000)
})

onBeforeUnmount(() => {
  if (timer) window.clearInterval(timer)
})
</script>

<style scoped>
.container {
  width: 100%;
  min-height: 100vh;
  background: #fff;
  display: flex;
  flex-direction: column;
}

.header {
  background: #007AFF;
  padding: 0 16px;
}

:deep(.ant-page-header) .ant-page-header-heading-title {
  color: #fff;
}

.content {
  padding: 24px;
  flex: 1;
}

.grid-wrap {
  margin: 0 auto;
  height: 70vh;
}

.goodsShelfCol {
  text-align: center;
}

.litiku {
  width: 80%;
  height: 140px;
  margin: 0 auto;
  background-repeat: no-repeat;
  background-position: center center;
  background-size: 100% 100%;
  position: relative;
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, .08);
}

.checkedImage {
  border: 5px solid limegreen;
}

.shelf-label {
  position: absolute;
  bottom: 6px;
  left: 50%;
  transform: translateX(-50%);
  color: #fff;
  font-weight: 600;
  text-shadow: 0 1px 2px rgba(0, 0, 0, .6);
}
</style>
