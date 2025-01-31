const KoaRouter = require("koa-router");
const glob = require("glob");
const path = require("path");
const sep = path.sep;

/**
/**
 * router loader
 * @param {object} app koa实例
 *
 * 文件目录: app/router/**.js
 *
 * 解析 app/router/**.js 加载到KoaRouter
 *
 */
module.exports = (app) => {
  // 找到router的文件路径
  const routerPath = path.resolve(app.businessDir, `.${sep}router`);
  // router目录下所有文件
  const fileList = glob.sync(path.resolve(routerPath, `.${sep}**${sep}**.js`));
  // 实例化koarouter
  const router = new KoaRouter();

  // 注册router
  fileList.forEach((file) => {
    /**
     * eg. file: app/router/api.js
     * modules.exports = (app,router)=>{
     *  router.get('/api',controller.api)
     * }
     */

    require(path.resolve(file))(app, router);
  });

  // 路由404
  router.all("*", async (ctx, next) => {
    ctx.status = 302; // 临时重定向
    ctx.redirect(`${app?.options?.homePage ?? "/"}`);
  });

  // 挂载到app实例上
  app.use(router.routes());
  app.use(router.allowedMethods()); // 处理405和501
};
