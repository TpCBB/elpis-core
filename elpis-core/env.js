module.exports = (app) => {
  return {
    // Check whether the environment is local
    isLocal() {
      return process.env.NODE_ENV === "local";
    },
    // Check whether the environment is beta
    isBeta() {
      return process.env.NODE_ENV === "beta";
    },
    // Check whether the environment is production
    isProd() {
      return process.env.NODE_ENV === "production";
    },
    // Get the current environment
    get() {
      return process.env.NODE_ENV ?? "local";
    },
  };
};
