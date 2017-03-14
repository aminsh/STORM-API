"use strict";

const pg = require('pg'),
    Promise = require('promise'),
    config = require('../../config'),
    objectUtil = require('../../utilities/object');

module.exports = {
    create(branchId) {
        let configPostgresDb = objectUtil.clone(config.db);

        configPostgresDb.connection.database = 'postgres';

        let pool = new pg.Pool(config);

        return new Promise((resolve, reject) => {
            pool.connect((err, client, done) => {
                if (err) return reject(err);

                let databaseName = `db-accounting-${branchId}`;

                client.query(`CREATE DATABASE ${databaseName}`,
                    (err, result) => {
                        done();

                        if (err) return reject(err);

                        let dbConfig = objectUtil.clone(config.db);

                        dbConfig.connection.database = databaseName;

                        resolve(dbConfig);
                    });
            });
        });
    }
};