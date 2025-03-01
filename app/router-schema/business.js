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
    }
  }
}
