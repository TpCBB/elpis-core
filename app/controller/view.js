module.exports = (app) => {
  return class ViewController {
    /**
     * Render the page
     * @param {object} ctx Koa context
     * Resolve the template relative to the path configured in middleware.js (./app/public)
     * ctx.params.page comes from the route parameters
     * The Koa context wraps the request and response
     */
    async renderPage(ctx) {
      // koa-nunjucks-2 provides the ctx.render method
      app.logger.info(`[viewcontroller] query:${JSON.stringify(ctx.request.query)}`)
      app.logger.info(`[viewcontroller] params:${JSON.stringify(ctx.request.params)}`)
      const { proj_key: projKey } = ctx.request.query
      await ctx.render(`dist/entry.${ctx.params.page}`, {
        projKey,
        env: app.env.get(),
        options: JSON.stringify(app.options)
      })
    }
  }
}
