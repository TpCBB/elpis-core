module.exports = (app) => {
  const sleep = (time) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve()
      }, Math.random() * time)
    })
  }
  const baseConfig = require('./base.js')(app)
  return class businessController extends baseConfig {
    async getList(ctx) {
      const { product_name } = ctx.request.query
      await sleep(500)
      let data = this.getProductList(ctx)
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
      await sleep(500)

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
      await sleep(500)
      this.success(ctx, {
        message: `删除成功:${product_id}`
      })
    }

    async create(ctx) {
      const { product_name, product_price, product_stock, product_create_time_start, product_create_time_end } =
        ctx.request.body
      await sleep(500)
      this.success(ctx, {
        message: `新增成功:${product_name} ${product_price} ${product_stock} ${product_create_time_start} ${product_create_time_end}`
      })
    }

    async update(ctx) { 
      const { product_id, product_name, product_price, product_stock } = ctx.request.body
      await sleep(500)
      this.success(ctx, {
        message: `更新成功:${product_id} ${product_name} ${product_price} ${product_stock}`
      })
    }

    async get(ctx) {
      const { product_id: productId } = ctx.request.query

      const list = this.getProductList(ctx)
      const productItem = list.find((item) => item.product_id === productId)
      this.success(ctx, productItem)
    }

    getProductList(ctx) {
      return [
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
    }
  }
}
