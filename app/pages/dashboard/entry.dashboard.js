import boot from '$elpisPages/boot'
import dashboard from '$elpisPages/dashboard/dashboard.vue'
import businessDashboardRouterConfig from '$businessDashboardRouterConfig'
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
// 侧边栏菜单路由
// 侧边栏路由修改 子路由 由 /iframe 修改为 iframe 不然 会匹配的 /sider/:chapters+ 导致 路由冲突
// 可以写 绝对路径 或者相对路径
// 绝对路径 ：  /sider/iframe
// 相对路径 ：  iframe

const siderRoutes = [
  {
    path: 'iframe',
    component: () => import('$elpisPages/dashboard/complex-view/iframe-view/iframe-view.vue')
  },
  {
    path: 'schema',
    component: () => import('$elpisPages/dashboard/complex-view/schema-view/schema-view.vue')
  },
]

routes.push({
  path: '/view/dashboard/sider',
  component: () => import('$elpisPages/dashboard/complex-view/sider-view/sider-view.vue'),
  children: siderRoutes
})

// 侧边栏兜底策略
routes.push({
  path: '/view/dashboard/sider/:chapters+',
  component: () => import('$elpisPages/dashboard/complex-view/sider-view/sider-view.vue')
})

// 业务路由配置
businessDashboardRouterConfig({ routes, siderRoutes })

boot(dashboard, { routes, libs })
