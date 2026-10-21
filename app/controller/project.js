module.exports = (app) => {
  const BaseController = require('./base.js')(app)
  return class ProjectController extends BaseController {
    /**
     * Get the project configuration by proj_key
     * @param {object} ctx Koa context
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
     * Get projects from the model associated with projectKey, or all projects if omitted
     *
     */
    async getList(ctx) {
      const { proj_key: projKey } = ctx.request.query

      const { project: projectService } = app.service
      const projectList = await projectService.getList({ projKey })

      // Select the essential fields
      const dtoProjectList = projectList.map((item) => {
        const { modelKey, key, name, desc, homePage } = item
        return { modelKey, key, name, desc, homePage }
      })
      this.success(ctx, dtoProjectList)
    }

    /**
     * Return structured model and project data
     * @param {object} ctx Koa context
     */
    async getModelList(ctx) {
      const { project: projectService } = app.service
      const modelList = await projectService.getModelList(ctx)

      // Build the response using only the essential fields
      const dtoModelList = modelList.reduce((preList, curItem) => {
        const { model, project } = curItem
        // Select the essential model fields
        const { key, name, desc } = model
        const dtoModel = { key, name, desc }
        // Select the essential project fields
        const dtoProject = Object.keys(project).reduce((preList, curItem) => {
          const { key, name, desc, homePage } = project[curItem]
          preList[curItem] = { key, name, desc, homePage }
          return preList
        }, {})

        // Combine the model and project fields
        preList.push({
          model: dtoModel,
          project: dtoProject
        })
        // Return the result
        return preList
      }, [])

      this.success(ctx, dtoModelList)
    }
  }
}
