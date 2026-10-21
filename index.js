// Import the core module
const ElpisCore = require('./elpis-core')

// Import frontend build helpers
// Eager imports can overwrite the entry configuration in config.base.js
// const FEbuildDev = require('./app/webpack/dev.js')
// const FEbuildProd = require('./app/webpack/prod.js')

module.exports = {
  /**
   * Start the server
   * @param {*} options Configuration passed to the core
   */
  serverStart(options = {}) {
    const app = ElpisCore.start(options)
    return app
  },

  /**
   * Server-side base classes
   */
  Controller: {
    Base: require('./app/controller/base.js')
  },

  Service: {
    Base: require('./app/service/base.js')
  },

  /**
   * Build the frontend application
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
