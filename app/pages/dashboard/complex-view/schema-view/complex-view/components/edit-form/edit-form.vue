<template>
  <el-drawer v-model="isShow" :size="500" direction="rtl" :destroy-on-close="true">
    <template #header>
      <h2>{{ title }}</h2>
    </template>
    <template #default>
      <schema-form ref="schemaFormRef" :schema="components[comName].schema" :model="dtoModel" />
    </template>
    <template #footer>
      <el-button v-loading="loading" type="primary" @click="save">{{ saveBtnText }}</el-button>
    </template>
  </el-drawer>
</template>

<script setup>
import { ref, inject } from 'vue'
import { ElNotification } from 'element-plus'
import $curl from '$elpisCommon/curl.js'
import schemaForm from '$elpisWidgets/schema-form/schema-form.vue'

const { api, components } = inject('schemaViewData')

const comName = ref('editForm')
const title = ref('')
const saveBtnText = ref('')
const isShow = ref(false)
const mainKey = ref('')
const mainValue = ref()
const loading = ref(false)
const dtoModel = ref()
const schemaFormRef = ref(null)
const emit = defineEmits(['command'])

const show = (rowData) => {
  isShow.value = true
  const { config } = components.value[comName.value]
  title.value = config.title
  saveBtnText.value = config.saveBtnText

  mainKey.value = config.mainKey
  mainValue.value = rowData[config.mainKey]
  dtoModel.value = rowData
  fetchFormData()
}

const fetchFormData = async () => {
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
    ElNotification.error('获取数据失败')
    return
  }

  dtoModel.value = res.data
}

const save = async () => {
  if (loading.value) {
    return
  }

  if (!schemaFormRef.value.validate()) {
    return
  }

  loading.value = true
  const res = await $curl({
    method: 'PUT',
    url: api.value,
    data: { ...schemaFormRef.value.getValue() }
  })
  loading.value = false
  if (!res || !res.success || !res.data) {
    ElNotification.error('保存失败')
    return
  }
  ElNotification.success('保存成功')
  close()
  emit('command', {
    event: 'loadTableData'
  })
}

const close = () => {
  isShow.value = false
}

defineExpose({
  comName,
  show
})
</script>

<style lang="less" scoped></style>
