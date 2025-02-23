module.exports = (app, router) => {
  const { project: projectController } = app.controller;
  router.get("/api/project/getModelList", projectController.getModelList.bind(projectController));
};
