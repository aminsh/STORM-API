var path = require('path');
var rootPath = path.normalize(__dirname + '/../../');

module.exports = {
    development: {
        rootPath: rootPath,
        db: {
            username: "sa",
            password: "P@ssw0rd",
            database: "db_accounting_node",
            host: "127.0.0.1",
            dialect: "mssql"
        },
        port: process.env.PORT || 1000
    },
    production: {
        rootPath: rootPath,
        db: {
            username: "sa",
            password: "P@ssw0rd",
            database: "db_accounting_node",
            host: "127.0.0.1",
            dialect: "mssql"
        },
        port: process.env.PORT || 80
    }
}
