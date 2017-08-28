"use strict";


const path = require('path'),
    rootPath = path.normalize(__dirname + '/../../'),
    env = process.env.NODE_ENV,
    version = {
        vendor: '1.0.0',
        app: '1.0.3'
    };


module.exports = {
    rootPath,
    env,
    version
};

