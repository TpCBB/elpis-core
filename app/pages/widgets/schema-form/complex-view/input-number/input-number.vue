<template>
  <el-row class="form-item" type="flex" align="middle">
    <!-- label -->
    <el-row class="item-label" justify="end">
      <el-row v-if="schema.option?.required" class="required" type="flex" align="middle">*</el-row>
      {{ schema.label }}
    </el-row>
    <!-- value -->
    <el-row class="item-value">
      <el-input-number
        v-model="dtoValue"
        class="component"
        :controls="false"
        v-bind="schema.option"
        :class="validTips ? 'valid-border' : ''"
        :placeholder="placeholder"
        @blur="onBlur"
        @focus="onFocus"
      >
      </el-input-number>
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
    type:  Number,
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

  const { minimum, maximum } = schema

  const ruleList = []

  if (schema.option?.placeholder) {
    ruleList.push(schema.option.placeholder)
  }

  if (minimum) {
    ruleList.push(`最小值为${minimum}`)
  }

  if (maximum) {
    ruleList.push(`最大值为${maximum}`)
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
// 初始化数据
onMounted(() => {
  initData()
})
// schema 标准 通过 ajv 校验表单
const validate = () => {
  validTips.value = null
  const { type } = schema
  if (schema.option?.required && !dtoValue.value) {
    validTips.value = '此项必填'
    return false
  }

  if (dtoValue.value) {
    const validateComplie = ajv.compile(schema)
    const valid = validateComplie(dtoValue.value)
    if (!valid && validateComplie.errors && validateComplie.errors[0]) {
      const { keyword, params } = validateComplie.errors[0]
      if (keyword === 'type') {
        validTips.value = `类型必须为${type}`
      } else if (keyword === 'minimum') {
        validTips.value = `最小值为${params.limit}`
      } else if (keyword === 'maximum') {
        validTips.value = `最大值为${params.limit}`
      } else {
        console.log('output=--->validate.erros', validate.errors[0])
        validTips.value = `填充有误`
      }
      return false
    }
  }
  return true
}

// 获取表单值
const getValue = () => {
  return dtoValue.value !== undefined
    ? {
        [schemaKey]: dtoValue.value
      }
    : {}
}

const onBlur = () => {
  validate()
}

const onFocus = () => {
  validTips.value = null
}

defineExpose({
  validate,
  getValue,
  schemaKey
})
</script>

<style lang="less" scoped>
</style>
