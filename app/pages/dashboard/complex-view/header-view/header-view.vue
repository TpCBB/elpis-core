<template>
  <header-container :title="projectName">
    <template #menu-content>
      <!-- 根据 menuStore.menuList 渲染 -->
      <el-menu :default-active="activeKey" mode="horizontal" :ellipsis="false" @select="onMenuSelect">
        <template v-for="item in menuStore.menuList">
          <sub-menu v-if="item.subMenu && item.subMenu.length > 0" :key="item.key" :menu-item="item"></sub-menu>
          <el-menu-item v-else :key="item" :index="item.key" >{{ item.name }}</el-menu-item>
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
import HeaderContainer from '$elpisWidgets/header-container/header-container.vue'
import { ArrowDown } from '@element-plus/icons-vue'
import { useRoute } from 'vue-router'
import SubMenu from './complex-view/sub-menu/sub-menu.vue'
import { useProjectStore } from '$elpisStore/project'
import { useMenuStore } from '$elpisStore/menu'
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
  [() => route.query.key, () => menuStore.menuList],
  () => {
    setActive()
  },
  { deep: true }
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

  const { host } = window.location
  window.location.replace(`http://${host}/view/dashboard${projItem.homePage}`)
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
