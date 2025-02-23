module.exports = (app) => {
  const BaseController = require('./base.js')(app)
  return class ProjectController extends BaseController {
    /**
     * 返回模型项目的结构化数据
     * @param {object} ctx 上下文
     */
    async getModelList(ctx) {
      const { project: projectService } = app.service
      const modelList = await projectService.getModelList(ctx)

      // 构造返回结果, 只返回关键数据
      const dtoModelList = modelList.reduce((preList, curItem) => {
        const { model, project } = curItem
        // 构造model的关键数据
        const { key, name, desc } = model
        const dtoModel = { key, name, desc }
        // 构造project的关键数据
        const dtoProject = {};

        for (const projKey in project) {
          const { key, name, desc, homePage } = project[projKey]
          dtoProject[projKey] = { key, name, desc, homePage }
        }

        // 将model和project的关键数据合并
        preList.push({
          model: dtoModel,
          project: dtoProject
        })
        // 返回结果
        return preList
      }, [])

      this.success(ctx, dtoModelList)
    }
  }
}
