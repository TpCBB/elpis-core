module.exports = (app) => {
  const baseConfig = require('./base')(app)
  const model = require('../../model/index')(app)
  return class ProjectService extends baseConfig {
    /**
     * Get the project configuration by projKey
     * @param {string} projKey Project key
     */
    getProjectConfig({ projKey }) {
      let projectConfig
      model.forEach((item) => {
        if (item.project?.[projKey]) {
          projectConfig = item.project[projKey]
        }
      })
      return projectConfig
    }
    /**
     * Get projects from the same model, or all projects if projKey is omitted
     *
     */
    async getList({ projKey }) {
      return model.reduce((preList, modelItem) => {
        const { project } = modelItem
        // Return projects from the matching model when projKey is provided; otherwise return all projects
        if (projKey && !project[projKey]) {
          return preList
        }

        for (let pKey in project) {
          preList.push(project[pKey])
        }

        return preList
      }, [])
    }

    /**
     * Get structured data for all models and projects
     *
     */
    async getModelList() {
      return model
    }
  }
}
