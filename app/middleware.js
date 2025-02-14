const path = require("path");
module.exports = (app) => {
  // 静态资源路径 在app/public/static下
  const KoaStatic = require("koa-static");
  app.use(KoaStatic(path.resolve(process.cwd(), "./app/public")));

  // 模板渲染引擎
  const koaNunjucks = require("koa-nunjucks-2");
  app.use(
    koaNunjucks({
      ext: "tpl",
      path: path.resolve(process.cwd(), "./app/public"),
      nunjucksConfig: {
        noCache: true,
        trimBlocks: true,
      },
    })
  );

  // 解析ctx.request.body
  const bodyParser = require("koa-bodyparser");
  app.use(
    bodyParser({
      formLimit: "1000mb",
      enableTypes: ["form", "json", "text"],
    })
  );

  // 错误处理
  app.use(app.middlewares.errorHandler);

  // API 签名合法性校验
  app.use(app.middlewares.apiSignVerify);

  // API 参数校验 转移到 index.js router加载之后
  // app.use(app.middlewares.apiParamsVerify);
};
