const path = require('path')
const { sep } = require('path')

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
  // 获取 default.config
  let defaultConfig = {}
  // 获取 default.config

  // 获取 核心中 config 目录
  const ElpisConfigPath = path.resolve(__dirname, `..${sep}..${sep}config`)
  defaultConfig = require(path.resolve(ElpisConfigPath, `.${sep}config.default.js`))

  // 获取 业务中 config 目录
  const BussinessConfigPath = path.resolve(process.cwd(), `.${sep}config`)

  try {
    defaultConfig = {
      ...defaultConfig,
      ...require(path.resolve(BussinessConfigPath, `.${sep}config.default.js`))
    }
  } catch (error) {
    console.log(`[exception] config.default.js not found`)
  }

  // 根据环境 获取 env.config
  let envConfig = {}
  try {
    if (app.env.isLocal()) {
      envConfig = require(path.resolve(BussinessConfigPath, `.${sep}config.local.js`))
    } else if (app.env.isBeta()) {
      envConfig = require(path.resolve(BussinessConfigPath, `.${sep}config.beta.js`))
    } else if (app.env.isProd()) {
      envConfig = require(path.resolve(BussinessConfigPath, `.${sep}config.prod.js`))
    }
  } catch (error) {
    console.log(`[exception] config.${app.env.get()}.js not found`)
  }
  // 合并 default.config 和 env.config 到 app.config 上
  app.config = Object.assign({}, defaultConfig, envConfig)
}
