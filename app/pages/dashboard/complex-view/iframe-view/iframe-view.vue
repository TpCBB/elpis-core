<template>
  <iframe :src="path" frameborder="0"></iframe>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useMenuStore } from '$store/menu'

const route = useRoute()
const menuStore = useMenuStore()
const path = ref('')
const setPath = () => {
  const { key, sider_key: siderKey } = route.query
  const menuItem = menuStore.findMenuItem({
    key: 'key',
    value: siderKey ?? key
  })
  path.value = menuItem?.iframeConfig?.path ?? ''
}

watch(
  [() => route.query.key, () => menuStore.menuList, () => route.query.sider_key],
  () => {
    setPath()
  },
  { deep: true }
)

onMounted(() => {
  setPath()
})
</script>

<style scoped lang="less">
iframe {
  width: 100%;
  height: 100%;
}
</style>
