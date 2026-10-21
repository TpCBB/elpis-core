const log4js = require("log4js");

/**
 * Logging utility
 * Usage: app.logger.info and app.logger.error
 *
 */

module.exports = (app) => {
  let logger;

  if (app.env.isLocal()) {
    // Use console logging in the local environment
    logger = console;
  } else {
    // Use log4js to write logs to disk outside the local environment
    log4js.configure({
      appenders: {
        console: {
          type: "console",
        },
        // Rotate log files
        dateFile: {
          type: "dateFile",
          filename: "./logs/application.log",
          pattern: ".yyyy-MM-dd",
        },
      },
      categories: {
        default: {
          appenders: ["console", "dateFile"],
          level: "trace",
        },
      },
    });

    logger = log4js.getLogger();
  }

  return logger;
};
