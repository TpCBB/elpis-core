module.exports = (app, router) => {
  // Get viewController
  const { view: viewController } = app.controller;
  // Register /view/:page to render the generated page template on the server
  router.get("/view/:page", viewController.renderPage.bind(viewController));
  // Match nested page URLs for frontend HTML5 history routing
  router.get("/view/:page/*", viewController.renderPage.bind(viewController));
};
