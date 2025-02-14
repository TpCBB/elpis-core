const path = require("path");
const { sep } = require("path");
const glob = require("glob"); // 读取目录下的所有文件
/**
 * service loader
 * @param {object} app  Koa 实例
 *
 * 加载所有文件, 并注册到 Koa 实例上
 * 通过 'app.service.${目录}.${文件}' 访问
 * app/service
 *    |
 *    |-- custom-module
 *            |
 *            |-- custom-service.js
 *
 * => app.service.customModule.customService 访问到文件
 *      ↓
 * app.service = {
 *          customModule: {
 *              customService: require(文件地址)
 *            }
 *      }
 *
 */
module.exports = (app) => {
  // 读取 app/service/**/**.js目录下的所有文件
  const servicePath = path.resolve(app.businessDir, `.${sep}service`);
  const fileList = glob.sync(
    path.resolve(servicePath, `.${sep}**${sep}**.js`)
  );

  // 初始化 service 对象 最终要挂在到 app 实例上
  const service = {};

  // 遍历所有文件目录,把内容加载到 app.service 上
  fileList.forEach((file) => {
    // 提取文件名称
    let fileName = path.resolve(file);

    // 截取路径 app/service/custom-module/custom-service.js => custom-module/custom-service
    // 去掉 app/service/
    fileName = fileName.substring(
      fileName.lastIndexOf(`service${sep}`) + `service${sep}`.length,
      fileName.lastIndexOf(`.js`)
    );

    // 把文件名转换成驼峰命名  custom-module/custom-service => customModule/customService
    fileName = fileName.replace(/[_-][a-z]/gi, (s) =>
      s.substring(1).toUpperCase()
    );

    // 把文件内容加载到 service 对象上
    let fileNames = fileName.split(sep);

    // [custom-module, custom-service] = > { customModule: { customService: require(文件地址) } }
    let temService = service;
    for (let i = 0; i < fileNames.length; i++) {
      if (i == fileNames.length - 1) {
        // 最终文件
        const ServiceModule = require(path.resolve(file))(app); // service 是一个class
        temService[fileNames[i]] = new ServiceModule(); // 实例化
      } else {
        // 文件夹
        if (!temService[fileNames[i]]) {
          temService[fileNames[i]] = {};
        }
        temService = temService[fileNames[i]];
      }
    }
  });

  // 把 service 对象挂在到 app 实例上
  app.service = service;
};
