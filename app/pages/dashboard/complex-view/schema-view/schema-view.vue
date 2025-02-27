<template>
  <el-row class="schema-view">
    <search-panel></search-panel>
    <table-panel></table-panel>
  </el-row>
</template>

<script setup>
import SearchPanel from './complex-view/search-panel/search-panel.vue'
import TablePanel from './complex-view/table-panel/table-panel.vue'
import { useSchema } from './hook/schema.js'
import { watchEffect } from 'vue'
const { api } = useSchema()
watchEffect(() => {
  if (api.value) {
    console.log('API配置已加载:', api.value)
    // 这里可以执行其他初始化操作
  }
})
</script>

<style scoped lang="less">
.schema-view {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
}
</style>
