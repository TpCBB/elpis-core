<template>
  <el-row v-if="schema && schema.properties" class="schemaForm">
    <el-form-item v-for="(schemaItem, key) in schema.properties" :key="key">
      <template v-if="schemaItem.option?.visible !== false">
        <component
          :is="FormItemConfig[schemaItem.option?.comType]?.component"
          ref="formComList"
          :schema="schemaItem"
          :schema-key="key"
          :model="model ? model[key] : undefined"
        ></component>
      </template>
    </el-form-item>
  </el-row>
</template>

<script setup>
import { ref, toRefs, provide } from 'vue'
import FormItemConfig from './form-item-config'
import Ajv from 'ajv'
const ajv = new Ajv()
provide('ajv', ajv)
const props = defineProps({
  /**
     * schema: {
          // 数据源结构
          type: 'object',
          properties: {
            key: {
              ...schema, // 标准的schema字段
              type: '', // 字段类型
              label: '', // 字段中文名
              // 字段在不同动态 component 中的相关配置, 前缀对应 componentConfig 中键值
              // 例如: componentConfig.createForm 对应 createFormOption
              // 字段在 createForm 中的相关配置
              option: {
                ...eleComponentConfig, // 标准的 el-component 配置, 可以兼容原 element-ui 的属性
                comType: '', // 控件类型 input/select/input-number
                visible: 'true', // 是否显示 默认为 true
                disabled: 'false', // 是否禁用 默认为 false
                required: 'false', // 是否必填 默认为 false
                // comType 为 select 的时候
                enumList: [] // 枚举列表
              },
            },
          },
        },
     */
  schema: {
    type: Object,
    required: true
  },
  /**
   * 表单数据
   */
  model: {
    type: Object,
    default: () => {}
  }
})

const { schema } = toRefs(props)

const formComList = ref([])

// 表单校验
const validate = () => {
  return formComList.value.every((component) => {
    const result = component.validate()
    return result
  })
}

// 获取表单值
const getValue = () => {
  return formComList.value.reduce((dtoObj, component) => {
    return {
      ...dtoObj,
      ...component.getValue()
    }
  }, {})
}

defineExpose({
  validate,
  getValue
})
</script>

<style lang="less">
.schemaForm {
  .form-item {
    margin-bottom: 20px;
    min-width: 500px;

    .item-label {
      margin-right: 15px;
      min-width: 70px;
      text-align: right;
      font-size: 14px;
      color: #fff;
      word-break: break-all;
      .required {
        top: 2px;
        padding-right: 4px;
        color: #f56c6c;
        font-size: 20px;
      }
    }
    .item-value {
      .component {
        width: 320px;
        .el-input__inner {
          text-align: left;
        }
      }
      .valid-border {
        .el-input__wrapper {
          border: 1px solid #f56c6c;
          box-shadow: 0 0 0 0;
        }
        .el-select__wrapper {
          border: 1px solid #f56c6c;
          box-shadow: 0 0 0 0;
        }
      }
    }
    .valid-tips {
      margin-left: 10px;
      overflow: hidden;
      color: #f56c6c;
      font-size: 12px;
      height: 36px;
      line-height: 36px;
    }
  }
}
</style>
