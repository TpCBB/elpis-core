const path = require("path");
const { sep } = require("path");
const glob = require("glob"); // 读取目录下的所有文件
/**
 * middleware loader
 * @param {object} app  Koa 实例
 *
 * 加载所有中间件, 并注册到 Koa 实例上
 * 通过 'app.middleware.${目录}.${文件}' 访问
 * app/middleware
 *    |
 *    |-- custom-module
 *            |
 *            |-- custom-middleware.js
 *
 * => app.middleware.customModule.customMiddleware 访问到文件
 *      ↓
 * app.middleware = {
 *          customModule: {
 *              customMiddleware: require(文件地址)
 *            }
 *      }
 *
 */
module.exports = (app) => {
  // 读取 app/middleware/**/**.js目录下的所有文件
  const middlewarePath = path.resolve(app.businessDir, `${sep}middleware`);
  const fileList = glob.sync(
    path.resolve(middlewarePath, `${sep}**${sep}**.js`)
  );

  // 初始化 middleware 对象 最终要挂在到 app 实例上
  const middleware = {};

  // 遍历所有文件目录,把内容加载到 app.middleware 上
  fileList.forEach((file) => {
    // 提取文件名称
    let fileName = path.resolve(file);

    // 截取路径 app/middleware/custom-module/custom-middleware.js => custom-module/custom-middleware
    // 去掉 app/middleware/
    fileName = fileName.substring(
      fileName.lastIndexOf(`middleware${sep}`) + `middleware${sep}`.length,
      fileName.lastIndexOf(`.js`)
    );

    // 把文件名转换成驼峰命名  custom-module/custom-middleware => customModule/customMiddleware
    fileName = fileName.replace(/[_-][a-z]/gi, (s) =>
      s.substring(1).toUpperCase()
    );

    // 把文件内容加载到 middleware 对象上
    let fileNames = fileName.split(sep);

    // [custom-module, custom-middleware] = > { customModule: { customMiddleware: require(文件地址) } }
    let temMiddleware = middleware;
    for (let i = 0; i < fileNames.length; i++) {
      if (i == fileNames.length - 1) {
        temMiddleware[fileNames[i]] = require(path.resolve(file))(app); // 每个文件都传入 app 实例
      } else {
        if (!temMiddleware[fileNames[i]]) {
          temMiddleware[fileNames[i]] = {};
        }
        temMiddleware = temMiddleware[fileNames[i]];
      }
    }
  });

  // 把 middleware 对象挂在到 app 实例上
  app.middleware = middleware;
};
