var path = require('path');
var rootPath = path.normalize(__dirname + '/../../');

var environment = {
    development: {
        rootPath: rootPath,
        db: '',
        port: process.env.PORT || 1001,
        clientUrl: 'http://dev-storm:1024'
    },
    production: {
        rootPath: rootPath,
        db: '',
        port: process.env.PORT || 80,
        clientUrl: ''
    }
};

var env = process.env.NODE_ENV || 'development';

module.exports = environment[env];