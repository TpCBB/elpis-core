<template>
  <el-select v-model="dtoValue" v-bind="schema.option" class="select">
    <el-option v-for="item in enumList" :key="item.value" :label="item.label" :value="item.value"></el-option>
  </el-select>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import $curl from '$elpisCommon/curl'
const { schemaKey, schema } = defineProps({
  schemaKey: {
    type: String,
    required: true
  },
  schema: {
    type: Object,
    default: () => {}
  }
})

const emit = defineEmits(['loaded'])

const dtoValue = ref([])
const getValue = () => {
  return dtoValue.value !== undefined
    ? {
        [schemaKey]: dtoValue.value
      }
    : {}
}

const enumList = ref([])
const reset = () => {
  dtoValue.value = schema?.option?.defaultValue ?? enumList?.value?.[0]?.value
}
const getEumList = async () => {
  const res = await $curl({
    method: 'get',
    url: `${schema?.option?.api}`,
    query: {}
  })
  if (res?.data) {
    enumList.value = res?.data ?? []
  }
}
onMounted(async () => {
  await getEumList()
  reset()
  emit('loaded')
})
defineExpose({
  getValue,
  reset
})
</script>

<style lang="less" scoped></style>
