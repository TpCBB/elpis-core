import { createApp } from 'vue'

// Import Element Plus
import ElementPlus from 'element-plus'
import 'element-plus/theme-chalk/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import '$elpisAsserts/dark/css-vars.css'
// Import custom.css
import '$elpisAsserts/custom.css'

// Import Pinia
import pinia from '$elpisStore'

import { createRouter, createWebHistory } from 'vue-router'

/**
 * Create the Vue application and mount it to the DOM
 * @param {Object} pageComponent - Root page component
 * @param {Array} routes - Route definitions
 * @param {Array} libs - Component libraries required by the page
 */

export default (pageComponent, { routes, libs }) => {
  const app = createApp(pageComponent)
  app.use(ElementPlus)
  app.use(pinia)

  // Register the libraries specified in libs
  if (libs && libs.length) {
    for (let i = 0; i < libs.length; ++i) {
      app.use(libs[i])
    }
  }

  if (routes && routes.length) {
    const router = createRouter({
      history: createWebHistory(), // Use HTML5 history mode
      routes
    })
    app.use(router)
    router.isReady().then(() => {
      app.mount('#root')
    })
  } else {
    app.mount('#root')
  }
}
