<template>
  <el-card class="table-panel">
    <!-- operation panel -->
    <el-row v-if="tableConfig?.headerButtons?.length > 0" justify="end" class="operation-panel">
      <el-button
        v-for="item in tableConfig?.headerButtons"
        v-bind="item"
        :key="item.key"
        @click="handleOperation({ btnConfig: item })"
      >
        {{ item.label }}
      </el-button>
    </el-row>
    <!-- <operation-panel></operation-panel> -->
    <!-- schema table (component) widget -->
    <schema-table
      ref="schemaTableRef"
      :api="api"
      :buttons="tableConfig?.rowButtons ?? []"
      :schema="tableSchema"
      @operation="handleOperation"
    ></schema-table>
  </el-card>
</template>

<script setup>
import { ref, inject } from 'vue'
import { ElMessageBox, ElNotification } from 'element-plus'
import $curl from '$common/curl'
import SchemaTable from '$widgets/schema-table/schema-table.vue'

const emit = defineEmits(['operation'])

const { api, tableSchema, tableConfig } = inject('schemaViewData')

const schemaTableRef = ref(null)

const EventKeys = {
  remove: removeData
}
const handleOperation = (btnConfig, rowData) => {
  const { eventKey } = btnConfig
  if (EventKeys[eventKey]) {
    EventKeys[eventKey]({ btnConfig, rowData })
  } else {
    emit('operation', { btnConfig, rowData })
  }
}

function removeData({ btnConfig, rowData }) {
  const { eventOption } = btnConfig
  if (!eventOption?.params) {
    return
  }

  const { params } = eventOption
  const rowValueKey = Object.keys(params)[0]
  // TODO: 需要测试
  const rowKey = params[rowValueKey]
  let removeValue
  const removeValueList = rowKey.split('::')
  if (removeValueList[0] === 'schema' && removeValueList[1]) {
    removeValue = rowData[removeValueList[1]]
  }

  ElMessageBox.confirm(`确定删除${rowValueKey}:${removeValue}吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    schemaTableRef.value.showLoading()
    await $curl({
      method: 'delete',
      url: api.value,
      data: {
        [removeKey]: removeValue
      },
      errorMessage: '删除失败'
    })
    schemaTableRef.value.hideLoading()

    if (!res || !res.success || !res.data) {
      return
    }

    ElNotification.success({
      title: '成功',
      message: '删除成功',
      type: 'success'
    })
    await initTableData()
  })

  const initTableData = async () => {
    await schemaTableRef.value.initTableData()
  }

  const loadTableData = async () => {
    await schemaTableRef.value.loadTableData()
  }

  defineExpose({
    initTableData,
    loadTableData
  })
}
</script>

<style lang="less" scoped>
.table-panel {
  flex: 1;
  margin: 10px;
  .operation-panel {
    margin-bottom: 10px;
  }
}
:deep(.el-card__body) {
  height: 98%;
  display: flex;
  flex-direction: column;
}
</style>
