module.exports = (app) => {
  const BaseController = require('./base.js')(app)
  return class ProjectController extends BaseController {
    /**
     * 根据proj_key 获取项目配置
     * @param {object} ctx 上下文
     */
    async get(ctx) {
      const { proj_key: projKey } = ctx.request.query
      const { project: projectService } = app.service

      const projectConfig = projectService.getProjectConfig({ projKey })
      if (!projectConfig) {
        this.fail(ctx, '获取项目异常', 50000)
        return
      }
      this.success(ctx, projectConfig)
    }

    /**
     * 获取当前 projectKey 对应模型下面的项目列表 如果无projectKey 则全部获取
     *
     */
    async getList(ctx) {
      const { proj_key: projKey } = ctx.request.query

      const { project: projectService } = app.service
      const projectList = await projectService.getList({ projKey })

      // 构造关键数据
      const dtoProjectList = projectList.map((item) => {
        const { modelKey, key, name, desc, homePage } = item
        return { modelKey, key, name, desc, homePage }
      })
      this.success(ctx, dtoProjectList)
    }

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
        const dtoProject = Object.keys(project).reduce((preList, curItem) => {
          const { key, name, desc, homePage } = project[curItem]
          preList[curItem] = { key, name, desc, homePage }
          return preList
        }, {})

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
