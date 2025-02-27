<template>
  <header-container :title="projectName">
    <template #menu-content>
      <!-- 根据 menuStore.menuList 渲染 -->
      <el-menu :default-active="activeKey" mode="horizontal" @select="onMenuSelect" :ellipsis="false">
        <template v-for="item in menuStore.menuList">
          <sub-menu v-if="item.subMenu && item.subMenu.length > 0" :menuItem="item"></sub-menu>
          <el-menu-item v-else :index="item.key" :key="item.key">{{ item.name }}</el-menu-item>
        </template>
      </el-menu>
    </template>
    <template #setting-content>
      <!-- 根据 projectStore.projectList 渲染 -->
      <el-dropdown @command="handleProjectCommand">
        <span class="project-list">
          {{ projectName }}
          <el-icon v-if="projectStore.projectList.length > 1" class="el-icon--right"> <ArrowDown /> </el-icon>
        </span>
        <template v-if="projectStore.projectList.length > 1" #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item
              v-for="item in projectStore.projectList"
              :key="item.key"
              :command="item.key"
              :disabled="item.name === projectName"
            >
              {{ item.name }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </template>
    <template #main-content>
      <slot name="main-content"></slot>
    </template>
  </header-container>
</template>

<script setup>
import HeaderContainer from '$widgets/header-container/header-container.vue'
import { ArrowDown } from '@element-plus/icons-vue'
import { useRoute } from 'vue-router'
import SubMenu from './complex-view/sub-menu/sub-menu.vue'
import { useProjectStore } from '$store/project'
import { useMenuStore } from '$store/menu'
import { ref, watch, onMounted } from 'vue'
const route = useRoute()
const projectStore = useProjectStore()
const menuStore = useMenuStore()

defineProps({
  projectName: String
})
const emit = defineEmits(['projectCommand', 'menuSelect'])

const activeKey = ref('')

watch(
  () => route.query.key,
  () => {
    setActive()
  }
)

watch(
  () => menuStore.menuList,
  () => {
    setActive()
  }
)

onMounted(() => {
  setActive()
})

const setActive = function () {
  const menuItem = menuStore.findMenuItem({
    key: 'key',
    value: route.query.key
  })
  activeKey.value = menuItem?.key
}

const onMenuSelect = (menuKey) => {
  console.log(`output->menuKey`,menuKey)
  const menuItem = menuStore.findMenuItem({
    key: 'key',
    value: menuKey
  })
  emit('menuSelect', menuItem)
}

const handleProjectCommand = (event) => {
  const projItem = projectStore.projectList.find((item) => item.key === event)
  if (!projItem || !projItem.homePage) {
    return
  }
  const { origin, pathname } = window.location
  window.location.replace(`${origin}${pathname}#${projItem.homePage}`)
  window.location.reload()
}
</script>

<style lang="less" scoped>
.project-list {
  outline: none;
  cursor: pointer;
  margin-right: 20px;
  color: var(--el-color-primary);
  display: flex;
  align-items: center;
}
:deep(.el-menu--horizontal.el-menu) {
  border-bottom: 0;
}
</style>
