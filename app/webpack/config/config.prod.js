const merge = require("webpack-merge");
const path = require("path");
const Happypack = require("happypack"); // Parallel builds
const os = require("os");
const webpackBaseConfig = require("./config.base");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const HtmlwebpackInjectAttributesPlugin = require("html-webpack-inject-attributes-plugin");

// Worker pool configuration
const happypackCommonConfig = {
  debug: false,
  threadPool: Happypack.ThreadPool({
    size: os.cpus().length,
  }),
};

// Production configuration
let webpackProdConfig = merge.smart(webpackBaseConfig, {
  // Enable production mode
  mode: "production",
  // Production output
  output: {
    // Generated filename format:
    // [name] is replaced with the entry name, such as entry.page1 or entry.page2
    // [chunkhash:8] is an eight-character chunk hash used for cache invalidation
    filename: "js/[name]_[chunkhash:8].bundle.js",

    // Use path.join to construct a platform-compatible output path
    // Resolve the output directory relative to process.cwd()
    path: path.join(process.cwd(), "./app/public/dist/prod/"),

    // Public URL for generated assets
    // Base URL for static assets in production
    publicPath: "/dist/prod/",

    // Cross-origin asset loading policy
    // anonymous uses anonymous CORS mode for cross-origin requests
    // Avoid sending credentials with cross-origin CDN requests
    crossOriginLoading: "anonymous",
  },

  // Module rules
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, `${require.resolve("happypack/loader")}?id=css`],
      },
      {
        test: /\.js$/,
        include: [path.resolve(__dirname, "../../pages"), path.resolve(process.cwd(), "./app/pages")],
        use: [`${require.resolve("happypack/loader")}?id=js`],
      },
    ],
  },
  //   Report Webpack performance hints as warnings
  performance: {
    hints: "warning",
  },
  //   Plugins
  plugins: [
    // Clean the dist directory before each build
    new CleanWebpackPlugin(["public/dist"], {
      root: path.resolve(process.cwd(), "./app/"),
      exclude: [],
      verbose: true,
      dry: false,
    }),
    // Minify CSS
    new CssMinimizerPlugin(),
    // Extract CSS into separate files for caching
    new MiniCssExtractPlugin({
      chunkFilename: "css/[name]_[contenthash:8].css",
    }),
    // Process JavaScript with a worker pool
    new Happypack({
      ...happypackCommonConfig,
      id: "js",
      loaders: [
        `${require.resolve("babel-loader")}?${JSON.stringify({
          presets: [require.resolve("@babel/preset-env")],
          plugins: [require.resolve("@babel/plugin-transform-runtime")],
        })}`,
      ],
    }),
    // Process CSS with a worker pool
    new Happypack({
      ...happypackCommonConfig,
      id: "css",
      loaders: [
        {
          path: require.resolve("css-loader"),
          options: {
            importLoaders: 1,
          },
        },
      ],
    }),
    // Load cross-origin assets without credentials
    new HtmlwebpackInjectAttributesPlugin({
      crossorigin: "anonymous",
    }),
  ],
  //  Optimization
  optimization: {
    // Use Terser workers and caching to improve minification performance
    // Remove console calls
    minimize: true,
    minimizer: [
      new TerserPlugin({
        cache: true, // Cache minification results
        parallel: true, // Use multiple CPU cores
        terserOptions: {
          compress: {
            drop_console: true, // Remove console calls
          },
        },
      }),
    ],
  },
});

module.exports = webpackProdConfig;
