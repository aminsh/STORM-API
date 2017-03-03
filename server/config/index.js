var path = require('path');
var rootPath = path.normalize(__dirname + '/../../');


var environment = {
    development: {
        rootPath: rootPath,
        db: {
            username: "postgres",
            password: "P@ssw0rd",
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
            username: "bnsasmix",
            password: "218F3-sPy8resQ78O8dHYGhjKeb4-dX6",
            database: "bnsasmix",
            host: "elmer-02.db.elephantsql.com",
            dialect: "postgres",
            ssl: true,
            dialectOptions: {
                require: true,
                ssl: true
            },
            client: 'pg',
            url: 'postgres://fylstbtt:n-qAFaaf0BNGbrXhEr44C_iFeguI0chB@qdjjtnkv.db.elephantsql.com:5432/fylstbtt'
        },
        port: process.env.PORT || 80,
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
