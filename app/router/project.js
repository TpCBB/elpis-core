module.exports = (app, router) => {
  const { project: projectController } = app.controller;
  router.get("/api/project", projectController.get.bind(projectController));
  router.get("/api/project/getList", projectController.getList.bind(projectController));
  router.get("/api/project/getModelList", projectController.getModelList.bind(projectController));
};
