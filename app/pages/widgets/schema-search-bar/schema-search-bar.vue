<template>
  <el-form v-if="schema && schema.properties" :inline="true" class="schema-search-bar">
    <!-- 动态组件 -->
    <el-form-item v-for="(schemaItem, key) in schema.properties" :key="key" :label="schemaItem.label">
      <!-- 展示子组件 -->
      <component
        :is="SearchItemConfig[schemaItem.option?.comType].component"
        :ref="handleSearchComList"
        :schema-key="key"
        :schema="schemaItem"
        @loaded="handleLoaded"
      />
    </el-form-item>

    <!-- 操作区域 -->
    <el-form-item>
      <el-button type="primary" plain class="search-btn" @click="search"> 搜索 </el-button>
      <el-button type="primary" plain class="reset-btn" @click="reset"> 重置 </el-button>
    </el-form-item>
  </el-form>
</template>

<script setup>
import { ref, toRefs } from 'vue'
import SearchItemConfig from './search-item-config'

const props = defineProps({
  /**
     * schema 字段如下
     *  schema: {
          // 数据源结构
          type: 'object',
          properties: {
            key: {
              ...schema, // 标准的schema字段
              type: '', // 字段类型
              label: '', // 字段中文名
              // 字段在search-bar中的配置
              option: {
                ...eleComponentConfig, // 标准的 el-component 配置
                comType: '', // 配置组件类型
                default: '' // 默认值
              },
            },
            ...other
          }
        },
     */
  schema: {
    type: Object,
    default: () => ({})
  }
})
const { schema } = toRefs(props)
const emit = defineEmits(['search', 'reset', 'load'])

const searchComList = ref([])
const handleSearchComList = (el) => {
  searchComList.value.push(el)
}

const getValue = () => {
  let dtoObj = {}
  searchComList.value.forEach((component) => {
    dtoObj = {
      ...dtoObj,
      ...component?.getValue()
    }
  })
  return dtoObj
}

let childComLoadedCount = 0
const handleLoaded = () => {
  childComLoadedCount++
  if (childComLoadedCount >= Object.keys(schema?.value?.properties).length) {
    emit('load', getValue())
  }
}

const search = () => {
  emit('search', getValue())
}

const reset = () => {
  searchComList.value.forEach((component) => {
    component.reset()
  })
  emit('reset')
}

defineExpose({
  getValue,
  reset
})
</script>

<style lang="less">
.schema-search-bar {
  min-width: 500px;
  .search-btn {
    width: 100px;
  }
  .reset-btn {
    width: 100px;
  }

  .select {
    width: 180px;
  }
}
</style>
