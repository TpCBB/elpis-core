// 引入核心模块
const ElpisCore = require('./elpis-core')

// 引入前端工程化方法
// 会导致 webpack.base.js 中 entry 配置被覆盖 
// const FEbuildDev = require('./app/webpack/dev.js')
// const FEbuildProd = require('./app/webpack/prod.js')

module.exports = {
  /**
   * 启动服务
   * @param {*} options 透传 配置
   */
  serverStart(options = {}) {
    const app = ElpisCore.start(options)
    return app
  },

  /**
   * 编译构建前端工程
   * @param {String} env local/production
   */
  frontendBuild(env) {
    if (env === 'local') {
      require('./app/webpack/dev.js')()
    } else if (env === 'production') {
      require('./app/webpack/prod.js')()
    }
  }
}
