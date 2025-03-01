/**
 * 处理项目相关内容
 * @param {*} app
 * @returns
 */
module.exports = (app) => {
  return async (ctx, next) => {
    // 只处理开头为 /api/proj 的请求
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
