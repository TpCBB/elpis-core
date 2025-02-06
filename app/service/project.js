module.exports = (app) => {
  const BaseService = require("./base")(app);
  return class ProjectService extends BaseService {
    getList() {
      return [
        {
          projectName: "项目1",
          projectId: "123456",
        },
        {
          projectName: "项目1",
          projectId: "123456",
        },
        {
          projectName: "项目1",
          projectId: "123456",
        },
        {
          projectName: "项目1",
          projectId: "123456",
        },
      ];
    }
  };
};
