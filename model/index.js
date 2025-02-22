/**
 * 该文件用于 解析 model 配置, 并返回组织且继承后的数据结构
 */
const glob = require('glob')
const path = require('path')
const _ = require('lodash')
const { sep } = path

// 整理 project 要继承 model 的配置
const projectExtendModel = (model, project) => {
  return _.mergeWith({}, model, project, (modelValue, projValue) => {
    //  处理 数组 合并的 特殊情况
    if (Array.isArray(modelValue) && Array.isArray(projValue)) {
      let result = []

      // 因为 project 继承 model 的配置, 所以需要把 model 的配置合并到 result 中

      // project 有key , model 也有 key => 修改 (重载)
      // project 有key , model 没有 key => 添加 (新增)
      // project 没有key , model 有 key => 合并 (继承)

      // 处理 重载 和 继承
      for (let i = 0; i < modelValue.length; i++) {
        let modelItem = modelValue[i]
        const projectItem = projValue.find((projectItem) => projectItem.key === modelItem.key)
        // 如果 projectItem 存在, 则递归调用 projectExtendModel 合并
        result.push(projectItem ? projectExtendModel(modelItem, projectItem) : modelItem)
      }

      // 处理 新增
      for (let i = 0; i < projValue.length; i++) {
        const projectItem = projValue[i]
        const modelItem = modelValue.find((modelItem) => modelItem.key === projectItem.key)
        if (!modelItem) {
          result.push(projectItem)
        }
      }

      return result
    }
  })
}

/**
 * 解析 model 配置, 并返回组织且继承后的数据结构
 *  [{
 *      model:${model},
 *      project:{
 *       proj1:${proj1} ,
 *       proj2:${proj2}
 *      }
 *  }]
 */
module.exports = (app) => {
  const modelList = []
  const modelPath = path.resolve(app.baseDir, `.${sep}model`)
  const fileList = glob.sync(path.join(modelPath, `.${sep}**${sep}**.js`))
  fileList.forEach((file) => {
    if (file.indexOf('index.js') > -1) {
      return
    }
    // 统一处理斜杠问题
    const normalizedFile = file.replace(/\//g, '/')
    // 区分配置类型 (model / project)
    const type = normalizedFile.indexOf(`/project/`) > -1 ? 'project' : 'model'
    if (type === 'project') {
      const modelKey = normalizedFile.match(/\/model\/(.*?)\/project\//)?.[1]
      const projectKey = normalizedFile.match(/\/project\/(.*?)\.js/)?.[1]

      let modelItem = modelList.find((item) => item.model?.key === modelKey)

      if (!modelItem) {
        // 初始化 模型结构
        modelItem = {}
        modelList.push(modelItem)
      }
      if (!modelItem.project) {
        // 初始化 项目结构
        modelItem.project = {}
      }
      modelItem.project[projectKey] = require(path.resolve(file))
      modelItem.project[projectKey].key = projectKey // 注入项目key
    }
    //  output->file D:/code/eplis/model/buiness/model.js 取  /model/buiness/model.js 中间夹住的
    if (type === 'model') {
      const modelKey = normalizedFile.match(/\/model\/(.*?)\/model\.js/)?.[1]

      let modelItem = modelList.find((item) => item.model?.key === modelKey)

      if (!modelItem) {
        // 初始化 模型结构
        modelItem = {}
        modelList.push(modelItem)
      }
      modelItem.model = require(path.resolve(file))
      modelItem.model.key = modelKey // 注入模型key
    }
  })

  // 整理 project 要继承 model 的配置

  modelList.forEach((item) => {
    const { project, model } = item
    for (const key in project) {
      project[key] = projectExtendModel(model, project[key])
    }
  })
  return modelList
}
