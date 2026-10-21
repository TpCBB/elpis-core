import { ref, watch, onMounted, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { useMenuStore } from '$elpisStore/menu'
import _ from 'lodash'

export const useSchema = function () {
  const route = useRoute()
  const menuStore = useMenuStore()

  const api = ref('')
  const tableSchema = ref({})
  const tableConfig = ref()
  const searchSchema = ref({})
  const searchConfig = ref()
  const components = ref({})

  //   Build SchemaConfig for schemaView to render
  const buildData = function () {
    const { key, sider_key: siderKey } = route.query
    const menuItem = menuStore.findMenuItem({
      key: 'key',
      value: siderKey ?? key
    })
    if (menuItem && menuItem.schemaConfig) {
      const { schemaConfig: sConfig } = menuItem

      const configSchema = _.cloneDeep(sConfig.schema) // Deep-clone schemaConfig

      api.value = sConfig?.api ?? ''

      tableSchema.value = {}
      tableConfig.value = undefined
      searchSchema.value = {}
      searchConfig.value = undefined

      nextTick(() => {
        // Build tableSchema and tableConfig
        tableSchema.value = buidlDtoSchema(configSchema, 'table')
        tableConfig.value = sConfig.schema?.tableConfig

        // Build searchSchema and searchConfig
        const dtoSchema = buidlDtoSchema(configSchema, 'search')
        // Use route query values as defaults when navigating to the page
        for (const key in dtoSchema.properties) {
          if (route.query[key] !== undefined) {
            dtoSchema.properties[key].option.default = route.query[key]
          }
        }

        searchSchema.value = dtoSchema
        searchConfig.value = sConfig.schema?.searchConfig

        // Build components: { comKey: { schema: {}, config: {} } }
        const { componentConfig } = sConfig.schema
        if (componentConfig && Object.keys(componentConfig).length > 0) {
          const dtoComponents = {}
          for (const comKey in componentConfig) {
            dtoComponents[comKey] = {
              schema: buidlDtoSchema(configSchema, comKey),
              config: componentConfig[comKey]
            }
          }
          components.value = dtoComponents
        }
      })
    }
  }

  // Build a component-specific schema and remove unrelated options
  const buidlDtoSchema = (_schema, type) => {
    if (!_schema?.properties) {
      return
    }
    const dtoSchema = {
      type: 'object',
      properties: {}
    }

    //  Extract the relevant schema configuration
    for (let key in _schema.properties) {
      const props = _schema.properties[key]

      if (props[`${type}Option`]) {
        let dtoProps = {}
        // Copy property definitions without component-specific Option fields
        for (let pKey in props) {
          if (pKey.indexOf('Option') < 0) {
            dtoProps[pKey] = props[pKey]
          }
        }
        // Apply the component-specific options
        dtoProps = Object.assign({}, dtoProps, { option: props[`${type}Option`] })
        
        // Apply required-field rules
        const { required } = _schema
        if (required && required.find((pk) => key === pk)) {
          dtoProps.option.required = true
        }

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
    searchConfig,
    components
  }
}
