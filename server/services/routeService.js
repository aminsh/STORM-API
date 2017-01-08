"use strict";

module.exports.Router = ()=> new Router();

class Router {

    constructor() {
        this.routes = [];
    }

    route(definition) {
        this.routes.push(definition);
    }
}
