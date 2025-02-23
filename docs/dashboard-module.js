/* eslint-disable */

const docs = {
  module: 'dashboard', // 模板类型, 不同模板类型对应不同的模板
  name: '', // 模块名称
  desc: '', // 模块描述
  icon: '', // 模块图标
  homepage: '', // 模块首页
  // 头部菜单 header-container
  menu: [
    {
      key: '', //菜单唯一描述
      name: '', //菜单名称
      menuType: '', // 枚举值 group 分组, module 模块

      // menuType 为 group 时, 需要配置以下属性
      subMenu: [
        {
          // 可递归 menuItem
          //...
        }
      ],

      // menuType 为 module 时, 需要配置以下属性
      moduleType: '', // 枚举值: schema/custom/iframe/sider

      // moduleType 为 custom 时, 需要配置以下属性
      customConfig: {},

      // moduleType 为 iframe 时, 需要配置以下属性
      iframeConfig: {},

      // moduleType 为 schema 时, 需要配置以下属性
      schemaConfig: {
        api:"",// 数据源 (遵循 RESTFUL)
        schema:{ // 数据源结构
            type:"object",
            properties:{
                
            }
        } 
      },

      // moduleType 为 sider 时, 需要配置以下属性
      siderConfig: {
        menu: [
          {
            // 可递归 menuItem
          }
        ]
      }
    }
    //...
  ]
}
