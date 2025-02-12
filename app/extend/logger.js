const log4js = require("log4js");

/**
 * 日志工具
 * 外部调用 app.logger.info app.logger.error
 *
 */

module.exports = (app) => {
  let logger;

  if (app.env.isLocal()) {
    // 如果是本地就直接使用console
    logger = console;
  } else {
    // 如果是生产环境就使用log4js, 日志会落盘
    log4js.configure({
      appenders: {
        console: {
          type: "console",
        },
        // 日志文件切分
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
