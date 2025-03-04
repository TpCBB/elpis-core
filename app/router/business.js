module.exports = (app, router) => {
  const { business: businessController } = app.controller
  router.get('/api/proj/product/list', businessController.getList.bind(businessController))
  router.delete('/api/proj/product', businessController.delete.bind(businessController))
  router.get('/api/proj/product_enum/list', businessController.getEnumList.bind(businessController))
}
