const merge = require("webpack-merge");
const path = require("path");
const webpack = require("webpack");
// Base configuration
const baseConfig = require("./config.base");
// Development server configuration
const DEV_SERVER_CONFIG = {
  HOST: "127.0.0.1", // Host address
  PORT: 9002, // Port number
  HOT: true, // Enable hot updates
  HMR_PATH: "__webpack_hrm", // HMR endpoint path
  TIMEOUT: 20000,
};

// Add the HMR client to development entry points
Object.keys(baseConfig.entry).forEach((key) => {
  if(key !== 'vendor') {
  baseConfig.entry[key] = [
      // Main entry point
      baseConfig.entry[key],
      // HMR client entry with the configured middleware endpoint
      `${require.resolve('webpack-hot-middleware/client')}?path=http://${DEV_SERVER_CONFIG.HOST}:${DEV_SERVER_CONFIG.PORT}/${DEV_SERVER_CONFIG.HMR_PATH}?timeout=${DEV_SERVER_CONFIG.TIMEOUT}&reload=true}`,
    ]
  }
});

// Development configuration
const webpackDevConfig = merge(baseConfig, {
  mode: "development", // Enable development mode
  // Enable source maps for development debugging
  devtool: "eval-source-map",
  output: {
    filename: "js/[name]_[chunkhash:8].bundle.js",
    path: path.resolve(process.cwd(), "./app/public/dist/dev"), // Output directory
    publicPath: `http://${DEV_SERVER_CONFIG.HOST}:${DEV_SERVER_CONFIG.PORT}/public/dist/dev`, // Public URL for generated assets
    globalObject: "this", // Global object
  },

  // Development plugins
  plugins: [
    // Enable hot module replacement
    // Replace modules while the application is running
    // Reduce full-page reloads during development
    new webpack.HotModuleReplacementPlugin({
      multiStep: false,
    }),
  ],
});

module.exports = { webpackDevConfig, DEV_SERVER_CONFIG };
