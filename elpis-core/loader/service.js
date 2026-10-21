const path = require('path')
const { sep } = require('path')
const glob = require('glob') // Discover files in the directory
/**
 * service loader
 * @param {object} app Koa application
 *
 * Load modules and register them on the Koa application
 * Access services through app.service.<directory>.<file>
 * app/service
 *    |
 *    |-- custom-module
 *            |
 *            |-- custom-service.js
 *
 * Access the module as app.service.customModule.customService
 *      ↓
 * app.service = {
 *          customModule: {
 *              customService: require(modulePath)
 *            }
 *      }
 *
 */
module.exports = (app) => {
  // Initialize the service registry for the Koa application
  const service = {}

  // Discover core files under app/service
  const ElpisServicePath = path.resolve(__dirname, `..${sep}..${sep}app${sep}service`)
  const ElpisFileList = glob.sync(path.resolve(ElpisServicePath, `.${sep}**${sep}**.js`))
  loadService(app, ElpisFileList)

  // Discover application files under app/service
  const BussinessServicePath = path.resolve(app.businessDir, `.${sep}service`)
  const BussinessFileList = glob.sync(path.resolve(BussinessServicePath, `.${sep}**${sep}**.js`))
  loadService(app, BussinessFileList)

  function loadService(app, fileList) {
    // Load each file into app.service
    fileList.forEach((file) => {
      // Extract the file name
      let fileName = path.resolve(file)

      // Extract the relative path: app/service/custom-module/custom-service.js => custom-module/custom-service
      // Remove the app/service/ prefix
      fileName = fileName.substring(
        fileName.lastIndexOf(`service${sep}`) + `service${sep}`.length,
        fileName.lastIndexOf(`.js`)
      )

      // Convert path segments to camelCase: custom-module/custom-service => customModule/customService
      fileName = fileName.replace(/[_-][a-z]/gi, (s) => s.substring(1).toUpperCase())

      // Load the module into the service registry
      let fileNames = fileName.split(sep)

      // [custom-module, custom-service] => { customModule: { customService: require(modulePath) } }
      let temService = service
      for (let i = 0; i < fileNames.length; i++) {
        if (i == fileNames.length - 1) {
          // Leaf module
          const ServiceModule = require(path.resolve(file))(app) // The service module returns a class
          temService[fileNames[i]] = new ServiceModule() // Create an instance
        } else {
          // Nested directory
          if (!temService[fileNames[i]]) {
            temService[fileNames[i]] = {}
          }
          temService = temService[fileNames[i]]
        }
      }
    })

    // Attach the service registry to the Koa application
    app.service = service
  }
}
