module.exports = {
  name: 'PDD',
  desc: 'pdd电商 系统',
  homePage: '',
  menu: [
    {
      key: 'product',
      name: '商品管理(pdd)',
      menuType: 'module',
      moduleType: 'custom',
      customConfig: {
        path: ''
      }
    },
    {
      key: 'client',
      name: '客户管理(pdd)',
      menuType: 'module',
      moduleType: 'custom',
      customConfig: {
        path: ''
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
              path: ''
            }
          },
          {
            key: 'sider-search',
            name: '信息查询',
            menuType: 'iframe',
            iframeConfig: {
              path: ''
            }
          }
        ]
      }
    }
  ]
}
