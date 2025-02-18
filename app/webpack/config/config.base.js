const glob = require("glob");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
const { VueLoaderPlugin } = require("vue-loader");
const webpack = require("webpack");

// 动态构造 将entry和htmlWebpackPlugin配置化
const pageEntries = {};
const htmlWebpackPluginList = [];

// 获取./app/pages下所有的 pages 入口文件
const entryList = path.resolve(process.cwd(), "./app/pages/**/entry.*.js");

glob.sync(entryList).forEach((file) => {
  const entryName = path.basename(file, ".js");
  pageEntries[entryName] = file;

  htmlWebpackPluginList.push(
    new HtmlWebpackPlugin({
      // 产物 (最终模板) 输出路径
      filename: path.resolve(process.cwd(), "./app/public/dist/", `${entryName}.tpl`),
      // 指定要使用的模板文件
      template: path.resolve(process.cwd(), "./app/view/entry.tpl"),
      // 要注入的代码块
      chunks: [entryName],
    })
  );
});

/**
 * webpack基础配置
 */

module.exports = {
  // 入口配置  (多入口SSR配置)
  entry: pageEntries,

  // 模块解析配置 (决定了要加载解析哪些模块,以及用什么方式去加载解析)
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: {
          loader: "vue-loader",
        },
      },
      {
        test: /\.js$/,
        include: [
          // 只对业务代码 进行 babel加快打包速度
          path.resolve(process.cwd(), "./app/pages"),
        ],
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.(png|jpe?g|gif)(\?.+)?$/,
        use: {
          loader: "url-loader",
          options: {
            limit: 300,
            esMoudle: false,
          },
        },
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.less$/,
        use: ["style-loader", "css-loader", "less-loader"],
      },
      {
        test: /\.(eot|svg|ttf|woff2)(\?\S*)?$/,
        use: "file-loader",
      },
    ],
  },

  //产物输出配置

  output: {},

  // 配置模块解析的具体行为(定义 webpack 在打包时, 如何找到并加载模块)
  resolve: {
    extensions: [".js", ".vue", ".css", ".less"],
    alias: {
      $pages: path.resolve(process.cwd(), "./app/pages"),
      $common: path.resolve(process.cwd(), "./app/pages/common"),
      $store: path.resolve(process.cwd(), "./app/pages/store"),
      $widgets: path.resolve(process.cwd(), "./app/pages/widgets"),
    },
  },

  // 插件配置
  plugins: [
    // 处理 .vue 文件  这个插件是必须的
    // 它的职能是将你定义过的其他规则赋值并应用到  .vue 文件里
    // 例如 如果有一条匹配规则 /\.js$/ 的规则, 那么他会应用到 .vue文件中的<script>板块中
    new VueLoaderPlugin(),
    // 把第三方库 暴露到 window context下
    new webpack.ProvidePlugin({
      Vue: "vue",
    }),
    // 定义全局常量
    new webpack.DefinePlugin({
      __VUE_OPTIONS_AIP__: true, //支持vue解析optionsApi
      __VUE_PROD_DEVTOOLS__: false, // 禁用 vue测试工具
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: "false", // 禁止生产环境显示  "水合" 信息
    }),
    // 最终渲染页面模板
    ...htmlWebpackPluginList,
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
      chunks: "all", // 对同步和异步代码进行分割
      maxAsyncRequests: 10, // 最大异步请求数
      maxInitialRequests: 10, // 最大初始请求数
      // 缓存组
      cacheGroups: {
        vender: {
          test: /[\\/]node_modules[\\/]/, // 匹配node_modules目录
          name: "vender", // 约定 第三方库 包名
          priority: 20, // 优先级 越大越先分割
          enforce: true, // 强制执行
          reuseExistingChunk: true, // [关键] 复用已存在的chunk
        },
        common: {
          name: "common",
          minChunks: 2, // 最小复用次数 就被打成一个包
          minSize: 1, // 最小被分割文件大小 (1bytes)
          reuseExistingChunk: true, // 复用已存在的chunk
          priority: 10, // 优先级
        },
      },
    },

    // 将 webpack 运行时生成的代码 打包到 runtime 包中
    runtimeChunk: true,
  },
};
