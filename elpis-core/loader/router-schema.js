const path = require('path')
const glob = require('glob')
const { sep } = path
/**
 * router-schema loader
 * @param {object} app
 *
 * Compile API constraints with JSON Schema and Ajv for api-params-verify middleware
 *
 * File location: app/router-schema
 *
 * Output:
 * app.routerSchema = {
 *  '${api1}': ${jsonSchema1},
 *  '${api2}': ${jsonSchema2},
 *  ...
 * }
 *
 */
module.exports = (app) => {
  //Register all route schemas
  let routerSchema = {}
  // Discover core route schema files
  const ElpisRouterSchemaPath = path.resolve(__dirname, `..${sep}..${sep}app${sep}router-schema`)
  const ElpisFileList = glob.sync(path.resolve(ElpisRouterSchemaPath, `.${sep}**${sep}**.js`))
  loadRouterSchema(app, ElpisFileList)

  // Discover application route schema files
  const BussinessRouterSchemaPath = path.resolve(app.businessDir, `.${sep}router-schema`)
  const BussinessFileList = glob.sync(path.resolve(BussinessRouterSchemaPath, `.${sep}**${sep}**.js`))
  loadRouterSchema(app, BussinessFileList)

  function loadRouterSchema(app, fileList) {
    fileList.forEach((file) => {
      routerSchema = {
        ...routerSchema,
        ...require(path.resolve(file))
      }
    })
    app.routerSchema = routerSchema
  }
}
