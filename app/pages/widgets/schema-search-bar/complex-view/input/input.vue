<template>
  <el-input v-model="dtoValue" v-bind="schema.option" class="input"></el-input>
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
    default: () => {}
  }
})

const emit = defineEmits(['loaded'])

const dtoValue = ref()
const getValue = () => {
  return dtoValue.value !== undefined
    ? {
        [schemaKey]: dtoValue.value
      }
    : {}
}

const reset = () => {
  dtoValue.value = schema?.option?.defaultValue || ''
}

onMounted(() => {
  reset()
  emit('loaded')
})

defineExpose({
  getValue,
  reset
})
</script>

<style lang="less" scoped></style>
