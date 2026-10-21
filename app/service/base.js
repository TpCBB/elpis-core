const superagent = require("superagent");
module.exports = (app) => class BaseService {
    // Use this layer for requests to external services
    /**
     * Service base class
     * Shared service methods
     */
    constructor(){
        this.app = app;
        this.service = app.service;
        this.config = app.config
        this.curl = superagent;
    }
    

};
