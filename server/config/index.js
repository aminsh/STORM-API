var path = require('path');
var rootPath = path.normalize(__dirname + '/../../');


var environment = {
    development: {
        rootPath: rootPath,
        db: {
            username: "postgres",
            password: "123456",
            database: "admin",
            host: "localhost",
            dialect: "postgres",
            client: 'pg'
        },
        port: process.env.PORT || 2000,
        version: {
            vendor: '1.0.0',
            acc: '1.0.0',
            css: '1.0.0',
            template: '1.0.0'
        }
    },
    production: {
        rootPath: rootPath,
        db: {
            username: "jkfhhrhedmzpnt",
            password: "G0CXzLu0uLzP3jTUNLUODI2bTo",
            database: "d4cd8gk58c0i7d",
            host: "ec2-54-235-246-220.compute-1.amazonaws.com",
            dialect: "postgres",
            ssl: true,
            dialectOptions: {
                require: true,
                ssl: true
            },
            client: 'pg',
            //url: 'postgres://lgxdmvmmirytbb:2df3fc723567867100f43052bcef0746d079ee75a765567be0fec2d511139541@ec2-174-129-37-15.compute-1.amazonaws.com:5432/d37aunppf7pl08'
            url: process.env.DATABASE_URL
        },
        port: process.env.PORT || 1001,
        reportPath: path.normalize('{0}/server/report.templates'.format(rootPath)),
        version: {
            vendor: '1.0.0',
            acc: '1.0.0',
            css: '1.0.0',
            template: '1.0.0'
        }
    }
};

var env = process.env.NODE_ENV || 'development';

module.exports = environment[env];
