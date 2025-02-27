import { ref, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useMenuStore } from '$store/menu'

export const useSchema = function () {
  const route = useRoute()
  const menuStore = useMenuStore()

  const api = ref('')

  //   构造 SchemaConfig 相关配置, 输送给 schemaView 解析
  const buildData = function () {
    const { key, sider_key: siderKey } = route.query
    const menuItem = menuStore.findMenuItem({
      key: 'key',
      value: siderKey ?? key
    })
    if (menuItem && menuItem.schemaConfig) {
      const { schemaConfig: sConfig } = menuItem
      api.value = sConfig ?? ''
    }
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
    api
  }
}
