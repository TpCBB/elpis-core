<template>
  <el-config-provider :locale="zhCn">
    <header-view :project-name="projectName" @menu-select="onMenuSelect">
      <template #main-content>
        <router-view />
      </template>
    </header-view>
  </el-config-provider>
</template>
<script setup>
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import { useRoute, useRouter } from 'vue-router'
import HeaderView from './complex-view/header-view/header-view.vue'
import { ref, onMounted } from 'vue'
import { useProjectStore } from '$elpisStore/project'
import { useMenuStore } from '$elpisStore/menu'
import $curl from '$elpisCommon/curl'
const projectName = ref('')
const projectStore = useProjectStore()
const menuStore = useMenuStore()
const route = useRoute()
const router = useRouter()
// Fetch the project list and cache it in the project store
async function getProjectList() {
  const res = await $curl({
    url: '/api/project/getList',
    method: 'get',
    query: {
      proj_key: route.query.proj_key
    }
  })

  if (!res || !res.success) {
    return
  }
  projectStore.setProjectList(res.data)
}
// Fetch the project configuration and cache its menu in the menu store
async function getProjectConfig() {
  const res = await $curl({
    url: '/api/project',
    method: 'get',
    query: {
      proj_key: route.query.proj_key
    }
  })
  if (!res || !res.success) {
    return
  }
  menuStore.setMenuList(res.data.menu)
  projectName.value = res.data.name
}
// Menu click handler
const onMenuSelect = (menuItem) => {
  const { moduleType, key, customConfig } = menuItem
  if (key === route.query.key) {
    return
  }
  const pathMap = {
    sider: '/sider',
    iframe: '/iframe',
    schema: '/schema',
    custom: customConfig?.path
  }

  const path = pathMap[moduleType]
  router.push({
    path: `/view/dashboard${path}`,
    query: {
      key: key,
      proj_key: route.query.proj_key
    }
  })
}
onMounted(() => {
  getProjectConfig()
  getProjectList()
})
</script>

<style lang="less" scoped>
:deep(.el-main) {
  padding: 0;
}
</style>
