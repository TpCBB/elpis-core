module.exports = (app) =>
  class BaseController {
    /**
     * Controller base class
     * Shared controller methods
     */
    constructor() {
      this.app = app
      this.config = app.config
      this.controller = app.controller
    }
    /**
     * Send a successful response
     * @param {object} ctx Koa context
     * @param {object} data Response data
     * @param {object} metadata Additional metadata
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
     * Send an error response
     * @param {object} ctx Koa context
     * @param {string} message Error message
     * @param {number} code Error code
     */
    fail(ctx, message, code) {
      // HTTP status codes must be valid three-digit numbers
      ctx.status = 200
      ctx.body = {
        success: false,
        message,
        code
      }
    }
  }
