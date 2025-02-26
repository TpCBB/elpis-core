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
import HeaderView from './complex-view/header-view/headerview.vue'
import { ref, onMounted } from 'vue'
import { useProjectStore } from '$store/project'
import { useMenuStore } from '$store/menu'
import $curl from '$common/curl'
const projectName = ref('')
const projectStore = useProjectStore()
const menuStore = useMenuStore()
const route = useRoute()
const router = useRouter()
// 请求 api/project/list 接口 并且 缓存到project-store
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
// 请求 api/project 接口 并且缓存到 menu-store
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
// 点击菜单回调
const onMenuSelect = (menuItem) => {
  console.log(`output->{ menuItem }`, menuItem)
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
    path: path,
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

<style lang="less" scoped></style>
