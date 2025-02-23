module.exports = (app) => {
  const BaseService = require('./base')(app)
  const model = require('../../model/index')(app)
  return class ProjectService extends BaseService {
    async getModelList() {
      return model
    }
  }
}
