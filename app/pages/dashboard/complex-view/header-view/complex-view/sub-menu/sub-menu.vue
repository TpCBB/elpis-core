<template>
  <el-sub-menu :index="menuItem.key">
    <template #title>
      <span>{{ menuItem.name }}</span>
    </template>
    <div v-for="item in menuItem.subMenu" :key="item.key">
      <sub-menu v-if="item.subMenu && item.subMenu.length > 0" :menu-item="item"></sub-menu>
      <el-menu-item v-else :key="item.key" :index="item.key">{{ item.name }}</el-menu-item>
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
