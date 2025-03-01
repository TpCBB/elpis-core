module.exports = (app) => {
  const baseConfig = require('./base.js')(app)
  return class businessController extends baseConfig {
    async getList(ctx) {
      this.success(
        ctx,
        [
          {
            product_id: '1',
            product_name: `${ctx.projKey}商品1`,
            product_price: 100,
            product_stock: 100,
            product_create_time: '2026-03-01 13:02:00'
          },
          {
            product_id: '2',
            product_name: `${ctx.projKey}商品2`,
            product_price: 200,
            product_stock: 200,
            product_create_time: '2023-04-02 14:20:00'
          },
          {
            product_id: '3',
            product_name: `${ctx.projKey}商品3`,
            product_price: 300,
            product_stock: 300,
            product_create_time: '2024-05-03 16:60:00 '
          }
        ],
        {
          total: 3
        }
      )
    }

    async delete(ctx) {
      const { product_id } = ctx.request.body
      this.success(ctx, {
        message: `删除成功:${product_id}`
      })
    }
  }
}
