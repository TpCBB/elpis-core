<template>
  <sider-container>
    <template #menu-content>
      <el-menu :default-active="activeKey" mode="vertical" :ellipsis="false" @select="onMenuSelect">
        <template v-for="item in menuList">
          <!-- group -->
          <sub-menu v-if="item.subMenu && item.subMenu.length > 0" :menu-item="item"></sub-menu>

          <!-- module -->
          <el-menu-item v-else :index="item.key">{{ item.name }}</el-menu-item>
        </template>
      </el-menu>
    </template>
    <template #main-content>
      <router-view></router-view>
    </template>
  </sider-container>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import SiderContainer from '$widgets/sider-container/sider-container.vue'
import { useMenuStore } from '$store/menu'
import SubMenu from './complex-view/sub-menu.vue'

const route = useRoute()
const router = useRouter()
const menuStore = useMenuStore()

const menuList = ref([])
const setMenuList = () => {
  const menuItem = menuStore.findMenuItem({
    key: 'key',
    value: route.query.key
  })
  if (menuItem && menuItem.siderConfig && menuItem.siderConfig.menu) {
    menuList.value = menuItem.siderConfig.menu
  }
}

const activeKey = ref('')
const setActiveKey = (key) => {
  let siderMenuItem = menuStore.findMenuItem({
    key: 'key',
    value: route.query.sider_key
  })

  //如果首次加载，则获取第一个菜单
  if (!siderMenuItem) {
    const hMenuItem = menuStore.findMenuItem({
      key: 'key',
      value: route.query.key
    })
    if (hMenuItem && hMenuItem.siderConfig && hMenuItem.siderConfig.menu) {
      const siderMenuList = hMenuItem.siderConfig.menu
      siderMenuItem = menuStore.findFirstMenuItem(siderMenuList) // 找出左侧菜单的第一个
      if (siderMenuItem) {
        handleMenuSelect(siderMenuItem.key)
      }
    }
  }

  activeKey.value = siderMenuItem?.key
}

watch(
  [() => route.query.key, () => menuStore.menuList],
  () => {
    setMenuList()
    setActiveKey()
  },
  { deep: true }
)

const onMenuSelect = (menuKey) => {
  handleMenuSelect(menuKey)
}

const handleMenuSelect = (menuKey) => {
  const menuItem = menuStore.findMenuItem({
    key: 'key',
    value: menuKey
  })
  const { moduleType, key, customConfig } = menuItem

  const pathMap = {
    iframe: '/iframe',
    schema: '/schema',
    custom: customConfig?.path
  }

  if (key === route.query.sider_key) {
    return
  }

  router.push({
    path: `/sider${pathMap[moduleType]}`,
    query: {
      key: route.query.key,
      sider_key: menuKey,
      proj_key: route.query.proj_key
    }
  })
}

onMounted(() => {
  setMenuList()
  setActiveKey()
})
</script>

<style scoped lang="less"></style>
