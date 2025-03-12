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
        <!-- v-bind="schemaItem.option" 可以处理 el-table-column 的配置 -->
        <el-table-column
          v-if="schemaItem.option.visible !== false"
          :key="key"
          :label="schemaItem.label"
          :prop="key"
          :width="schemaItem.option.width"
          v-bind="schemaItem.option"
        ></el-table-column>
      </template>
      <!-- operationWidth 操作列宽度 -->
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
import $curl from '$common/curl'
const props = defineProps({
  /**
   * 表格配置
   * 遵循 dashboard-module 的 schema 配置
   * {
        // 数据源结构
        type: 'object',
        properties: {
          key: {
            ...schema, // 标准的schema字段
            type: '', // 字段类型
            label: '', // 字段中文名
            // 字段在table中的配置
            option: {
              ...elTableColumnConfig, // 标准的 el-table-column 配置
              visible: true // 是否显示
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
   * 表格数据源 api
   */
  api: {
    type: String,
    default: ''
  },
  /**
   * api 请求参数, 请求api时候携带
   */
  apiParams: {
    type: Object,
    default: () => ({})
  },
  /**
   * 表格按钮
   * 遵循 dashboard-module 的 tableConfig 配置
   * [
        {
          label: '', //按钮中文名
          eventKey: '', // 事件名称
          eventOption: {}, // 按钮配置
          ...elButtonConfig // 标准的 el-button 配置
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
// 根据按钮数量计算操作列宽度
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
// 避免频繁触发 fetchTableData
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
  // 请求 table 数据
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
 * 对后端返回的数据进行预处理
 * @param {Array} listData 列表数据
 */
const buildTableData = (listData) => {
  if (!schema.value?.properties) return listData

  return listData.map((rowData) => {
    // 根据schema的配置，处理数据
    for (const dKey in rowData) {
      const schemaItem = schema.value.properties[dKey]
      // 处理 toFixed 配置
      if (schemaItem?.option?.toFixed) {
        rowData[dKey] = rowData[dKey].toFixed && rowData[dKey].toFixed(schemaItem.option.toFixed)
      }
      // 可以处理 schema 配置的 ...
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
// 低耦合, 只负责触发事件, 不负责处理事件
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
