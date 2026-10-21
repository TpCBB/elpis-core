<template>
  <el-form v-if="schema && schema.properties" :inline="true" class="schema-search-bar">
    <!-- Dynamic components -->
    <el-form-item v-for="(schemaItem, key) in schema.properties" :key="key" :label="schemaItem.label">
      <!-- Render the child component -->
      <component
        :is="SearchItemConfig[schemaItem.option?.comType].component"
        ref="searchComList"
        :schema-key="key"
        :schema="schemaItem"
        @loaded="handleLoaded"
      />
    </el-form-item>

    <!-- Action area -->
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
     * Schema field reference
     *  schema: {
          // Data structure
          type: 'object',
          properties: {
            key: {
              ...schema, // Standard JSON Schema fields
              type: '', // Field type
              label: '', // Field label
              // Field options for the search bar
              option: {
                ...eleComponentConfig, // Element component props
                comType: '', // Component type
                default: '' // Default value
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

const getValue = () => {
  return searchComList.value.reduce((acc, component) => {
    return {
      ...acc,
      ...component?.getValue()
    }
  }, {})
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
