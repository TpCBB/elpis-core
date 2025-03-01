module.exports = (app) => {
  return class ViewController {
    /**
     * 渲染页面
     * @param {object} ctx 上下文
     * out/entry是接着middleware.js中配置的模板路径(./app/public)
     * ctx.params.page 是路由中配置的参数
     * ctx 是 koa的的上下文,包装了request和response
     */
    async renderPage(ctx) {
      // 引入了中间件koa-nunjucks-2 会在app上挂载render方法
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
