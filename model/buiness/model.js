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
              },
              editFormOption: {
                comType: 'input',
                disabled: true
              },
              detailPanelOption: {
                comType: 'input',
                disabled: true
              }
            },
            product_name: {
              type: 'string',
              minLength: 3,
              maxLength: 10,
              label: '商品名称',
              tableOption: {
                width: 200
              },
              searchOption: {
                comType: 'dynamicSelect',
                clearable: 'clearable',
                api: '/api/proj/product_enum/list'
              },
              createFormOption: {
                comType: 'input'
              },
              editFormOption: {
                comType: 'input'
              },
              detailPanelOption: {
                comType: 'input',
                disabled: true
              }
            },
            product_price: {
              type: 'number',
              minimum: 1,
              maximum: 1000,
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
              },
              createFormOption: {
                comType: 'inputNumber'
              },
              editFormOption: {
                comType: 'inputNumber'
              },
              detailPanelOption: {
                comType: 'input',
                disabled: true
              }
            },
            product_stock: {
              type: 'number',
              label: '商品库存',
              tableOption: {
                width: 200
              },
              createFormOption: {
                comType: 'select',
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
              },
              editFormOption: {
                comType: 'select',
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
              },
              detailPanelOption: {
                comType: 'input',
                disabled: true
              }
            },
            product_create_time: {
              type: 'string',
              label: '创建时间',
              tableOption: {},
              searchOption: {
                comType: 'dateRange',
                defaultValue: undefined
              },
            },
          },
          required: ['product_name'],

          tableConfig: {
            headerButtons: [
              {
                label: '新增',
                eventKey: 'ShowComponent',
                type: 'primary',
                plain: true,
                eventOption: {
                  comName: 'createForm'
                }
              }
            ],
            rowButtons: [
              {
                label: '修改',
                eventKey: 'ShowComponent',
                eventOption: {
                  comName: 'editForm'
                },
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
              },
              {
                label: '详情',
                eventKey: 'ShowComponent',
                eventOption: {
                  comName: 'detailPanel'
                },
                type: 'primary'
              }
            ]
          },
          componentConfig: {
            // create-form 表单相关配置
            createForm: {
              title: '新增商品', // 表单标题
              saveBtnText: '保存'
            },
            // edit-form 表单相关配置
            editForm: {
              title: '编辑商品', // 表单标题
              mainKey: 'product_id',
              saveBtnText: '保存'
            },
            // detail-panel 详情面板相关配置
            detailPanel: {
              title: '商品详情',
              mainKey: 'product_id',
              saveBtnText: '关闭'
            }
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
