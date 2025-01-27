const path = require("path");
const glob = require("glob");
const { sep } = path;
/**
 * router-schema loader
 * @param {object} app
 *
 * 通过 json-schema 和 ajv 对api进行约束, 配合 api-params-verify 中间件使用
 *
 * 文件目录: app/router-schema/**.js
 *
 * 输出:
 * app.routerSchema = {
 *  '${api1}': ${jsonSchema1},
 *  '${api2}': ${jsonSchema2},
 *  ...
 * }
 *
 */
module.exports = (app) => {
  // 读取 router-schema下所有的文件
  const routerSchemaPath = path.resolve(app.businessDir, `.${sep}router-schema`);
  const fileList = glob.sync(
    path.resolve(routerSchemaPath, `${sep}**${sep}**.js`)
  );

  //注册所有router-schema
  const routerSchema = {};
  fileList.forEach((file) => {
    routerSchema = {
      ...routerSchema,
      ...require(path.resolve(file)),
    };
  });
  app.routerSchema = routerSchema;
};
