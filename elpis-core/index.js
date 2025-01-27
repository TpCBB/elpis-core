const Koa = require("koa");
const path = require("path");
const { sep } = path; // 路径分隔符, 在windows下是 \ 在mac下是 / 兼容斜杠
const env = require("./env"); // 环境变量

const middlewareLoader = require("./loader/middleware"); // 中间件
const serviceLoader = require("./loader/service"); // 服务
const routerLoader = require("./loader/router"); // 路由
const controllerLoader = require("./loader/controller"); // 控制器
const extendLoader = require("./loader/extend"); // 扩展
const configLoader = require("./loader/config"); // 配置
const routerSchemaLoader = require("./loader/router-schema"); // 路由Schema

module.exports = {
  /**
   * 启动参数
   * @param {*} options 项目配置
   */
  start(options = {}) {
    // 实例化koa
    const app = new Koa();

    // 项目配置
    app.options = options;

    // 项目根目录 process.cwd() 当前工作目录
    app.baseDir = options.baseDir || process.cwd();
    console.log(`output->baseDir`, app.baseDir);

    // 项目业务目录
    app.businessDir = path.resolve(app.baseDir, `.${sep}app`);
    console.log(`output->businessDir`, app.businessDir);

    // 获取环境
    app.env = env();
    console.log(`-- [start] env: ${app.env.get()} --`);

    // 加载中间件
    middlewareLoader(app);
    console.log(`-- [start] middlewareLoader done --`);

    // 加载服务
    serviceLoader(app);
    console.log(`-- [start] serviceLoader done --`);

    // 加载控制器
    controllerLoader(app);
    console.log(`-- [start] controllerLoader done --`);

    // 加载扩展
    extendLoader(app);
    console.log(`-- [start] extendLoader done --`);

    // 加载配置
    configLoader(app);
    console.log(`-- [start] configLoader done --`);

    // 加载路由Schema
    routerSchemaLoader(app);
    console.log(`-- [start] routerSchemaLoader done --`);

    // 加载全局中间件
    try {
      require(`${app.businessDir}${sep}middleware.js`)(app);
      console.log(`-- [start] load global middleware done`);
    } catch (error) {
      console.log(`output->error`, error);
      console.log(`[execption] global middleware.js not found`);
    }

    // 注册路由(加载路由之前要加载中间件)
    routerLoader(app);
    console.log(`-- [start] routerLoader done --`);

    // 启动服务
    try {
      const port = process.env.PORT || 8080;
      const host = process.env.HOST || "0.0.0.0";
      app.listen(port, host);
      console.log(`服务启动成功, 监听端口: http://${host}:${port}`);
    } catch (error) {
      console.error("启动服务失败", error);
    }
  },
};
