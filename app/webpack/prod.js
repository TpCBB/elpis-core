const webpack = require("webpack");
const webpackProdConfig = require("./config/config.prod.js");

module.exports = () => {
  
  console.log("\n building  \n");
  
  webpack(webpackProdConfig, (err, stats) => {
    if (err) {
      console.log(`error: ${err}`);
      return;
    }
    process.stdout.write(
      `${
        stats.toString({
          colors: true, // Use colored console output
          modules: false, // Hide module details
          children: false, // Hide child compilation details
          chunks: false, // Hide chunk details
          chunkModules: true, // Show chunk module details
        }) + "\n"
      }`
    );
  });
}

