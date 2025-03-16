module.exports = (app, router) => {
  // 获取viewController
  const { view: viewController } = app.controller;
  // 注册路由 当用户输入 http://ip:port/view/page1 会渲染app/public/output/entry.page1.tpl 这就是一个基础的SSR渲染
  router.get("/view/:page", viewController.renderPage.bind(viewController));
  // 注册路由 能匹配到 http://ip:port/view/page1/xxx/xxx/xxx/*   与前端路由 改成 History 模式匹配
  router.get("/view/:page/*", viewController.renderPage.bind(viewController));
};
