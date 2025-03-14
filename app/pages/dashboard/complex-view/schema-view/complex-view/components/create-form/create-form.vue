<template>
  <el-drawer v-model="isShow" :size="500" direction="rtl" :destroy-on-close="true">
    <template #header>
      <h2>{{ title }}</h2>
    </template>
    <template #default>
      <schema-form ref="schemaFormRef" :schema="components[comName].schema"></schema-form>
    </template>
    <template #footer>
      <el-button v-loading="loading" type="primary" @click="save">{{ saveBtnText }}</el-button>
    </template>
  </el-drawer>
</template>

<script setup>
import { ref, inject } from 'vue'
import SchemaForm from '$elpisWidgets/schema-form/schema-form.vue'
import { ElNotification } from 'element-plus'
import $curl from '$elpisCommon/curl.js'
const { api, components } = inject('schemaViewData')

const comName = ref('createForm')
const title = ref('')
const saveBtnText = ref('')
const isShow = ref(false)
const schemaFormRef = ref(null)
const loading = ref(false)

const emit = defineEmits(['command'])

const show = () => {
  isShow.value = true
  const { config } = components.value[comName.value]
  title.value = config.title
  saveBtnText.value = config.saveBtnText
}

const save = async () => {
  if (loading.value) {
    return
  }
  // 校验表单
  if (!schemaFormRef.value.validate()) {
    return
  }
  loading.value = true
  const res = await $curl({
    method: 'POST',
    url: api.value,
    data: { ...schemaFormRef.value.getValue() }
  })
  loading.value = false

  if (!res || !res.success) {
    ElNotification.error('新增失败')
    return
  }
  close()
  ElNotification.success('新增成功')
  emit('command', { event: 'loadTableData' })
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
