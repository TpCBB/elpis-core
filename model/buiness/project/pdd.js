module.exports = {
  name: 'PDD',
  desc: 'pdd电商 系统',
  homePage: '/schema?proj_key=pdd&key=product',
  menu: [
    {
      key: 'product',
      name: '商品管理(pdd)',
      menuType: 'module',
      moduleType: 'custom',
      customConfig: {
        path: '/todo'
      }
    },
    {
      key: 'client',
      name: '客户管理(pdd)',
      menuType: 'module',
      moduleType: 'schema',
      schemaConfig: {
        api: '/api/client',
        schema: {}
      }
    },
    {
      key: 'search',
      name: '信息查询',
      moduleType: 'iframe',
      menuType: 'module',
      iframeConfig: {
        path: '/todo'
      }
    },
    {
      key: 'data',
      name: '数据分析',
      menuType: 'module',
      moduleType: 'sider',
      siderConfig: {
        menu: [
          {
            key: 'analysis',
            name: '电商罗盘',
            menuType: 'module',
            moduleType: 'custom',
            customConfig: {
              path: '/todo'
            }
          },
          {
            key: 'sider-search',
            name: '信息查询',
            menuType: 'module',
            moduleType: 'iframe',
            iframeConfig: {
              path: 'https://www.baidu.com'
            }
          },
          {
            key: 'category',
            name: '分类数据',
            menuType: 'group',
            subMenu: [
              {
                key: 'category1',
                name: '分类设置1',
                menuType: 'module',
                moduleType: 'iframe',
                iframeConfig: {
                  path: '/todo'
                }
              },
              {
                key: 'category2',
                name: '分类设置2',
                menuType: 'module',
                moduleType: 'schema',
                schemaConfig: {
                  api: '/api/client',
                  schema: {}
                }
              }
            ]
          }
        ]
      }
    }
  ]
}
