const path = require('path')
const glob = require('glob')
const { sep } = path
/**
 * router-schema loader
 * @param {object} app
 *
 * 通过 json-schema 和 ajv 对api进行约束, 配合 api-params-verify 中间件使用
 *
 * 文件目录: app/router-schema/**.js
 *
 * 输出:
 * app.routerSchema = {
 *  '${api1}': ${jsonSchema1},
 *  '${api2}': ${jsonSchema2},
 *  ...
 * }
 *
 */
module.exports = (app) => {
  //注册所有router-schema
  let routerSchema = {}
  // 读取 核心中的 router-schema 下所有的文件
  const ElpisRouterSchemaPath = path.resolve(__dirname, `..${sep}..${sep}app${sep}router-schema`)
  const ElpisFileList = glob.sync(path.resolve(ElpisRouterSchemaPath, `.${sep}**${sep}**.js`))
  loadRouterSchema(app, ElpisFileList)

  // 读取 业务中的 router-schema 下所有的文件
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
