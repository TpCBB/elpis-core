module.exports = (app) => {
  const BaseService = require('./base')(app)
  const model = require('../../model/index')(app)
  return class ProjectService extends BaseService {
    /**
     * 根据 projKey 获取项目配置
     * @param {string} projKey 项目key
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
     * 获取统一模型下的项目列表,  如果无 projKey 则获取全部
     *
     */
    async getList({ projKey }) {
      return model.reduce((preList, modelItem) => {
        const { project } = modelItem
        // 如果有传 projket 则只返回对应的项目 否则返回全部
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
     * 获取所有模型与项目结的构化数据
     *
     */
    async getModelList() {
      return model
    }
  }
}
