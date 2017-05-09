"use strict";

const app = require('../../storm/server/config/express').app;

module.exports.get = function(key){
    return app.get(key);
};

module.exports.set = function(key, value){
    app.set(key, value);
};
