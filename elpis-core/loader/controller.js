const path = require('path')
const { sep } = require('path')
const glob = require('glob') // Discover files in the directory
/**
 * controller loader
 * @param {object} app Koa application
 *
 * Load modules and register them on the Koa application
 * Access modules through app.controller.<directory>.<file>
 * app/controller
 *    |
 *    |-- custom-module
 *            |
 *            |-- custom-controller.js
 *
 * Access the module as app.controller.customModule.customController
 *      ↓
 * app.controller = {
 *          customModule: {
 *              customController: require(modulePath)
 *            }
 *      }
 *
 */
module.exports = (app) => {
  // Initialize the controller registry for the Koa application
  const controller = {}
  // Discover application files under app/controller
  const BussinessControllerPath = path.resolve(app.businessDir, `.${sep}controller`)
  const BussinessFileList = glob.sync(path.resolve(BussinessControllerPath, `.${sep}**${sep}**.js`))
  loadController(app, BussinessFileList)

  // Discover core files under app/controller
  const ElpisControllerPath = path.resolve(__dirname, `..${sep}..${sep}app${sep}controller`)
  const ElpisFileList = glob.sync(path.resolve(ElpisControllerPath, `.${sep}**${sep}**.js`))
  loadController(app, ElpisFileList)

  function loadController(app, fileList) {
    // Load each file into app.controller
    fileList.forEach((file) => {
      // Extract the file name
      let fileName = path.resolve(file)

      // Extract the relative path: app/controller/custom-module/custom-controller.js => custom-module/custom-controller
      // Remove the app/controller/ prefix
      fileName = fileName.substring(
        fileName.lastIndexOf(`controller${sep}`) + `controller${sep}`.length,
        fileName.lastIndexOf(`.js`)
      )

      // Convert path segments to camelCase: custom-module/custom-controller => customModule/customController
      fileName = fileName.replace(/[_-][a-z]/gi, (s) => s.substring(1).toUpperCase())

      // Split the relative path into segments
      let fileNames = fileName.split(sep)

      // [custom-module, custom-controller] => { customModule: { customController: require(modulePath) } }
      let temController = controller
      for (let i = 0; i < fileNames.length; i++) {
        if (i == fileNames.length - 1) {
          // Leaf module
          const ControllerModule = require(path.resolve(file))(app) // The controller module returns a class
          temController[fileNames[i]] = new ControllerModule() // Create an instance
        } else {
          // Nested directory
          if (!temController[fileNames[i]]) {
            temController[fileNames[i]] = {}
          }
          temController = temController[fileNames[i]]
        }
      }
    })

    // Attach the controller registry to the Koa application
    app.controller = controller
  }
}
