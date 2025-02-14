const md5 = require("md5");
/**
 * API 签名合法性校验
 */
module.exports = (app) => {
  return async (ctx, next) => {
    
    if (ctx.path.indexOf("/api") < 0) {
      return await next();
    }

    const { headers } = ctx.request;
    const { s_t: st, s_sign: sSign } = headers;
    const { method, path } = ctx;

    const signKey = "qwertyuiop1234567890";
    const signature = md5(`${signKey}${st}`);

    app.logger.info(`${st}--${sSign}`);
    app.logger.info(`[${method}${path}] signature:${signature}`);

    // 签名合法性校验 5分钟过期
    if (
      !st ||
      !sSign ||
      signature !== sSign.toLowerCase() ||
      Date.now() - st > 1000 * 60 * 5
    ) {
      ctx.status = 200;
      ctx.body = {
        code: 445,
        success: false,
        message: "signature verification failed",
      };
      return;
    }

    await next();
  };
};
