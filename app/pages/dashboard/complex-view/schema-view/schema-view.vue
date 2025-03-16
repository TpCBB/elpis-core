<template>
  <el-row class="schema-view">
    <search-panel
      v-if="searchSchema?.properties && Object.keys(searchSchema.properties).length > 0"
      @search="onSearch"
      @reset="onReset"
      @load="onLoad"
    ></search-panel>
    <table-panel @operation="onTableOperation"></table-panel>
  </el-row>
</template>

<script setup>
import { ref } from 'vue'
import SearchPanel from './complex-view/search-panel/search-panel.vue'
import TablePanel from './complex-view/table-panel/table-panel.vue'
import { useSchema } from './hook/schema.js'
import { provide } from 'vue'
const { api, tableSchema, tableConfig, searchSchema, searchConfig } = useSchema()
const apiParams = ref({})
provide('schemaViewData', {
  api,
  tableSchema,
  tableConfig,
  searchSchema,
  searchConfig,
  apiParams
})

const onSearch = (searchValObj) => {
  apiParams.value = searchValObj
}

const onReset = () => {
  console.log(`output->onReset`)
}

const onLoad = (searchValObj) => {
  console.log(`output->onLoad`, searchValObj)
}

const onTableOperation = (operationObj) => {
  console.log(`output->onTableOperation`, operationObj)
}
</script>

<style scoped lang="less">
.schema-view {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
}
</style>
