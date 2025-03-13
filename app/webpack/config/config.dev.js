const merge = require("webpack-merge");
const path = require("path");
const webpack = require("webpack");
// 基础配置
const webpackBaseConfig = require("./config.base");
// dev-server配置
const DEV_SERVER_CONFIG = {
  HOST: "127.0.0.1", // 主机地址
  PORT: 9002, // 端口号
  HOT: true, // 热更新
  HMR_PATH: "__webpack_hrm", // 官方规定
  TIMEOUT: 20000,
};

// 开发阶段 entry 配置需要加入 hmr
Object.keys(webpackBaseConfig.entry).forEach((key) => {
  webpackBaseConfig.entry[key] = [
   `${require.resolve('webpack-hot-middleware/client')}?path=http://${DEV_SERVER_CONFIG.HOST}:${DEV_SERVER_CONFIG.PORT}/${DEV_SERVER_CONFIG.HMR_PATH}?timeout=${DEV_SERVER_CONFIG.TIMEOUT}&reload=true}`,
  ].concat(webpackBaseConfig.entry[key]);
});

// 开发模式配置
const webpackDevConfig = merge(webpackBaseConfig, {
  mode: "development", // 指定开发模式
  // 开发模式下开启 sourceMap, 呈现代码的映射关系, 方便调试 
  devtool: "eval-source-map",
  output: {
    filename: "js/[name]_[chunkhash:8].bundle.js",
    path: path.resolve(process.cwd(), "./app/public/dist/dev"), // 输出文件路径
    publicPath: `http://${DEV_SERVER_CONFIG.HOST}:${DEV_SERVER_CONFIG.PORT}/public/dist/dev`, // 指定资源的公共访问路径
    globalObject: "this", // 指定全局对象
  },

  // 开发阶段插件
  plugins: [
    // 实现热更新
    // 允许在运用程序 运行时 替换模块
    // 提升开发效率, 减少页面刷新
    new webpack.HotModuleReplacementPlugin({
      multiStep: false,
    }),
  ],
});

module.exports = { webpackDevConfig, DEV_SERVER_CONFIG };
