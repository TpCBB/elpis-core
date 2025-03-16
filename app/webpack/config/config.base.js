const glob = require('glob')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')
const { VueLoaderPlugin } = require('vue-loader')
const webpack = require('webpack')
const merge = require("webpack-merge");
const fs = require('fs')
// 动态构造 elpis-core 将entry和htmlWebpackPlugin配置化
const elpisPageEntries = {}
const elpisHtmlWebpackPluginList = []
// 获取  elpis-core  ./app/pages下所有的 pages 入口文件
const elpisEntryList = path.resolve(__dirname, '../../pages/**/entry.*.js')
handleEntry(elpisEntryList, elpisPageEntries, elpisHtmlWebpackPluginList)

// 动态构造 业务 将entry和htmlWebpackPlugin配置化
const businessPageEntries = {}
const businessHtmlWebpackPluginList = []
// 获取  业务  ./app/pages下所有的 pages 入口文件
const businessEntryList = path.resolve(process.cwd(), './app/pages/**/entry.*.js')
handleEntry(businessEntryList, businessPageEntries, businessHtmlWebpackPluginList)

function handleEntry(entryList, pageEntries, htmlWebpackPluginList) {
  glob.sync(entryList).forEach((file) => {
    const entryName = path.basename(file, '.js')
    pageEntries[entryName] = file

    htmlWebpackPluginList.push(
      new HtmlWebpackPlugin({
        // 产物 (最终模板) 输出路径
        filename: path.resolve(process.cwd(), './app/public/dist/', `${entryName}.tpl`),
        // 指定要使用的模板文件
        template: path.resolve(__dirname, '../../view/entry.tpl'),
        // 要注入的代码块
        chunks: [entryName]
      })
    )
  })
}


// 业务 webpackconfig.js
let businessWebpackConfig = {}
try {
  businessWebpackConfig = require(path.resolve(process.cwd(), './app/webpack.config.js'))
} catch (error) {}

/**
 * webpack基础配置
 */

