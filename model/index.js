/**
 * Parse model configuration and return the merged model/project structure
 */
const glob = require('glob')
const path = require('path')
const _ = require('lodash')
const { sep } = path

// Merge inherited model configuration into each project
const projectExtendModel = (model, project) => {
  return _.mergeWith({}, model, project, (modelValue, projValue) => {
    //  Handle array merging by item key
    if (Array.isArray(modelValue) && Array.isArray(projValue)) {
      let result = []

      // Include inherited model entries in the merged result

      // Key in both project and model: override the model entry
      // Key only in project: add a new entry
      // Key only in model: inherit the model entry

      // Apply overrides and inherited entries
      for (let i = 0; i < modelValue.length; i++) {
        let modelItem = modelValue[i]
        const projectItem = projValue.find((projectItem) => projectItem.key === modelItem.key)
        // Recursively merge matching project and model entries
        result.push(projectItem ? projectExtendModel(modelItem, projectItem) : modelItem)
      }

      // Add project-only entries
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
 * Parse model configuration and return the merged model/project structure
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
    // Normalize path separators
    const normalizedFile = file.replace(/\//g, '/')
    // Determine the configuration type: model or project
    const type = normalizedFile.indexOf(`/project/`) > -1 ? 'project' : 'model'
    if (type === 'project') {
      const modelKey = normalizedFile.match(/\/model\/(.*?)\/project\//)?.[1]
      const projectKey = normalizedFile.match(/\/project\/(.*?)\.js/)?.[1]

      let modelItem = modelList.find((item) => item.model?.key === modelKey)

      if (!modelItem) {
        // Initialize the model structure
        modelItem = {}
        modelList.push(modelItem)
      }
      if (!modelItem.project) {
        // Initialize the project structure
        modelItem.project = {}
      }
      modelItem.project[projectKey] = require(path.resolve(file))
      modelItem.project[projectKey].key = projectKey // Set the project key
      modelItem.project[projectKey].modelKey = modelKey // Set the model key
    }
    //  Extract the model key from a path such as /model/business/model.js
    if (type === 'model') {
      const modelKey = normalizedFile.match(/\/model\/(.*?)\/model\.js/)?.[1]

      let modelItem = modelList.find((item) => item.model?.key === modelKey)

      if (!modelItem) {
        // Initialize the model structure
        modelItem = {}
        modelList.push(modelItem)
      }
      modelItem.model = require(path.resolve(file))
      modelItem.model.key = modelKey // Set the model key
    }
  })

  // Merge inherited model configuration into each project

  modelList.forEach((item) => {
    const { project, model } = item
    for (const key in project) {
      project[key] = projectExtendModel(model, project[key])
    }
  })
  return modelList
}
