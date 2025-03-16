<template>
  <el-card class="search-panel">
    <schema-search-bar :schema="searchSchema" @search="onSearch" @reset="onReset" @load="onLoad"></schema-search-bar>
  </el-card>
</template>

<script setup>
import { inject } from 'vue'
const { searchSchema } = inject('schemaViewData')
import SchemaSearchBar from '$widgets/schema-search-bar/schema-search-bar.vue'
const emit = defineEmits(['search', 'reset', 'load'])

const onSearch = (searchValObj) => {
  emit('search', searchValObj)
}

const onReset = () => {
  emit('search', {})
}

const onLoad = (searchValObj) => {
  emit('search', searchValObj)
}
</script>

<style lang="less" scoped>
.search-panel {
  margin: 10px;
}
:deep(.el-card__body) {
  padding-bottom: 2px;
}
</style>
