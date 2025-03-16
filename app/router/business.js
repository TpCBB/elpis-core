module.exports = (app, router) => {
  const { business: businessController } = app.controller
  router.get('/api/proj/product', businessController.get.bind(businessController))
  router.get('/api/proj/product/list', businessController.getList.bind(businessController))
  router.delete('/api/proj/product', businessController.delete.bind(businessController))
  router.get('/api/proj/product_enum/list', businessController.getEnumList.bind(businessController))
  router.post('/api/proj/product', businessController.create.bind(businessController))
  router.put('/api/proj/product', businessController.update.bind(businessController))
}
