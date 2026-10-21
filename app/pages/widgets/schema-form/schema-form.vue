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
          // Data structure
          type: 'object',
          properties: {
            key: {
              ...schema, // Standard JSON Schema fields
              type: '', // Field type
              label: '', // Field label
              // Field options for dynamic components; prefixes match keys in componentConfig
              // For example, componentConfig.createForm uses createFormOption
              // Field options for createForm
              option: {
                ...eleComponentConfig, // Element component props, including compatible Element UI props
                comType: '', // Control type: input/select/inputNumber/dateRange
                visible: 'true', // Visibility; defaults to true
                disabled: 'false', // Disabled state; defaults to false
                required: 'false', // Required state; defaults to false
                // When comType is select
                enumList: [] // Available enum options
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
   * Form data
   */
  model: {
    type: Object,
    default: () => {}
  }
})

const { schema } = toRefs(props)

const formComList = ref([])

// Form validation
const validate = () => {
  return formComList.value.every((component) => {
    const result = component.validate()
    return result
  })
}

// Get the form value
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
