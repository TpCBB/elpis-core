import boot from '$elpisPages/boot'
import dashboard from '$elpisPages/dashboard/dashboard.vue'

const routes = []
const libs = []
// 头部菜单路由
routes.push({
  path: '/view/dashboard/iframe',
  component: () => import('$elpisPages/dashboard/complex-view/iframe-view/iframe-view.vue')
})
routes.push({
  path: '/view/dashboard/schema',
  component: () => import('$elpisPages/dashboard/complex-view/schema-view/schema-view.vue')
})
// custom 自定义路由
routes.push({
  path: '/view/dashboard/todo',
  component: () => import('$elpisPages/dashboard/todo/todo.vue')
})
// 侧边栏菜单路由
// 侧边栏路由修改 子路由 由 /iframe 修改为 iframe 不然 会匹配的 /sider/:chapters+ 导致 路由冲突
// 可以写 绝对路径 或者相对路径
// 绝对路径 ：  /sider/iframe
// 相对路径 ：  iframe
routes.push({
  path: '/view/dashboard/sider',
  component: () => import('$elpisPages/dashboard/complex-view/sider-view/sider-view.vue'),
  children: [
    {
      path: 'iframe',
      component: () => import('$elpisPages/dashboard/complex-view/iframe-view/iframe-view.vue')
    },
    {
      path: 'schema',
      component: () => import('$elpisPages/dashboard/complex-view/schema-view/schema-view.vue')
    },
    // custom 自定义路由
    {
      path: 'todo',
      component: () => import('$elpisPages/dashboard/todo/todo.vue')
    }
  ]
})

// 侧边栏兜底策略
routes.push({
  path: '/view/dashboard/sider/:chapters+',
  component: () => import('$elpisPages/dashboard/complex-view/sider-view/sider-view.vue')
})

boot(dashboard, { routes, libs })
