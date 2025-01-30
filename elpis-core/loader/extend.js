const path = require("path");
const { sep } = require("path");
const glob = require("glob"); // 读取目录下的所有文件
/**
 * extend loader
 * @param {object} app  Koa 实例
 *
 * 加载所有文件, 并注册到 Koa 实例上
 * 通过 'app.extend.${目录}.${文件}' 访问
 * app/extend
 *     |
 *     |-- custom-extend.js
 *
 * => app.extend.customModule.customExtend 访问到文件
 *      ↓
 * app.extend = {
 *          customModule: {
 *              customExtend: require(文件地址)
 *            }
 *      }
 *
 */
module.exports = (app) => {
  // 读取 app/extend/**.js目录下的所有文件
  const extendPath = path.resolve(app.businessDir, `${sep}extend`);
  const fileList = glob.sync(path.resolve(extendPath, `${sep}**${sep}**.js`));

  // 遍历所有文件目录 把extend挂载到app实例上
  fileList.forEach((file) => {
    // 提取文件名称
    let fileName = path.resolve(file);

    // 截取路径 app/extend/custom-extend.js => custom-extend
    // 去掉 app/extend/
    fileName = fileName.substring(
      fileName.lastIndexOf(`extend${sep}`) + `extend${sep}`.length,
      fileName.lastIndexOf(`.js`)
    );

    // 把文件名转换成驼峰命名  custom-extend => customExtend
    fileName = fileName.replace(/[_-][a-z]/gi, (s) =>
      s.substring(1).toUpperCase()
    );

    // 过滤app已存在的key 重名处理
    if (Object.prototype.hasOwnProperty.call(app, fileName)) {
      console.log(`[extend load error] ${fileName} is already exists`);
      return;
    }
    // 挂载extend到app实例上
    app[fileName] = require(path.resolve(file))(app);
  });
};
