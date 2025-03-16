<template>
  <el-row class="schema-view">
    <template v-if="searchSchema?.properties && Object.keys(searchSchema.properties).length > 0">
      <search-panel @search="onSearch" @reset="onReset" @load="onLoad"></search-panel>
    </template>
    <table-panel ref="tableRef" @operation="onTableOperation"></table-panel>

    <component
      v-for="(item, key) in components"
      :is="componentConfig[key]?.component"
      :key="key"
      ref="componentsRef"
      @command="onComponentCommand"
    ></component>
  </el-row>
</template>

<script setup>
import { ref } from 'vue'
import SearchPanel from './complex-view/search-panel/search-panel.vue'
import TablePanel from './complex-view/table-panel/table-panel.vue'
import { useSchema } from './hook/schema.js'
import { provide } from 'vue'
import componentConfig from './complex-view/components/componentConfig.js'
const { api, tableSchema, tableConfig, searchSchema, searchConfig, components } = useSchema()
const apiParams = ref({})
provide('schemaViewData', {
  api,
  tableSchema,
  tableConfig,
  searchSchema,
  searchConfig,
  apiParams,
  components
})
const tableRef = ref(null)
const componentsRef = ref([])

const onSearch = (searchValObj) => {
  apiParams.value = searchValObj
}

const onReset = () => {
  console.log(`output->onReset`)
}

const onLoad = (searchValObj) => {
  console.log(`output->onLoad`, searchValObj)
}
// table 时间映射
const EventHandlerMap = {
  ShowComponent: ShowComponent
}

const onTableOperation = ({ btnConfig, rowData }) => {
  const { eventKey } = btnConfig
  if (EventHandlerMap[eventKey]) {
    EventHandlerMap[eventKey]({ btnConfig, rowData })
  }
}

function ShowComponent({ btnConfig, rowData }) {
  const { comName } = btnConfig.eventOption

  if (!comName) {
    console.error(`output=--->没有配置组件`)
    return
  }
  console.log('componentsRef=--->',components);
  const comRef = componentsRef.value.find((item) => item.comName === comName)
  console.log('comRef=--->',componentsRef.value);
  if (!comRef || typeof comRef.show !== 'function') {
    console.error(`output=--->没有找到组件: ${comName}`)
    return
  }
  comRef.show(rowData)
}
// 组件事件
const onComponentCommand = ({ event }) => {
  console.log(`output->onComponentCommand`, event)
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
