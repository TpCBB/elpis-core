const path = require('path')
const { sep } = require('path')

/**
 * config loader
 * @param {object} app Koa application
 *
 * Load environment-specific configuration for local, beta, or production
 * Override default configuration with environment settings and assign the result to app.config
 *
 * Project configuration directory: yourproject/config/
 *
 * Configuration files in this directory
 * Default configuration: config/config.default.js
 * Local configuration: config/config.local.js
 * Beta configuration: config/config.beta.js
 * Production configuration: config/config.prod.js
 *
 */

module.exports = (app) => {
  // Read the default configuration
  let defaultConfig = {}
  // Read the default configuration

  // Read the core configuration directory
  const ElpisConfigPath = path.resolve(__dirname, `..${sep}..${sep}config`)
  defaultConfig = require(path.resolve(ElpisConfigPath, `.${sep}config.default.js`))

  // Read the application configuration directory
  const BussinessConfigPath = path.resolve(process.cwd(), `.${sep}config`)

  try {
    defaultConfig = {
      ...defaultConfig,
      ...require(path.resolve(BussinessConfigPath, `.${sep}config.default.js`))
    }
  } catch (error) {
    console.log(`[exception] config.default.js not found`)
  }

  // Read the configuration for the current environment
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
  // Merge default and environment configuration into app.config
  app.config = Object.assign({}, defaultConfig, envConfig)
}
