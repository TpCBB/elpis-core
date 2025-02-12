module.exports = (app) => {
  /**
   * 错误捕获
   * @param {object} ctx 上下文
   * @param {function} next 下一个中间件
   */
  return async (ctx, next) => {
    try {
      await next();
    } catch (error) {
      const { status, message, detail } = error;

      app.logger.info(JSON.stringify(error));
      app.logger.error("[---- exception ----]", error);
      app.logger.error("[---- exception ----]", status, message, detail);
      //   页面重定向
      if (message && message.indexOf("template not found") > -1) {
        ctx.status = 302;
        ctx.redirect(app.options?.homePage || "/");
        return;
      }

      //   统一错误返回
      ctx.status = 200;
      ctx.body = {
        success: false,
        code: 50000,
        message: "网络异常, 请稍后再试",
      };
    }
  };
};
