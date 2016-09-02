var path = require('path');
var rootPath = path.normalize(__dirname + '/../../');

var environment = {
    development: {
        rootPath: rootPath,
        db: {
            username: "sa",
            password: "P@ssw0rd",
            database: "db_accounting_node",
            host: "127.0.0.1",
            dialect: "mssql"
        },
        port: process.env.PORT || 1000,
        clientUrl: 'http://dev-storm:1024',
        messageQueue: 'none'
    },
    production: {
        rootPath: rootPath,
        db: {
            username: "jkfhhrhedmzpnt",
            password: "G0CXzLu0uLzP3jTUNLUODI2bTo",
            database: "d4cd8gk58c0i7d",
            host: "ec2-54-235-246-220.compute-1.amazonaws.com",
            dialect: "postgres"
        },
        port: process.env.PORT || 80,
        clientUrl: '',
        messageQueue: 'none'
    }
};

var env = process.env.NODE_ENV || 'development';

module.exports = environment[env];
