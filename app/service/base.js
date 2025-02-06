const superagent = require("superagent");
module.exports = (app) => class BaseService {
    // 这里需要调用到外部服务 需要请求
    /**
     * service 基类
     * 统一收拢 service 相关公共方法
     */
    constructor(){
        this.app = app;
        this.service = app.service;
        this.config = app.config
        this.curl = superagent;
    }
    

};
