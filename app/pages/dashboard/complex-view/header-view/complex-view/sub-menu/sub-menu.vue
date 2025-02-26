<template>
  <el-sub-menu :index="menuItem.key">
    <template #title>
      <span>{{ menuItem.name }}</span>
    </template>
    <div v-for="item in menuItem.subMenu" :key="item.key">
      <SubMenu v-if="item.subMenu && item.subMenu.length > 0" :menuItem="item"></SubMenu>
      <el-menu-item v-else :index="item.key" :key="item.key">{{ item.name }}</el-menu-item>
    </div>
  </el-sub-menu>
</template>

<script setup>
const { menuItem } = defineProps({
  menuItem: {
    type: Object,
    required: true
  }
})
</script>

<style lang="less" scoped></style>
