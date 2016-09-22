var dbConfig = require('../config/config').db;

var knex = require('knex')({
    client: dbConfig.client,
    connection: {
        host: dbConfig.host,
        user: dbConfig.username,
        password: dbConfig.password,
        database: dbConfig.database
    },
    debug: true
});

module.exports = knex;