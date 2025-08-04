<template>
  <global-footer class="footer custom-render">
    <template v-slot:links>
      <!-- <a href="#" target="_blank">Pro Layout</a>
      <a href="#" target="_blank">Github</a>
      <a href="#" target="_blank">@Sendya</a> -->
    </template>
    <template v-slot:copyright>
      <!-- <a href="#" target="_blank">vueComponent</a> -->
    </template>
  </global-footer>
</template>

<script>
import { GlobalFooter } from '@ant-design-vue/pro-layout'

export default {
  name: 'ProGlobalFooter',
  components: {
    GlobalFooter
  }
}
</script>
