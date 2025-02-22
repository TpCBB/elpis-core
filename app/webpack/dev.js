// 本地开发启动 devserver
const express = require("express");
const consoler = require("consoler");
const path = require("path");
const webpack = require("webpack");
const devMiddleware = require("webpack-dev-middleware");
const hotMiddleware = require("webpack-hot-middleware");
const { webpackDevConfig, DEV_SERVER_CONFIG } = require("./config/config.dev");

const compiler = webpack(webpackDevConfig);

const app = express();

// 指定静态文件目录
app.use(express.static(path.resolve(__dirname, "../public/dist")));

// 使用 webpack-dev-middleware 中间件
app.use(
  devMiddleware(compiler, {
    // 指定写入磁盘的文件
    writeToDisk: (filePath) => filePath.endsWith(".tpl"), 
    // 指定静态文件目录
    publicPath: webpackDevConfig.output.publicPath,

    // headers配置 跨域
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization",
    },

    // stats 配置
    stats: {
      colors: true,
    },
  })
);

// 使用 webpack-hot-middleware 中间件
app.use(
  hotMiddleware(compiler, {
    path: `/${DEV_SERVER_CONFIG.HMR_PATH}`,
    heartbeat: 10000,
  })
); //通过WebSocket保持客户端和服务器的实时通信


consoler.info(`请等待webpack初次构建完成提示...`)

// 启动服务
app.listen(DEV_SERVER_CONFIG.PORT, () => {
  consoler.info(`app listening on: http://${DEV_SERVER_CONFIG.HOST}:${DEV_SERVER_CONFIG.PORT}`);
});
