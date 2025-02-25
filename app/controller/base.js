module.exports = (app) =>
  class BaseController {
    /**
     * controller 基类
     * 统一收拢 controller 相关公共方法
     */
    constructor() {
      this.app = app
      this.config = app.config
      this.controller = app.controller
    }
    /**
     * 成功返回
     * @param {object} ctx 上下文
     * @param {object} data 数据
     * @param {object} metadata 额外信息
     */
    success(ctx, data = {}, metadata = {}) {
      ctx.status = 200
      ctx.body = {
        success: true,
        data,
        metadata
      }
    }
    /**
     * 失败返回
     * @param {object} ctx 上下文
     * @param {string} message 错误信息
     * @param {number} code 错误码
     */
    fail(ctx, message, code) {
      // http 状态码必须是一个有效的3位数字
      ctx.status = 200
      ctx.body = {
        success: false,
        message,
        code
      }
    }
  }
