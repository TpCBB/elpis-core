const path = require('path')
const { sep } = require('path')
const glob = require('glob') // 读取目录下的所有文件
/**
 * controller loader
 * @param {object} app  Koa 实例
 *
 * 加载所有文件, 并注册到 Koa 实例上
 * 通过 'app.controller.${目录}.${文件}' 访问
 * app/controller
 *    |
 *    |-- custom-module
 *            |
 *            |-- custom-controller.js
 *
 * => app.controller.customModule.customController 访问到文件
 *      ↓
 * app.controller = {
 *          customModule: {
 *              customController: require(文件地址)
 *            }
 *      }
 *
 */
module.exports = (app) => {
  // 初始化 controller 对象 最终要挂在到 app 实例上
  const controller = {}
  // 读取 业务中  app/controller/**/**.js目录下的所有文件
  const BussinessControllerPath = path.resolve(app.businessDir, `.${sep}controller`)
  const BussinessFileList = glob.sync(path.resolve(BussinessControllerPath, `.${sep}**${sep}**.js`))
  loadController(app, BussinessFileList)

  // 读取 核心中的 app/controller/**/**.js目录下的所有文件
  const ElpisControllerPath = path.resolve(__dirname, `..${sep}..${sep}app${sep}controller`)
  const ElpisFileList = glob.sync(path.resolve(ElpisControllerPath, `.${sep}**${sep}**.js`))
  loadController(app, ElpisFileList)

  function loadController(app, fileList) {
    // 遍历所有文件目录,把内容加载到 app.controller 上
    fileList.forEach((file) => {
      // 提取文件名称
      let fileName = path.resolve(file)

      // 截取路径 app/controller/custom-module/custom-controller.js => custom-module/custom-controller
      // 去掉 app/controller/
      fileName = fileName.substring(
        fileName.lastIndexOf(`controller${sep}`) + `controller${sep}`.length,
        fileName.lastIndexOf(`.js`)
      )

      // 把文件名转换成驼峰命名  custom-module/custom-controller => customModule/customController
      fileName = fileName.replace(/[_-][a-z]/gi, (s) => s.substring(1).toUpperCase())

      // 把文件名转换成数组
      let fileNames = fileName.split(sep)

      // [custom-module, custom-controller] = > { customModule: { customController: require(文件地址) } }
      let temController = controller
      for (let i = 0; i < fileNames.length; i++) {
        if (i == fileNames.length - 1) {
          // 最终文件
          const ControllerModule = require(path.resolve(file))(app) // controller 是一个class
          temController[fileNames[i]] = new ControllerModule() // 实例化
        } else {
          // 文件夹
          if (!temController[fileNames[i]]) {
            temController[fileNames[i]] = {}
          }
          temController = temController[fileNames[i]]
        }
      }
    })

    // 把 controller 对象挂在到 app 实例上
    app.controller = controller
  }
}
