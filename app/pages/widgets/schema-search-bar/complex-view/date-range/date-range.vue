<template>
  <el-date-picker
    v-model="dtoValue"
    v-bind="schema.option"
    class="date-range"
    type="daterange"
    range-separator="至"
    :start-placeholder="schema.label + '(开始)'"
    :end-placeholder="schema.label + '(结束)'"
    format="YYYY/MM/DD"
    value-format="YYYY-MM-DD"
  ></el-date-picker>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const { schemaKey, schema } = defineProps({
  schemaKey: {
    type: String,
    required: true
  },
  schema: {
    type: Object,
    required: true
  }
})

const dtoValue = ref([])

const emit = defineEmits(['loaded'])

const getValue = () => {
  return dtoValue.value !== undefined
    ? {
        [`${schemaKey}_start`]: dtoValue.value[0],
        [`${schemaKey}_end`]: dtoValue.value[1]
      }
    : {}
}

const reset = () => {
  dtoValue.value = schema?.option?.defaultValue ?? undefined
}

onMounted(() => {
  emit('loaded')
  reset()
})

defineExpose({
  getValue,
  reset
})
</script>

<style lang="less" scoped></style>
