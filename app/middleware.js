const path = require("path");
/**
 * Register global middleware
 * @param {*} app 
 */
module.exports = (app) => {
  // Serve static assets from app/public
  const KoaStatic = require("koa-static");
  app.use(KoaStatic(path.resolve(process.cwd(), "./app/public")));

  // Template rendering engine
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

  // Parse ctx.request.body
  const bodyParser = require("koa-bodyparser");
  app.use(
    bodyParser({
      formLimit: "1000mb",
      enableTypes: ["form", "json", "text"],
    })
  );

  // Error handling
  app.use(app.middlewares.errorHandler);

  // API signature validation
  app.use(app.middlewares.apiSignVerify);

  // Validate API parameters before dispatching routes
  // Validate dynamic route parameters within the corresponding route middleware
  app.use(app.middlewares.apiParamsVerify);

  // Handle project-specific requests
  app.use(app.middlewares.projectHandler);
};
