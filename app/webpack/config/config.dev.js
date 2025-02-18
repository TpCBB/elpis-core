const merge = require("webpack-merge");

const webpackBaseConfig = require("./config.base");

const webpackDevConfig = merge(webpackBaseConfig, {


})

module.exports = webpackDevConfig;
