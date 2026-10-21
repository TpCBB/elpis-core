// Start the local development server
const express = require('express')
const consoler = require('consoler')
const path = require('path')
const webpack = require('webpack')
const devMiddleware = require('webpack-dev-middleware')
const hotMiddleware = require('webpack-hot-middleware')
const { webpackDevConfig, DEV_SERVER_CONFIG } = require('./config/config.dev')

module.exports = () => {
  const compiler = webpack(webpackDevConfig)

  const app = express()

  // Static asset directory
  app.use(express.static(path.resolve(__dirname, '../public/dist')))

  // Register webpack-dev-middleware
  app.use(
    devMiddleware(compiler, {
      // Write only template files to disk
      writeToDisk: (filePath) => filePath.endsWith('.tpl'),
      // Static asset directory
      publicPath: webpackDevConfig.output.publicPath,

      // Cross-origin response headers
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
        'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization'
      },

      // Build statistics configuration
      stats: {
        colors: true
      }
    })
  )

  // Register webpack-hot-middleware
  app.use(
    hotMiddleware(compiler, {
      path: `/${DEV_SERVER_CONFIG.HMR_PATH}`,
      heartbeat: 10000
    })
  ) //Keep the client updated through the HMR event stream

  consoler.info(`请等待webpack初次构建完成提示...`)

  // Start the server
  app.listen(DEV_SERVER_CONFIG.PORT, () => {
    consoler.info(`app listening on: http://${DEV_SERVER_CONFIG.HOST}:${DEV_SERVER_CONFIG.PORT}`)
  })
}
