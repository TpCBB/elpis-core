const merge = require("webpack-merge");
const path = require("path");
const Happypack = require("happypack"); // 多线程打包
const os = require("os");
const webpackBaseConfig = require("./config.base");
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
const { VueLoaderPlugin } = require("vue-loader");
const dotenv = require("dotenv");
dotenv.config();
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const HtmlwebpackInjectAttributesPlugin = require("html-webpack-inject-attributes-plugin");

// 多线程 build 设置
const happypackCommonConfig = {
  debug: false,
  threadPool: Happypack.ThreadPool({
    size: os.cpus().length,
  }),
};

// 生产环境配置
let webpackProdConfig = merge.smart(webpackBaseConfig, {
  // 指定生产环境
  mode: "production",
  // 生产环境的output
  output: {
    // 定义打包后的文件名格式：
    // [name] - 会被入口名称替换（如 entry.page1, entry.page2）
    // [chunkhash:8] - 根据文件内容生成的8位hash值，用于缓存控制
    filename: "js/[name]_[chunkhash:8].bundle.js",

    // 打包文件的输出路径，使用path.join确保跨平台路径正确
    // process.cwd()获取当前工作目录，然后拼接后续路径
    path: path.join(process.cwd(), "./app/public/dist/prod"),

    // 指定资源的公共访问路径
    // 这将作为生产环境下静态资源的基础URL
    publicPath: "/dist/prod",

    // 配置跨域资源加载策略
    // anonymous表示不发送凭据（cookies等）
    // 这对于CDN加载很有用，可以避免不必要的cookie传输
    crossOriginLoading: "anonymous",
  },

  // 模块
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "happypack/loader?id=css"],
      },
      {
        test: /\.js$/,
        include: [path.resolve(process.cwd(), "./app/pages")],
        use: ["happypack/loader?id=js"],
      },
    ],
  },
  //   webpack 不会有大量 hints 信息, 默认为warning
  performance: {
    hints: "warning",
  },
  //   插件
  plugins: [
    // 每次 build 前, 清空 dist 目录
    new CleanWebpackPlugin(["public/dist"], {
      root: path.resolve(process.cwd(), "./app/"),
      exclude: [],
      verbose: true,
      dry: false,
    }),
    // 优化压缩 css 的公共部分, 有效利用资源
    new CssMinimizerPlugin(),
    // 提取css的公共部分, 有效利用缓存
    new MiniCssExtractPlugin({
      chunkFilename: "css/[name]_[contenthash:8].css",
    }),
    // 多线程打包 JS 加快打包速度
    new Happypack({
      ...happypackCommonConfig,
      id: "js",
      loaders: [
        `babel-loader?${JSON.stringify({
          presets: ["@babel/preset-env"],
          plugins: ["@babel/plugin-transform-runtime"],
        })}`,
      ],
    }),
    // 多线程打包 css 加快打包速度
    new Happypack({
      ...happypackCommonConfig,
      id: "css",
      loaders: [
        {
          path: "css-loader",
          options: {
            importLoaders: 1,
          },
        },
      ],
    }),
    // 浏览器在请求资源时不发送用户凭证
    new HtmlwebpackInjectAttributesPlugin({
      crossorigin: "anonymous",
    }),
  ],
  //  优化
  optimization: {
    // 使用 TerserWebpackPlugins 的并发和缓存, 提升压缩阶段的性能
    // 清除console
    minimize: true,
    minimizer: [
      new TerserPlugin({
        cache: true, // 启用缓存加速构建过程
        parallel: true, // 利用多核CPU加速构建
        terserOptions: {
          compress: {
            drop_console: true, // 清除console
          },
        },
      }),
    ],
  },
});

// 如果SPEED_MEASURE_FLAG为true，则启用SpeedMeasurePlugin
if (process.env.SPEED_MEASURE_FLAG) {
  const smp = new SpeedMeasurePlugin();
  // 删除VueLoaderPlugin 会与SpeedMeasurePlugin冲突 与 MiniCssExtractPlugin 也冲突
  let vueLoaderPluginIndex = webpackProdConfig.plugins.find((plugin) => plugin instanceof VueLoaderPlugin);
  if (vueLoaderPluginIndex) {
    webpackProdConfig.plugins.splice(vueLoaderPluginIndex, 1);
  }
  webpackProdConfig = smp.wrap(webpackProdConfig);
  // 添加VueLoaderPlugin
  webpackProdConfig.plugins.push(new VueLoaderPlugin());
}

module.exports = webpackProdConfig;
