module.exports = (app) => {
  return {
    // 判断是否本地环境
    isLocal() {
      return process.env.NODE_ENV === "local";
    },
    // 判断是否测试环境
    isBeta() {
      return process.env.NODE_ENV === "beta";
    },
    // 判断是否生产环境
    isProd() {
      return process.env.NODE_ENV === "production";
    },
    // 获取当前环境
    get() {
      return process.env.NODE_ENV ?? "local";
    },
  };
};
