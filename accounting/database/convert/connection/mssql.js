const mssql = require('mssql'),
    config = require('../config.json')['source-db'];


    
module.exports = mssql.Request;

module.exports.connect = mssql.connect(config.url)

