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
// 初始化数据
onMounted(() => {
  initData()
})
// schema 标准 通过 ajv 校验表单
const validate = () => {
  validTips.value = null
  if (schema.option?.required && !dtoValue.value) {
    validTips.value = '此项必填'
    return false
  }

  // 获取枚举值 根据 JSON-SCHEMA 标准 枚举值需要是字符串
  if (dtoValue.value) {
    // TODO: 根据 JSON-SCHEMA 标准 校验 date 值
    // const validateComplie = ajv.compile()
    // const valid = validateComplie(dtoValue.value)
    // console.log('output=--->valid', valid)
  }
  return true
}

// 获取表单值
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
