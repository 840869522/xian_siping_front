<template>
  <div class="warehouse-container">
    <a-page-header title="大件库平库叉车移动终端" />
    <a-row :gutter="16" class="shelf-row">
      <a-col v-for="item in storageNoArr" :key="item.location_code_x + '-' + item.location_code_y" :span="4" class="goods-shelf-col">
        <div
          class="shelf"
          :class="{ checked: !item.pallet_code }"
          :style="{ backgroundImage: `url(${pageBg})` }"
        >
          <span>{{ item.location_code_x }}排{{ item.location_code_y }}列</span>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import request from '@/utils/request'

export default {
  name: 'BigStoreFlat',
  data () {
    return {
      storageNoArr: [],
      // 1x1 transparent pixel placeholder
      pageBg: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVQImWNgYAAAAAMAAWgmWQ0AAAAASUVORK5CYII='
    }
  },
  methods: {
    async getStorageNo () {
      try {
        const res = await request({
          url: 'LocationMap/GetAllLocationMapByFuzzy',
          method: 'post',
          params: { pageSize: 100, pageNo: 1 },
          data: { location_code: 'DD' }
        })
        if (res.status) {
          this.storageNoArr = res.result.anything || []
        } else {
          this.$message.error(res.message)
        }
      } catch (e) {
        this.$message.error('请求失败')
      }
    }
  },
  mounted () {
    this.getStorageNo()
    this.timer = setInterval(this.getStorageNo, 5000)
  },
  beforeDestroy () {
    clearInterval(this.timer)
  }
}
</script>

<style scoped>
.warehouse-container {
  padding: 16px;
}
.shelf-row {
  margin-top: 16px;
}
.goods-shelf-col {
  text-align: center;
}
.shelf {
  width: 100%;
  height: 140px;
  background-size: 100% 100%;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 4px;
  color: #fff;
}
.shelf.checked {
  border: 5px solid limegreen;
}
</style>

