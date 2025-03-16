module.exports = {
  '/api/proj/product/list': {
    get: {
      query: {
        type: 'object',
        properties: {
          page: {
            type: 'string',
            description: '页码'
          },
          pageSize: {
            type: 'string',
            description: '每页条数'
          }
        },
        required: ['page', 'pageSize']
      }
    }
  },
  '/api/proj/product': {
    delete: {
      body: {
        type: 'object',
        properties: {
          product_id: {
            type: 'string',
            description: '商品ID'
          }
        },
        required: ['product_id']
      }
    },
    post: {
      body: {
        type: 'object',
        properties: {
          product_name: {
            type: 'string',
            description: '商品名称'
          },
          product_price: {
            type: 'number',
            description: '商品价格'
          },
          product_stock: {
            type: 'number',
            description: '商品库存'
          }
        }
      }
    },
    put: {
      body: {
        type: 'object',
        properties: {
          product_id: {
            type: 'string',
            description: '商品ID'
          },
          product_name: {
            type: 'string',
            description: '商品名称'
          },
          product_price: {
            type: 'number',
            description: '商品价格'
          },
          product_stock: {
            type: 'number',
            description: '商品库存'
          }
        },
        required: ['product_id', 'product_name']
      }
    },
    get: {
      query: {
        type: 'object',
        properties: {
          product_id: {
            type: 'string',
            description: '商品ID'
          }
        },
        required: ['product_id']
      }
    }
  },
  '/api/proj/product_enum/list': {
    get: {
      query: {}
    }
  }
}
