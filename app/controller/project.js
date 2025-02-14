module.exports = (app) => {
  const BaseController = require("./base.js")(app);
  return class ProjectController extends BaseController {
    /**
     * 请求列表
     * @param {object} ctx 上下文
     */
    async getList(ctx) {
      console.log("output=--->ctx.request.body", ctx.request.body);
      const { project: projectService } = app.service;
      const data = await projectService.getList(ctx);
      this.success(ctx, data);
    }
  };
};
