# Eplis

一个基于 Vue 3 + Koa2 的全栈项目。

### model 配置

```javascript
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
        api: '', // 数据源 (遵循 RESTFUL)
        schema: {
          // 数据源结构
          type: 'object',
          properties: {
            key: {
              ...schema, // 标准的schema字段
              type: '', // 字段类型
              label: '', // 字段中文名
              // 字段在table中的配置
              tableOption: {
                ...elTableColumnConfig, // 标准的 el-table-column 配置
                visible: true // 是否显示
              },
              // 字段在search-bar中的配置
              searchOption: {
                ...eleComponentConfig, // 标准的 el-component 配置
                comType: '', // 配置组件类型
                default: '', // 默认值

                // 如果 comType 为 select, 需要配置以下属性
                enumList: [
                  {
                    label: value
                  }
                ]
              },
              // 字段在不同动态 component 中的相关配置, 前缀对应 componentConfig 中键值
              // 例如: componentConfig.createForm 对应 createFormOption
              // 字段在 createForm 中的相关配置
              createFormOption: {
                ...eleComponentConfig, // 标准的 el-component 配置, 可以兼容原 element-ui 的属性
                comType: '', // 控件类型 input/select/input-number
                visible: 'true', // 是否显示 默认为 true
                disabled: 'false', // 是否禁用 默认为 false

                // comType 为 select 的时候
                enumList: [] // 枚举列表
              },
              // 字段在editForm中的相关配置
              editFormOption: {
                ...eleComponentConfig, // 标准的 el-component 配置, 可以兼容原 element-ui 的属性
                comType: '', // 控件类型 input/select/input-number
                visible: 'true', // 是否显示 默认为 true
                disabled: 'false', // 是否禁用 默认为 false
                
                // comType 为 select 的时候
                enumList: [] // 枚举列表
              },
              // 字段在 detail-panel 中的相关配置
              detailPanelOption: {
                ...eleComponentConfig, // 标准的 el-component 配置, 可以兼容原 element-ui 的属性
                visible: 'true', // 是否显示 默认为 true
              },
              ...otherOption
            },
            ...otherKey
          },
          required: [] // 必填字段
        },
        // table 相关配置
        tableConfig: {
          headerButtons: [
            {
              label: '', //按钮中文名
              eventKey: '', // 事件名称
              // 按钮配置
              eventOption: {
                // 当 eventKey 为 showComponent 时, 需要配置以下属性
                comName: ""
              },
              ...elButtonConfig // 标准的 el-button 配置
            },
            ...otherButtons
          ], // 头部按钮
          rowButtons: [
            {
              label: '', // 按钮中文名
              eventKey: '', // 按钮事件名
              eventOption: {
                // 当 eventKey 为 showComponent 时, 需要配置以下属性
                comName: "",
                // 当 eventKey 为 'edit' 时, 需要配置以下属性
                params: {
                  // 以下为请求参数
                  /**
                   * eg.  request({
                   *  url: 'xxx',
                   *  method: 'edit',
                   *  data: {
                   *    paramKey: rowValueKey
                   *  }
                   * })
                   */
                  // paramKey = 参数的键值
                  // rowValueKey = 参数值, 格式为 schema::tableKey 到 table 中找到相应的字段
                  paramKey: rowValueKey
                }
              }, // 按钮配置
              ...elButtonConfig // 标准的 el-button 配置
            },
            ...otherButtons
          ] // 行按钮
        },
        componentConfig: {
          // create-form 表单相关配置
          createForm: {
            title: '', // 表单标题
            saveBtnText: ''
          },
          // edit-form 表单相关配置
          editForm: {
            title: '', // 表单标题
            saveBtnText: '',
            mainKey: '', // 主键字段
            mainValue: '' // 主键值
          },
          // detail-panel 详情面板
          detailPanel: {
            title: '', // 详情标题
            mainKey: '', // 主键字段
          }
        } //模块组件
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

```

### 启动BFF服务

```javascript
const { serverStart } = require("@tpccool/elpis");

const app = serverStart({
  name: "",
  homePage: "",
});

```

### 自定义服务端

- router-schema
- router
- controller
- service
- extend
- config

### 前端构建

```javascript
const { frontendBuild } = require("@tpccool/elpis");

frontendBuild(process.env.NODE_ENV);****
```

### 自定义扩展页面

- 在 `app/pages/` 目录下写入口 entry.xxx.js

### dashboard / custom-view 自定义扩展页面

- 在 `app/pages/dashboard/xxx` 下写页面

### dashboard / schema-view /components 动态组件扩展

1. 在 `app/pages/dashboard/complex-view/schema-view/components` 下写组件
2. 配置到 `app/pages/dashboard/complex-view/schema-view/components/components-config.js`

### schema-form 控件扩展

1. 在 `app/widgets/schema-form/complex-view` 下写控件
2. 配置到 `app/widgets/schema-form/form-item-config.js`

### schema-search-bar 控件过站

1. 在 `app/widgets/schema-search-bar/complex-view` 写控件
2. 配置到 `app/widgets/schema-search-bar/search-item-config.js`

##