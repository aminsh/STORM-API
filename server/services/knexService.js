var dbConfig = require('../config/config').db;

var knex = require('knex')({
    client: dbConfig.client,
    connection: dbConfig.url || {
        host: dbConfig.host,
        user: dbConfig.username,
        password: dbConfig.password,
        database: dbConfig.database,
        ssl: dbConfig.ssl
    },
    debug: true
});

module.exports = knex;