const webpackBaseConfig = merge.smart({
  // 入口配置  (多入口SSR配置)
  entry: Object.assign({}, elpisPageEntries, businessPageEntries),

  // 模块解析配置 (决定了要加载解析哪些模块,以及用什么方式去加载解析)
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: {
          loader: require.resolve('vue-loader')
        }
      },
      {
        test: /\.js$/,
        include: [
          // 只对业务代码 进行 babel加快打包速度
          path.resolve(__dirname, '../../pages'),
          path.resolve(process.cwd(), './app/pages'),
        ],
        use: {
          loader: require.resolve('babel-loader')
        }
      },
      {
        test: /\.(png|jpe?g|gif)(\?.+)?$/,
        use: {
          loader: require.resolve('url-loader'),
          options: {
            limit: 300,
            esMoudle: false
          }
        }
      },
      {
        test: /\.css$/,
        use: [require.resolve('style-loader'), require.resolve('css-loader')]
      },
      {
        test: /\.less$/,
        use: [require.resolve('style-loader'), require.resolve('css-loader'), require.resolve('less-loader')]
      },
      {
        test: /\.(eot|svg|ttf|woff2)(\?\S*)?$/,
        use: require.resolve('file-loader')
      }
    ]
  },

  //产物输出配置

  output: {},

  // 配置模块解析的具体行为(定义 webpack 在打包时, 如何找到并加载模块)
  resolve: {
    extensions: ['.js', '.vue', '.css', '.less'],
    alias: (()=>{
      const aliasMap = {}

      // 确保这个路径不会报错
      const blankModulPath = path.resolve(__dirname, '../../webpack/libs/blank.js')

      // 由 业务 dashboard 拓展的路由 
      const businessDashboardRouterConfig = path.resolve(process.cwd(), './app/pages/dashboard/router.js')
      aliasMap['$businessDashboardRouterConfig'] = fs.existsSync(businessDashboardRouterConfig) ? businessDashboardRouterConfig : blankModulPath

      // 由 业务 schema-view components 拓展的组件 
      const  businessComponentsConfig = path.resolve(process.cwd(), './app/pages/dashboard/complex-view/schema-view/components/component-config.js')
      aliasMap['$businessComponentsConfig'] = fs.existsSync(businessComponentsConfig) ? businessComponentsConfig : blankModulPath

      // 由 业务 schema-form components 拓展的组件 
      const  $businessFormItemConfig = path.resolve(process.cwd(), './app/pages/widgets/schema-form/form-item-config.js')
      aliasMap['$businessFormItemConfig'] = fs.existsSync($businessFormItemConfig) ? $businessFormItemConfig : blankModulPath

      // 由 业务 schema-search-bar components 拓展的组件 
      const  $businessSearchItemConfig = path.resolve(process.cwd(), './app/pages/widgets/schema-search-bar/search-item-config.js')
      aliasMap['$businessSearchItemConfig'] = fs.existsSync($businessSearchItemConfig) ? $businessSearchItemConfig : blankModulPath

      return {
        'vue': require.resolve('vue'),
        '@babel/runtime/helpers/asyncToGenerator': require.resolve('@babel/runtime/helpers/asyncToGenerator'),
        '@babel/runtime/regenerator': require.resolve('@babel/runtime/regenerator'),
        $elpisPages: path.resolve(__dirname, '../../pages'),
        $elpisCommon: path.resolve(__dirname, '../../pages/common'),
        $elpisStore: path.resolve(__dirname, '../../pages/store'),
        $elpisWidgets: path.resolve(__dirname, '../../pages/widgets'),
        $elpisAsserts: path.resolve(__dirname, '../../pages/asserts'),

        $elpisUtils: path.resolve(__dirname, '../../pages/common/utils.js'),
        $elpisCurl: path.resolve(__dirname, '../../pages/common/curl.js'),

        $elpisHeaderContainer: path.resolve(__dirname, '../../pages/widgets/header-container/header-container.vue'),
        $elpisSiderContainer: path.resolve(__dirname, '../../pages/widgets/sider-container/sider-container.vue'),
        $elpisSchemaTable: path.resolve(__dirname, '../../pages/widgets/schema-table/schema-table.vue'),
        $elpisSchemaForm: path.resolve(__dirname, '../../pages/widgets/schema-form/schema-form.vue'),
        $elpisSchemaSearchBar: path.resolve(__dirname, '../../pages/widgets/schema-search-bar/schema-search-bar.vue'),

        $elpisBoot: path.resolve(__dirname, '../../pages/boot.js'),

        ...aliasMap
      }
    })()
  },

  // 插件配置
  plugins: [
    // 处理 .vue 文件  这个插件是必须的
    // 它的职能是将你定义过的其他规则赋值并应用到  .vue 文件里
    // 例如 如果有一条匹配规则 /\.js$/ 的规则, 那么他会应用到 .vue文件中的<script>板块中
    new VueLoaderPlugin(),
    // 把第三方库 暴露到 window context下
    new webpack.ProvidePlugin({
      Vue: 'vue',
      axios: 'axios',
      _: 'lodash'
    }),
    // 定义全局常量
    new webpack.DefinePlugin({
      __VUE_OPTIONS_API__: true, //支持vue解析optionsApi
      __VUE_PROD_DEVTOOLS__: false, // 禁用 vue测试工具
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'false' // 禁止生产环境显示  "水合" 信息
    }),
    // 最终渲染页面模板
    ...elpisHtmlWebpackPluginList,
    ...businessHtmlWebpackPluginList
  ],

  // 配置打包输出优化 (配置代码分割, 模块合并, 缓存, TreeShaking, 压缩等优化策略)
  optimization: {
    /**
     * 分包策略
     * 1 vender: node_modules 第三方库, 基本不会改动, 除非升级
     * 2 common: 业务公共代码, 改动较少
     * 3 entry.{page}: 页面entry里的业务组件代码, 会经常改动
     */
    splitChunks: {
      chunks: 'all', // 对同步和异步代码进行分割
      maxAsyncRequests: 10, // 最大异步请求数
      maxInitialRequests: 10, // 最大初始请求数
      // 缓存组
      cacheGroups: {
        vender: {
          test: /[\\/]node_modules[\\/]/, // 匹配node_modules目录
          name: 'vender', // 约定 第三方库 包名
          priority: 20, // 优先级 越大越先分割
          enforce: true, // 强制执行
          reuseExistingChunk: true // [关键] 复用已存在的chunk
        },
        common: {
          test: /[\\/]common|widgets[\\/]/, // 匹配common和widgets目录
          name: 'common',
          minChunks: 2, // 最小复用次数 就被打成一个包
          minSize: 1, // 最小被分割文件大小 (1bytes)
          reuseExistingChunk: true, // 复用已存在的chunk
          priority: 10 // 优先级
        }
      }
    },

    // 将 webpack 运行时生成的代码 打包到 runtime 包中
    runtimeChunk: true
  }
}, businessWebpackConfig)
module.exports = webpackBaseConfig
