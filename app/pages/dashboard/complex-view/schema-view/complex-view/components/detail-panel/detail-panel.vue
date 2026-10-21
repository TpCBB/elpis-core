<template>
  <el-drawer v-model="isShow" :title="title" :size="500" :destroy-on-close="true">
    <template #header>
      <h2>{{ title }}</h2>
    </template>
    <template #default>
      <el-card v-loading="loading" shadow="always" class="detail-panel">
        <el-row
          v-for="(item, key) in components[comName]?.schema?.properties"
          :key="key"
          align="middle"
          class="row-item"
        >
          <el-row class="item-label">{{ item.label }} :</el-row>
          <el-row class="item-value">{{ dtoModel[key] }}</el-row>
        </el-row>
      </el-card>
    </template>
  </el-drawer>
</template>

<script setup>
import { ref, inject } from 'vue'
import $curl from '$elpisCommon/curl.js'
import { ElNotification } from 'element-plus'
const { components, api } = inject('schemaViewData')

const comName = ref('detailPanel')
const title = ref('')
const mainKey = ref()
const mainValue = ref()
const loading = ref(false)
const isShow = ref(false)
const saveBtnText = ref('')
const dtoModel = ref({})

const show = async (rowData) => {
  isShow.value = true
  const { config } = components.value[comName.value]
  title.value = config.title
  mainKey.value = config.mainKey
  mainValue.value = rowData[mainKey.value]
  saveBtnText.value = config.saveBtnText
  await fetchFormData()
}

const fetchFormData = async () => {
  if (loading.value) {
    return
  }
  loading.value = true
  const res = await $curl({
    method: 'GET',
    url: api.value,
    query: {
      [mainKey.value]: mainValue.value
    }
  })
  loading.value = false
  if (!res || !res.success || !res.data) {
    ElNotification.error('获取详情失败')
    return
  }
  dtoModel.value = res.data
}

defineExpose({
  comName,
  show
})
</script>

<style lang="less" scoped>
.detail-panel {
  border: 1px solid #a6a6a6;
  padding: 30px;

  .row-item {
    height: 40px;
    line-height: 40px;
    font-size: 14px;

    .item-label {
      margin-right: 20px;
      width: 120px;
      color: #fff;
    }

    .item-value {
      color: #d2dae4;
    }
  }
}
</style>
