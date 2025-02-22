module.exports = {
  name: 'B站课堂',
  desc: 'B站课堂管理系统',
  homePage: '',
  menu: [
    {
        key:"video",
        name:"视频管理(B站)"
    },
    {
        key:"user",
        name:"用户管理(B站)"
    },
    {
      key: 'course-file',
      name: '课程资料',
      menuType: 'module',
      moduleType: 'sider',
      siderConfig: {
        menu: [
          {
            key: 'pdf',
            name: 'PDF',
            menutType: 'module',
            moduleType: 'custom',
            customConfig: {
              path: ''
            }
          },
          {
            key: 'excel',
            name: 'Excel',
            menutType: 'module',
            moduleType: 'custom',
            customConfig: {
              path: ''
            }
          },
          {
            key: 'ppt',
            name: 'PPT',
            menutType: 'module',
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
