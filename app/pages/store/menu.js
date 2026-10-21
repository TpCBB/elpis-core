import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useMenuStore = defineStore('menu', () => {
  // Menu items
  const menuList = ref([])

  // Set the menu items
  const setMenuList = (list) => {
    menuList.value = list
  }

  /**
   * Find a menu item by its property key and value
   * @param {key} param0 Property key to match
   * @param {value} param1 Property value to match
   * @param {mList} param2 Menu list to search
   */
  const findMenuItem = ({ key, value }, mList = menuList.value) => {
    for (let i = 0; i < mList.length; i++) {
      const menuItem = mList[i]
      if (!menuItem) {
        continue
      }

      const { menuType, moduleType } = menuItem

      if (menuItem[key] === value) {
        return menuItem
      }

      if (menuType === 'group' && menuItem.subMenu) {
        const mItem = findMenuItem({ key, value }, menuItem.subMenu)
        if (mItem) {
          return mItem
        }
      }

      if (moduleType === 'sider' && menuItem.siderConfig && menuItem.siderConfig.menu) {
        const mItem = findMenuItem({ key, value }, menuItem.siderConfig.menu)
        if (mItem) {
          return mItem
        }
      }
    }
  }

  /**
   * Find the first menu item
   * @param {mList} param0 Menu list
   */
  const findFirstMenuItem = (mList = menuList.value) => {
    if (!mList || !mList[0]) {
      return
    }
    let firstMenuItem = mList[0]
    if (firstMenuItem.subMenu) {
      firstMenuItem = findMenuItem(firstMenuItem.subMenu)
    }
    return firstMenuItem
  }
  return {
    menuList,
    setMenuList,
    findMenuItem,
    findFirstMenuItem
  }
})
