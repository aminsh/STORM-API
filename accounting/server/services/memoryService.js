"use strict";

const app = require('../config/config.express');

module.exports.get = function(key){
    return app.get(key);
};

module.exports.set = function(key, value){
    app.set(key, value);
};
