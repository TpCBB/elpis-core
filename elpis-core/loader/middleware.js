const path = require('path')
const { sep } = require('path')
const glob = require('glob') // Discover files in the directory
/**
 * middleware loader
 * @param {object} app Koa application
 *
 * Load middleware modules and register them on the Koa application
 * Access middleware through app.middlewares.<directory>.<file>
 * app/middleware
 *    |
 *    |-- custom-module
 *            |
 *            |-- custom-middleware.js
 *
 * Access the module as app.middlewares.customModule.customMiddleware
 *      ↓
 * app.middlewares = {
 *          customModule: {
 *              customMiddleware: require(modulePath)
 *            }
 *      }
 *
 */
module.exports = (app) => {
  // Discover files under app/middleware
  // Initialize the middleware registry for the Koa application
  const middlewares = {}
  const ElpisMiddlewarePath = path.resolve(__dirname, `..${sep}..${sep}app${sep}middleware`)
  const ElpisFileList = glob.sync(path.resolve(ElpisMiddlewarePath, `.${sep}**${sep}**.js`))
  loadMiddleware(app, ElpisFileList)

  // Discover application middleware under app/middleware
  const BussinessMiddlewarePath = path.resolve(app.businessDir, `.${sep}middleware`)
  const BussinessFileList = glob.sync(path.resolve(BussinessMiddlewarePath, `.${sep}**${sep}**.js`))
  loadMiddleware(app, BussinessFileList)

  function loadMiddleware(app, fileList) {
    // Load each file into app.middlewares
    fileList.forEach((file) => {
      // Extract the file name
      let fileName = path.resolve(file)

      // Extract the relative path: app/middleware/custom-module/custom-middleware.js => custom-module/custom-middleware
      // Remove the app/middleware/ prefix
      fileName = fileName.substring(
        fileName.lastIndexOf(`middleware${sep}`) + `middleware${sep}`.length,
        fileName.lastIndexOf(`.js`)
      )

      // Convert path segments to camelCase: custom-module/custom-middleware => customModule/customMiddleware
      fileName = fileName.replace(/[_-][a-z]/gi, (s) => s.substring(1).toUpperCase())

      // Split the relative path into segments
      let fileNames = fileName.split(sep)

      // [custom-module, custom-middleware] => { customModule: { customMiddleware: require(modulePath) } }
      let temMiddleware = middlewares
      for (let i = 0; i < fileNames.length; i++) {
        if (i == fileNames.length - 1) {
          temMiddleware[fileNames[i]] = require(path.resolve(file))(app) // Pass the Koa application to each module
        } else {
          if (!temMiddleware[fileNames[i]]) {
            temMiddleware[fileNames[i]] = {}
          }
          temMiddleware = temMiddleware[fileNames[i]]
        }
      }
    })

    // Attach the middleware registry to the Koa application
    app.middlewares = middlewares
  }
}
