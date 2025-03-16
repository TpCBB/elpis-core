module.exports = {
  module: 'dashboard',
  name: '电商系统',
  menu: [
    {
      key: 'product',
      name: '商品管理',
      menuType: 'module',
      moduleType: 'schema',
      schemaConfig: {
        api: '/api/proj/product',
        schema: {
          type: 'object',
          properties: {
            product_id: {
              type: 'string',
              label: '商品ID',
              tableOption: {
                width: 300,
                'show-overflow-tooltip': true
              },
              searchOption: {
                comType: 'input'
              }
            },
            product_name: {
              type: 'string',
              label: '商品名称',
              tableOption: {
                width: 200
              },
              searchOption: {
                comType: 'dynamicSelect',
                clearable: 'clearable',
                api: '/api/proj/product_enum/list'
              }
            },
            product_price: {
              type: 'number',
              label: '商品价格',
              tableOption: {
                width: 200
              },
              searchOption: {
                comType: 'select',
                clearable: 'clearable',
                enumList: [
                  {
                    label: '全部',
                    value: '-1'
                  },
                  {
                    label: '100',
                    value: 100
                  },
                  {
                    label: '200',
                    value: 200
                  },
                  {
                    label: '300',
                    value: 300
                  }
                ]
              }
            },
            product_stock: {
              type: 'number',
              label: '商品库存',
              tableOption: {
                width: 200
              }
            },
            product_create_time: {
              type: 'string',
              label: '创建时间',
              tableOption: {},
              searchOption: {
                comType: 'dateRange',
                defaultValue: undefined
              }
            }
          },
          tableConfig: {
            headerButtons: [
              {
                label: '新增',
                eventKey: 'ShowComponent',
                type: 'primary',
                plain: true
              }
            ],
            rowButtons: [
              {
                label: '修改',
                eventKey: 'ShowComponent',
                type: 'warning'
              },
              {
                label: '删除',
                type: 'danger',
                eventKey: 'remove',
                eventOption: {
                  params: {
                    product_id: 'schema::product_id'
                  }
                }
              }
            ]
          }
        }
      }
    },
    {
      key: 'order',
      name: '订单管理',
      menuType: 'module',
      moduleType: 'custom',
      customConfig: {
        path: '/todo'
      }
    },
    {
      key: 'client',
      name: '客户管理',
      menuType: 'module',
      moduleType: 'custom',
      customConfig: {
        path: '/todo'
      }
    }
  ]
}
