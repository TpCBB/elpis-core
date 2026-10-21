const KoaRouter = require('koa-router')
const glob = require('glob')
const path = require('path')
const sep = path.sep

/**
/**
 * router loader
 * @param {object} app Koa application
 *
 * File location: app/router
 *
 * Load route definitions into Koa Router
 *
 */
module.exports = (app) => {
  // Create the Koa Router instance
  const router = new KoaRouter()

  // Discover application route files under app/router
  const BussinessRouterPath = path.resolve(app.businessDir, `.${sep}router`)
  const BussinessFileList = glob.sync(path.resolve(BussinessRouterPath, `.${sep}**${sep}**.js`))

  // Discover core route files under app/router
  const ElpisRouterPath = path.resolve(__dirname, `..${sep}..${sep}app${sep}router`)
  const ElpisFileList = glob.sync(path.resolve(ElpisRouterPath, `.${sep}**${sep}**.js`))

  // All route definition files
  const fileList = [...BussinessFileList, ...ElpisFileList]

  // Register routes
  fileList.forEach((file) => {
    /**
     * eg. file: app/router/api.js
     * modules.exports = (app,router)=>{
     *  router.get('/api',controller.api)
     * }
     */

    require(path.resolve(file))(app, router)
  })

  // Handle unmatched routes
  router.all('*', async (ctx, next) => {
    ctx.status = 302 // Temporary redirect
    ctx.redirect(`${app?.options?.homePage ?? '/'}`)
  })

  // Attach the router to the Koa application
  app.use(router.routes())
  app.use(router.allowedMethods()) // Handle HTTP 405 and 501 responses
}
