// 引入核心模块
const ElpisCore = require('./elpis-core')

module.exports = {
  /**
   * 启动服务
   * @param {*} options 透传 配置
   */
  serverStart(options = {}) {
    const app = ElpisCore.start(options)
    return app
  }
}
