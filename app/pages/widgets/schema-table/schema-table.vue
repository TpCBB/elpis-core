<template>
  <div class="schema-table">
    <el-table
      v-if="schema && schema.properties"
      v-loading="loading"
      :data="tableData"
      style="width: 100%"
      class="table"
    >
      <template v-for="(schemaItem, key) in schema.properties">
        <!-- v-bind="schemaItem.option" passes props to el-table-column -->
        <el-table-column
          v-if="schemaItem.option.visible !== false"
          :key="key"
          :label="schemaItem.label"
          :prop="key"
          :width="schemaItem.option.width"
          v-bind="schemaItem.option"
        ></el-table-column>
      </template>
      <!-- operationWidth sets the action column width -->
      <el-table-column v-if="buttons?.length > 0" label="操作" :fixed="'right'" :width="operationWidth">
        <template #default="scope">
          <el-button
            v-for="item in buttons"
            :key="item.label"
            link
            v-bind="item"
            @click="operationHandler({ btnConfig: item, rowData: scope.row })"
          >
            {{ item.label }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-row justify="end" class="pagination">
      <el-pagination
        :total="total"
        :current-page="currentPage"
        :page-size="pageSize"
        :page-sizes="pageSizes"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="onPageSizeChange"
        @current-change="onCurrentPageChange"
      />
    </el-row>
  </div>
</template>

<script setup>
import { ref, toRefs, onMounted, computed, watch, nextTick } from 'vue'
import $curl from '$elpisCommon/curl'
const props = defineProps({
  /**
   * Table configuration
   * Follows the dashboard module schema configuration
   * {
        // Data structure
        type: 'object',
        properties: {
          key: {
            ...schema, // Standard JSON Schema fields
            type: '', // Field type
            label: '', // Field label
            // Field options for the table
            option: {
              ...elTableColumnConfig, // Standard el-table-column props
              visible: true // Whether to display the column
            },
          }
        }
      }
   */
  schema: {
    type: Object,
    default: () => ({})
  },
  /**
   * Table data API
   */
  api: {
    type: String,
    default: ''
  },
  /**
   * Parameters sent with the API request
   */
  apiParams: {
    type: Object,
    default: () => ({})
  },
  /**
   * Table action buttons
   * Follows the dashboard module tableConfig configuration
   * [
        {
          label: '', // Button label
          eventKey: '', // Event name
          eventOption: {}, // Button action options
          ...elButtonConfig // Standard el-button props
        },
        ...otherButtons
      ],
   */
  buttons: {
    type: Array,
    default: () => []
  }
})
const emit = defineEmits(['operation'])
const { schema, api, apiParams, buttons } = toRefs(props)
// Calculate the action column width from the number of buttons
const operationWidth = computed(() => {
  return buttons?.value?.length > 0
    ? buttons.value.reduce((pre, cur) => {
        return pre + cur.label.length * 18
      }, 50)
    : 50
})
const tableData = ref([])
const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(50)
const total = ref(0)
const pageSizes = ref([10, 20, 30, 40, 50])

onMounted(() => {
  initTableData()
})

watch(
  [schema, api, apiParams],
  () => {
    initTableData()
  },
  { deep: true }
)
// Debounce fetchTableData calls
let timer = null
const loadTableData = async (time = 500) => {
  clearTimeout(timer)
  timer = setTimeout(async () => {
    await fetchTableData()
    timer = null
  }, time)
}

const initTableData = () => {
  currentPage.value = 1
  pageSize.value = 50

  nextTick(async () => {
    await loadTableData()
  })
}

const fetchTableData = async () => {
  if (!api.value) return

  showLoading()
  // Fetch table data
  const res = await $curl({
    method: 'get',
    url: `${api.value}/list`,
    query: {
      ...apiParams.value,
      page: currentPage.value,
      pageSize: pageSize.value
    }
  })

  hideLoading()

  if (!res || !res.success || !Array.isArray(res.data)) {
    tableData.value = []
    total.value = 0
    return
  }

  tableData.value = buildTableData(res.data)
  total.value = res.metadata.total
}
/**
 * Preprocess the data returned by the backend
 * @param {Array} listData List data
 */
const buildTableData = (listData) => {
  if (!schema.value?.properties) return listData

  return listData.map((rowData) => {
    // Process data according to the schema configuration
    for (const dKey in rowData) {
      const schemaItem = schema.value.properties[dKey]
      // Apply the toFixed option
      if (schemaItem?.option?.toFixed) {
        rowData[dKey] = rowData[dKey].toFixed && rowData[dKey].toFixed(schemaItem.option.toFixed)
      }
      // Extend processing for additional schema options here
    }
    return rowData
  })
}

const showLoading = () => {
  loading.value = true
}
const hideLoading = () => {
  loading.value = false
}
// Emit events for the parent component to handle
const operationHandler = ({ btnConfig, rowData }) => {
  emit('operation', { btnConfig, rowData })
}

const onPageSizeChange = async (size) => {
  pageSize.value = size
  await loadTableData()
}
const onCurrentPageChange = async (page) => {
  currentPage.value = page
  await loadTableData()
}

defineExpose({
  initTableData,
  loadTableData,
  showLoading,
  hideLoading
})
</script>

<style lang="less" scoped>
.schema-table {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: auto;

  .table {
    flex: 1;
  }
  .pagination {
    margin: 10px 0;
  }
}
</style>
