module.exports = {
  name: '淘宝',
  desc: '淘宝电商系统',
  homePage: '',
  menu: [
    {
      key: 'product',
      name: '商品管理(taobao)'
    },
    {
      key: 'order',
      name: '订单管理(taobao)'
    },
    {
      key: 'client',
      name: '客户管理(taobao)'
    },
    {
      key: 'order',
      moduleType: 'iframe',
      iframeConfig: {}
    },
    {
      key: 'operating',
      name: '运营活动',
      menuType: 'sider',
      siderConfig: {
        menu: [
          {
            key: 'coupon',
            name: '优惠券',
            menuType: 'module',
            moduleType: 'custom',
            customConfig: {
              path: ''
            }
          },
          {
            key: 'limited',
            name: '限量购',
            menuType: 'module',
            moduleType: 'custom',
            customConfig: {
              path: ''
            }
          },
          {
            key: 'festival',
            name: '节日活动',
            menuType: 'module',
            moduleType: 'custom',
            customConfig: {
              path: ''
            }
          }
        ]
      }
    }
  ]
}
