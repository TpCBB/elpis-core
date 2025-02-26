module.exports = {
  name: 'JD',
  desc: '京东电商',
  homePage: '/todo?proj_key=jd&key=quality-setting',
  menu: [
    {
      key: 'shop-setting',
      name: '店铺设置',
      menuType: 'group',
      subMenu: [
        {
          key: 'info-setting',
          name: '店铺信息设置',
          menuType: 'group',
          subMenu: [
            {
              key: 'info-basic',
              name: '店铺基本信息',
              menuType: 'module',
              moduleType: 'iframe',
              iframeConfig: {
                path: '/todo'
              }
            },
            {
              key: 'info-contact',
              name: '联系方式',
              menuType: 'module',
              moduleType: 'iframe',
              iframeConfig: {
                path: '/todo'
              }
            }
          ]
        },
        {
          key: 'quality-setting',
          name: '店铺资质设置',
          menuType: 'module',
          moduleType: 'iframe',
          iframeConfig: {
            path: 'https://www.jd.com'
          }
        }
      ]
    }
  ]
}
