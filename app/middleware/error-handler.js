module.exports = (app) => {
  /**
   * Catch errors
   * @param {object} ctx Koa context
   * @param {function} next Next middleware
   */
  return async (ctx, next) => {
    try {
      await next();
    } catch (error) {
      const { status, message, detail } = error;

      app.logger.info(JSON.stringify(error));
      app.logger.error("[---- exception ----]", error);
      app.logger.error("[---- exception ----]", status, message, detail);
      //   Redirect page requests
      if (message && message.indexOf("template not found") > -1) {
        ctx.status = 302;
        ctx.redirect(app.options?.homePage || "/");
        return;
      }

      //   Return a consistent error response
      ctx.status = 200;
      ctx.body = {
        success: false,
        code: 50000,
        message: "网络异常, 请稍后再试",
      };
    }
  };
};
