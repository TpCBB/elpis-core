const path = require("path");
const { sep } = require("path");

/**
 * config loader
 * @param {object} app koa实例
 *
 * 配置区分 本地/测试/生产 通过 env 环境读取不同的文件配置 env.config
 * 通过env.config 覆盖 default.config 加载到 app.config 上
 *
 * 项目根目录yourproject/config/
 *
 * 目录下对应的 config 配置
 * 默认配置: config/config.default.js
 * 本地配置: config/config.local.js
 * 测试配置: config/config.beta.js
 * 生产配置: config/config.prod.js
 *
 */

module.exports = (app) => {
  // 获取 config 目录
  const configPath = path.resolve(app.baseDir, `${sep}config`);

  // 获取 default.config
  let defaultConfig = {};
  try {
    defaultConfig = require(path.resolve(
      configPath,
      `${sep}config.default.js`
    ));
  } catch (error) {
    console.log(`[exception] config.default.js not found`);
  }

  // 根据环境 获取 env.config
  let envConfig = {};
  try {
    if (app.isLocal()) {
      envConfig = require(path.resolve(configPath, `${sep}config.local.js`));
    } else if (app.isBeta()) {
      envConfig = require(path.resolve(configPath, `${sep}config.beta.js`));
    } else if (app.isProd()) {
      envConfig = require(path.resolve(configPath, `${sep}config.prod.js`));
    }
  } catch (error) {
    console.log(`[exception] config.${app.env}.js not found`);
  }
  // 合并 default.config 和 env.config 到 app.config 上
  app.config = Object.assign({}, defaultConfig, envConfig);
};