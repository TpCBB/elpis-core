import { createApp } from "vue";

// 引入element-ui
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";

// 引入 custom.css
import "$asserts/custom.css";

// 引入 pinia
import pinia from "$store";

import { createRouter, createWebHistory } from "vue-router";

/**
 * vue 主入口, 用于创建vue实例, 并挂载到dom上
 * @param {Object} pageComponent - 页面组件
 * @param {Array} routes - 路由
 * @param {Array} libs - 不同页面依赖不同的组件库
 */

export default (pageComponent, { routes, libs }) => {
  const app = createApp(pageComponent);
  app.use(ElementPlus);
  app.use(pinia);

  // 根据 libs 引入不同的库
  if (libs && libs.length) {
    for (let i = 0; i < libs.length; ++i) {
      app.use(libs[i]);
    }
  }

  if (routes && routes.length) {
    const router = createRouter({
      history: createWebHistory(),
      routes,
    });
    app.use(router);
    router.isReady().then(() => {
      app.mount("#root");
    });
  } else {
    app.mount("#root");
  }
};
