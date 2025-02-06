module.exports = (app, router) => {
  const { project: projectController } = app.controller;
  router.post("/api/project/getlist", projectController.getList.bind(projectController));
};
