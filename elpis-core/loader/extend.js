const path = require('path')
const { sep } = require('path')
const glob = require('glob') // Discover files in the directory
/**
 * extend loader
 * @param {object} app Koa application
 *
 * Load modules and register them on the Koa application
 * Extensions attach directly to the Koa application.
 * app/extend/custom-extend.js becomes app.customExtend.
 * Each module exports a factory that receives the Koa application.
 *
 */
module.exports = (app) => {
  // Discover core files under app/extend
  const ElpisExtendPath = path.resolve(__dirname, `..${sep}..${sep}app${sep}extend`)
  const ElpisFileList = glob.sync(path.resolve(ElpisExtendPath, `.${sep}**${sep}**.js`))
  loadExtend(app, ElpisFileList)

  // Discover application files under app/extend
  const BussinessExtendPath = path.resolve(app.businessDir, `.${sep}extend`)
  const BussinessFileList = glob.sync(path.resolve(BussinessExtendPath, `.${sep}**${sep}**.js`))
  loadExtend(app, BussinessFileList)

  function loadExtend(app, fileList) {
    // Load each extension onto the Koa application
    fileList.forEach((file) => {
      // Extract the file name
      let fileName = path.resolve(file)

      // Extract the relative path: app/extend/custom-extend.js => custom-extend
      // Remove the app/extend/ prefix
      fileName = fileName.substring(
        fileName.lastIndexOf(`extend${sep}`) + `extend${sep}`.length,
        fileName.lastIndexOf(`.js`)
      )

      // Convert the name to camelCase: custom-extend => customExtend
      fileName = fileName.replace(/[_-][a-z]/gi, (s) => s.substring(1).toUpperCase())

      // Skip keys already present on the application to avoid collisions
      if (Object.prototype.hasOwnProperty.call(app, fileName)) {
        console.log(`[extend load error] ${fileName} is already exists`)
        return
      }
      // Attach the extension to the Koa application
      app[fileName] = require(path.resolve(file))(app)
    })
  }
}
