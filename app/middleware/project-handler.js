/**
 * Handle project-specific requests
 * @param {*} app
 * @returns
 */
module.exports = (app) => {
  return async (ctx, next) => {
    // Handle only requests beginning with /api/proj
    if (ctx.path.indexOf('api/proj/') < 0) {
      return await next()
    }
    const { proj_key: projKey } = ctx.request.headers
    if (!projKey) {
      ctx.status = 200
      ctx.body = {
        success: false,
        message: 'proj_key is required',
        code: 446
      }
      return
    }
    ctx.projKey = projKey
    await next()
  }
}
