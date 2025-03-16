module.exports = (app) => {
  const baseConfig = require('./base.js')(app)
  return class businessController extends baseConfig {
    async getList(ctx) {
      const { product_name } = ctx.request.query
      let data = [
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
      ]
      if (product_name && product_name !== '-1') {
        data = data.filter((item) => {
          return item.product_name.trim() === product_name.trim()
        })
      }

      this.success(ctx, data, {
        total: 3
      })
    }

    async getEnumList(ctx) {
      this.success(ctx, [
        {
          label: '全部',
          value: '-1'
        },
        {
          label: `${ctx.projKey}商品1`,
          value: `${ctx.projKey}商品1`
        },
        {
          label: `${ctx.projKey}商品2`,
          value: `${ctx.projKey}商品2`
        },
        {
          label: `${ctx.projKey}商品3`,
          value: `${ctx.projKey}商品3`
        }
      ])
    }

    async delete(ctx) {
      const { product_id } = ctx.request.body
      this.success(ctx, {
        message: `删除成功:${product_id}`
      })
    }
  }
}
