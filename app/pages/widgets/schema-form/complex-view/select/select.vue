<template>
  <el-row class="form-item" type="flex" align="middle">
    <!-- label -->
    <el-row class="item-label" justify="end">
      <el-row v-if="schema.option?.required" class="required" type="flex" align="middle">*</el-row>
      {{ schema.label }}
    </el-row>
    <!-- value -->
    <el-row class="item-value">
      <el-select
        v-model="dtoValue"
        class="component"
        v-bind="schema.option"
        :class="validTips ? 'valid-border' : ''"
        @change="onChange"
      >
        <el-option v-for="item in schema.option.enumList" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
    </el-row>
    <el-row v-if="validTips" class="valid-tips">
      {{ validTips }}
    </el-row>
  </el-row>
</template>

<script setup>
import { ref, toRefs, inject, watch, onMounted } from 'vue'
const ajv = inject('ajv')

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
    type: [String, Number],
    default: undefined
  }
})
const { schemaKey, schema } = props
const { model } = toRefs(props)

const dtoValue = ref()
const placeholder = ref('')
const validTips = ref(null)

const initData = () => {
  validTips.value = null
  dtoValue.value = model.value ?? schema.option?.default

  const { minLength, maxLength, pattern } = schema

  const ruleList = []

  if (schema.option?.placeholder) {
    ruleList.push(schema.option.placeholder)
  }

  if (minLength) {
    ruleList.push(`最小长度为${minLength}`)
  }

  if (maxLength) {
    ruleList.push(`最大长度为${maxLength}`)
  }

  if (pattern) {
    ruleList.push(`格式必须为${pattern}`)
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
    const dtoEnum = schema.option?.enumList.map((item) => item.value)

    const validateComplie = ajv.compile({
      schema,
      ...{ enum: dtoEnum }
    })

    const valid = validateComplie(dtoValue.value)

    if (!valid && validateComplie.errors && validateComplie.errors[0]) {
      const { keyword } = validateComplie.errors[0]
      if (keyword === 'enum') {
        validTips.value = `取值超出枚举值范围`
      } else {
        validTips.value = `填充有误`
      }
    }
  }

  return true
}

// Get the form value
const getValue = () => {
  return dtoValue.value !== undefined
    ? {
        [schemaKey]: dtoValue.value
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
