import boot from '$elpisPages/boot'
import dashboard from '$elpisPages/dashboard/dashboard.vue'
import businessDashboardRouterConfig from '$businessDashboardRouterConfig'
const routes = []
const libs = []
// Header menu routes
routes.push({
  path: '/view/dashboard/iframe',
  component: () => import('$elpisPages/dashboard/complex-view/iframe-view/iframe-view.vue')
})
routes.push({
  path: '/view/dashboard/schema',
  component: () => import('$elpisPages/dashboard/complex-view/schema-view/schema-view.vue')
})
// Sidebar menu routes
// Use iframe instead of /iframe for child routes to avoid conflicts with /sider/:chapters+
// Routes can use absolute or relative paths
// Absolute path: /sider/iframe
// Relative path: iframe

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

// Sidebar fallback route
routes.push({
  path: '/view/dashboard/sider/:chapters+',
  component: () => import('$elpisPages/dashboard/complex-view/sider-view/sider-view.vue')
})

// Application-specific routes
businessDashboardRouterConfig({ routes, siderRoutes })

boot(dashboard, { routes, libs })
