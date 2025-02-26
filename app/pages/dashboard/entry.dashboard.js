import boot from '$pages/boot'
import dashboard from '$pages/dashboard/dashboard.vue'

const routes = []
const libs = []
// 头部菜单路由
routes.push({
  path: '/iframe',
  component: () => import('$pages/dashboard/complex-view/iframe-view/iframe-view.vue')
})
routes.push({
  path: '/schema',
  component: () => import('$pages/dashboard/complex-view/schema-view/schema-view.vue')
})
// custom 自定义路由
routes.push({
  path: '/todo',
  component: () => import('$pages/dashboard/todo/todo.vue')
})
// 侧边栏菜单路由
routes.push({
  path: '/sider',
  component: () => import('$pages/dashboard/complex-view/sider-view/sider-view.vue'),
  children: [
    {
      path: '/iframe',
      component: () => import('$pages/dashboard/complex-view/iframe-view/iframe-view.vue')
    },
    {
      path: '/schema',
      component: () => import('$pages/dashboard/complex-view/schema-view/schema-view.vue')
    },
    // custom 自定义路由
    {
      path: '/todo',
      component: () => import('$pages/dashboard/todo/todo.vue')
    }
  ]
})

// 侧边栏兜底策略
routes.push({
  path: '/sider/:chapters+',
  component: () => import('$pages/dashboard/complex-view/sider-view/sider-view.vue')
})

boot(dashboard, { routes, libs })
