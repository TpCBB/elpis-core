<template>
  <el-row class="form-item" type="flex" align="middle">
    <!-- label -->
    <el-row class="item-label" justify="end">
      <el-row v-if="schema.option?.required" class="required" type="flex" align="middle">*</el-row>
      {{ schema.label }}
    </el-row>
    <!-- value -->
    <el-row class="item-value">
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
        @change="onChange"
      ></el-date-picker>
    </el-row>
    <el-row v-if="validTips" class="valid-tips">
      {{ validTips }}
    </el-row>
  </el-row>
</template>

<script setup>
import { ref, toRefs, watch, onMounted } from 'vue'
// const ajv = inject('ajv')

const props = defineProps({
  schemaKey: {
    type: String,
    default: ''
  },
  schema: {
    type: Object,
    default: () => {}
  },
  model: {
    type: Object,
    default: () => {}
  }
})
const { schemaKey, schema } = props
const { model } = toRefs(props)
const dtoValue = ref([])
const placeholder = ref('')
const validTips = ref(null)

const initData = () => {
  validTips.value = null
  dtoValue.value = model.value ?? schema.option?.defaultValue ?? []
  const ruleList = []

  if (schema.option?.placeholder) {
    ruleList.push(schema.option.placeholder)
  }

  placeholder.value = ruleList.join('|')
}

watch(
  [model, schema],
  () => {
    initData()
  },
  {
    deep: true
  }
)
// Initialize the data
onMounted(() => {
  initData()
})
// Validate the form against JSON Schema using Ajv
const validate = () => {
  validTips.value = null
  if (schema.option?.required && !dtoValue.value) {
    validTips.value = '此项必填'
    return false
  }

  // Read enum values; this control expects string values for JSON Schema validation
  if (dtoValue.value) {
    // TODO: Validate date values against JSON Schema
    // const validateComplie = ajv.compile()
    // const valid = validateComplie(dtoValue.value)
    // console.log('output=--->valid', valid)
  }
  return true
}

// Get the form value
const getValue = () => {
  return dtoValue.value !== undefined
    ? {
        [`${schemaKey}_start`]: dtoValue.value[0],
        [`${schemaKey}_end`]: dtoValue.value[1]
      }
    : {}
}

const onChange = () => {
  validate()
}

defineExpose({
  validate,
  getValue,
  schemaKey
})
</script>

<style lang="less" scoped></style>
