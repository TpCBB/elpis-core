const webpack = require("webpack");
const webpackProdConfig = require("./config/config.prod.js");

console.log("\n building  \n");

webpack(webpackProdConfig, (err, stats) => {
  if (err) {
    console.log(`error: ${err}`);
    return;
  }
  process.stdout.write(
    `${
      stats.toString({
        colors: true, // 在控制台输出彩色
        modules: false, // 不显示模块信息
        children: false, // 不显示子级信息
        chunks: false, // 不显示代码块信息
        chunkModules: true, // 显示代码块模块信息
      }) + "\n"
    }`
  );
});
