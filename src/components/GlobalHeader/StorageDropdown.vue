<template>
  <a-dropdown placement="bottomRight">
    <span class="ant-pro-account-avatar">
      <!-- <a-avatar size="small"
        src="https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png"
        class="antd-pro-global-header-index-avatar" /> -->
      <img src="../../assets/tu.jpg"
        class="antd-pro-global-header-index-avatar ant-avatar ant-avatar-sm ant-avatar-circle"
        alt="">
      <span>当前：{{ currentStorage }}</span>
    </span>
    <template v-slot:overlay>
      <a-menu :hidden="storageTypeDicList.length==1" class="ant-pro-drop-down menu"
        @click="handleToSotrage">
        <a-menu-item v-for="item in storageTypeDicList"
          v-show="currentStorageType != item.dic_value" :key="item.dic_value">
          <a-icon type="bank" />
          {{ item.dic_display_value }}
        </a-menu-item>
      </a-menu>
    </template>
  </a-dropdown>
</template>

<script>
// import { getInfo } from '@/api/login'
import storage from 'store'
// import { mapActions } from 'vuex'
export default {
  name: 'StorageDropdown',
  data() {
    return {
      currentStorage: '---',
      currentStorageType: 0,
      storageTypeDicList: []
    }
  },
  methods: {
    handleToSotrage(checked) {
      this.currentStorageType = checked.key
      const currentTemp = this.storageTypeDicList.find(item => this.currentStorageType === item.dic_value)
      this.currentStorage = currentTemp.dic_display_value
      storage.set('storageTypeDic', this.currentStorageType)
      // 当前库汉字名称
      storage.set('storageTypeText', this.currentStorage)
      location.reload()
    }
  },
  created() {
    const timer = setInterval(() => {
      this.storageTypeDicList = storage.get('storageTypeDicList')
      this.currentStorageType = storage.get('storageTypeDic')
      if (this.storageTypeDicList !== undefined) {
        // console.log(222)
        this.currentStorage = this.storageTypeDicList.find(item => this.currentStorageType === item.dic_value).dic_display_value
        // 当前库汉字名称
        storage.set('storageTypeText', this.currentStorage)
        clearInterval(timer)
      }
    }, 1000)
  }
}
</script>

<style lang="less" scoped>
.ant-pro-drop-down {
  :deep(.action) {
    margin-right: 8px;
  }
  :deep(.ant-dropdown-menu-item) {
    min-width: 160px;
  }
}
</style>
