import { ref, watch, onMounted, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { useMenuStore } from '$store/menu'
import _ from 'lodash'

export const useSchema = function () {
  const route = useRoute()
  const menuStore = useMenuStore()

  const api = ref('')
  const tableSchema = ref({})
  const tableConfig = ref({})
  const searchSchema = ref({})
  const searchConfig = ref({})

  //   构造 SchemaConfig 相关配置, 输送给 schemaView 解析
  const buildData = function () {
    const { key, sider_key: siderKey } = route.query
    const menuItem = menuStore.findMenuItem({
      key: 'key',
      value: siderKey ?? key
    })
    if (menuItem && menuItem.schemaConfig) {
      const { schemaConfig: sConfig } = menuItem

      const configSchema = _.cloneDeep(sConfig.schema) // 深拷贝 schemaConfig

      api.value = sConfig?.api ?? ''

      tableSchema.value = {}
      tableConfig.value = undefined
      searchSchema.value = {}
      searchConfig.value = undefined

      nextTick(() => {
        // 构造 tableSchema 和tableConfig
        tableSchema.value = buidlDtoSchema(configSchema, 'table')
        tableConfig.value = sConfig.schema?.tableConfig

        // 构造 searchSchema 和 searchConfig
        const dtoSchema = buidlDtoSchema(configSchema, 'search')
        // 如果页面跳转的时候 路由带有值 则将值设置为默认值
        for (const key in dtoSchema.properties) {
          if (route.query[key] !== undefined) {
            dtoSchema.properties[key].option.default = route.query[key]
          }
        }

        searchSchema.value = dtoSchema
        searchConfig.value = sConfig.schema?.searchConfig
      })
    }
  }

  // 通用构建 schema 配置 (清除无效配置)
  const buidlDtoSchema = (_schema, type) => {
    if (!_schema?.properties) {
      return
    }
    const dtoSchema = {
      type: 'object',
      properties: {}
    }

    //  提取 schema 中的有效配置
    for (let key in _schema.properties) {
      const props = _schema.properties[key]

      if (props[`${type}Option`]) {
        let dtoProps = {}
        // 提取 props 中 除了 Option 的有效配置
        for (let pKey in props) {
          if (pKey.indexOf('Option') < 0) {
            dtoProps[pKey] = props[pKey]
          }
        }
        // 处理 type Option
        dtoProps = Object.assign({}, dtoProps, { option: props[`${type}Option`] })
        dtoSchema.properties[key] = dtoProps
      }
    }
    return dtoSchema
  }

  watch(
    [() => route.query.key, () => route.query.sider_key, () => menuStore.menuList],
    () => {
      buildData()
    },
    { deep: true }
  )

  onMounted(() => {
    buildData()
  })

  return {
    api,
    tableSchema,
    tableConfig,
    searchSchema,
    searchConfig
  }
}
