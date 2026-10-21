const Koa = require("koa");
const path = require("path");
const { sep } = path; // Platform-specific path separator: backslash on Windows, slash on macOS
const env = require("./env"); // Environment helpers

const configLoader = require("./loader/config"); // Configuration
const extendLoader = require("./loader/extend"); // Extensions
const serviceLoader = require("./loader/service"); // Services
const controllerLoader = require("./loader/controller"); // Controllers
const routerSchemaLoader = require("./loader/router-schema"); // Route schemas
const middlewareLoader = require("./loader/middleware"); // Middleware
const routerLoader = require("./loader/router"); // Routes

module.exports = {
  /**
   * Startup options
   * @param {*} options Project configuration
   */
  start(options = {}) {
    // Create the Koa application
    const app = new Koa();

    // Project configuration
    app.options = options;

    // Project root directory; defaults to process.cwd()
    app.baseDir = options.baseDir || process.cwd();
    console.log(`output->baseDir`, app.baseDir);

    // Application source directory
    app.businessDir = path.resolve(app.baseDir, `.${sep}app`);
    console.log(`output->businessDir`, app.businessDir);

    // Get the environment
    app.env = env();
    console.log(`-- [start] env: ${app.env.get()} --`);

    // Load configuration
    configLoader(app);
    console.log(`-- [start] configLoader done --`);

    // Load extensions
    extendLoader(app);
    console.log(`-- [start] extendLoader done --`);

    // Load services
    serviceLoader(app);
    console.log(`-- [start] serviceLoader done --`);

    // Load controllers
    controllerLoader(app);
    console.log(`-- [start] controllerLoader done --`);

    // Load route schemas
    routerSchemaLoader(app);
    console.log(`-- [start] routerSchemaLoader done --`);

    // Load middleware
    middlewareLoader(app);
    console.log(`-- [start] middlewareLoader done --`);

    // Register core global middleware
    const elpisMiddleware = require(path.resolve(__dirname, `..${sep}app${sep}middleware.js`))
    elpisMiddleware(app)
    console.log(`-- [start] load elpis global middleware done`);

    // Register application global middleware
    try {
      require(`${app.businessDir}${sep}middleware.js`)(app);
      console.log(`-- [start] load business global middleware done`);
    } catch (error) {
      console.log(`output->error`, error);
      console.log(`[execption] business global middleware.js not found`);
    }
 

    // Register routes after loading middleware
    routerLoader(app);

    // Validate dynamic parameters such as /:id within the relevant routes to avoid unnecessary global validation
    // app.use(app.middlewares.apiParamsVerify)
    
    console.log(`-- [start] routerLoader done --`);

    // Start the server
    try {
      const port = process.env.PORT || 8080;
      const host = process.env.HOST || "127.0.0.1";
      app.listen(port, host);
      console.log(`服务启动成功, 监听端口: http://${host}:${port}`);
    } catch (error) {
      console.error("启动服务失败", error);
    }

    return app
  },
};
