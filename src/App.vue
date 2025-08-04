<template>
  <a-config-provider>
    <div id="app">
      <router-view />
    </div>
  </a-config-provider>
</template>

<script>
import { domTitle, setDocumentTitle } from '@/utils/domUtil'
import { i18nRender } from '@/locales'
export default {
  data() {
    return {}
  },

  created() {
    // 在页面加载时读取sessionStorage
    // && this.$store.state.user.token === null
    console.log(this.$store.state, this.$store.state.user.token)
    if (!sessionStorage.getItem('token') && this.$store.state.user.token === undefined) {
      localStorage.removeItem('Access-Token')
      localStorage.removeItem('store')
      localStorage.removeItem('role_name')
      localStorage.removeItem('storageTypeDic')
      localStorage.removeItem('storageTypeDicList')
      localStorage.removeItem('userInfo')
    }
    if (localStorage.getItem('store')) {
      sessionStorage.setItem('token', this.$store.state.user.token)
      this.$store.replaceState(Object.assign({}, this.$store.state, JSON.parse(localStorage.getItem('store'))))
    }
    // 在页面刷新时将store保存到sessionStorage里
    window.addEventListener('beforeunload', () => {
      localStorage.setItem('store', JSON.stringify(this.$store.state))
    })
    // 页面加载是取时间，用户操作更新时间，
  },
  destroyed() {},
  mounted() {},
  computed: {
    locale() {
      // 只是为了切换语言时，更新标题
      const { title } = this.$route.meta
      title && setDocumentTitle(`${i18nRender(title)} - ${domTitle}`)

      return this.$i18n.getLocaleMessage(this.$store.getters.lang).antLocale
    }
  }
}
</script>
<style></style>
