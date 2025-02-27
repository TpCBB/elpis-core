module.exports = {
  '/api/project': {
    get: {
      query: {
        type: 'object',
        properties: {
          proj_key: {
            type: 'string',
            description: '项目key'
          }
        },
        required: ['proj_key']
      }
      // params: {
      //   type: 'string',
      //   properties: {
      //     proj_key: { type: 'string' }
      //   },
      //   required: ['proj_key']
      // }
    }
  },
  '/api/project/getModelList': {
    // post: {
    //   body: {
    //     type: "object",
    //     properties: {
    //       page: { type: "number" },
    //       pageSize: { type: "number" },
    //     },
    //     required: ["page", "pageSize"],
    //   },
    // },
    get: {}
  },
  '/api/project/getList': {
    get: {
      query: {}
    }
  }
}
