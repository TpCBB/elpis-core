const md5 = require("md5");
/**
 * API signature validation
 */
module.exports = (app) => {
  return async (ctx, next) => {
    // Validate signatures only for API requests
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

    // Validate the signature and enforce a five-minute expiration window
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
