<template>
  <!-- <page-header-wrapper> -->
  <a-tabs v-model="activeKey" type="editable-card" @edit="onEdit" @tabClick="tabClick">
    <a-tab-pane v-for="pane in panes" :key="pane.key" :tab="pane.title" :closable="pane.closable">
      <keep-alive>
        <router-view />
      </keep-alive>

    </a-tab-pane>
  </a-tabs>
  <!-- </page-header-wrapper> -->

</template>

<script>
export default {
  name: 'PageView',
  data() {
    return {
      activeKey: '',
      panes: [],
      noRemove: false
    }
  },

  watch: {
    $route: function (to, from) {
      this.activeKey = to.path
      var result = this.panes.findIndex(v => {
        return v.key === to.path
      })
      if (result < 0) {
        this.panes.push({ title: to.meta.title, content: to.name, key: to.path })
        this.noRemove = false
      }
    }
  },
  created() {
    const route = this.$route
    this.panes.push({ title: route.meta.title, content: route.name, key: route.path })
    this.activeKey = route.path
  },
  destroyed() {
    this.panes = []
  },
  methods: {
    callback(key) {
      console.log(key)
    },
    onEdit(targetKey, action) {
      this[action](targetKey)
    },
    tabClick(targetKey) {
      this.$router.push({ path: targetKey })
    },
    remove(targetKey) {
      if (this.noRemove) {
        this.$message.warn('最后一个标签页无法关闭！')
        return
      }
      let activeKey = this.activeKey
      let lastIndex
      this.panes.forEach((pane, i) => {
        if (pane.key === targetKey) {
          lastIndex = i - 1
        }
      })
      const panes = this.panes.filter(pane => pane.key !== targetKey)
      if (panes.length && activeKey === targetKey) {
        if (lastIndex >= 1) {
          activeKey = panes[lastIndex].key
        } else {
          activeKey = panes[0].key
        }
      }
      this.panes = panes
      this.activeKey = activeKey
      this.$router.push({ path: activeKey })
      if (this.panes.length === 1) {
        this.noRemove = true
      } else {
        this.noRemove = false
      }
    }
  }
}
</script>
