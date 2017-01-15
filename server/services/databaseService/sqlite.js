const fs = require('fs'),
    config = require('../config'),
    Promise = require('promise');

module.exports = {
    create(branchId) {
        return new Promise((resolve, reject) => {
            const filename = `db-accounting-${branchId}.sqlite`;

            fs.writeFile(
                `${config.rootPath}/database/sqlitefiles/${filename}`),
                '',
                (err) => {
                    if (err) return reject(err);

                    return resolve({
                        client: 'sqlite3',
                        connection: {
                            filename: `${config.rootPath}/database/sqlitefiles/${filename}`
                        }
                    });
                }
        });
    }
}