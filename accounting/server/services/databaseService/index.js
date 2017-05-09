"use strict";

const postgresOnDevelopment = require('./postgresOnDevelopment'),
    postgresOnCloud = require('./postgresOnProduction'),
    sqlite = require('./sqlite');

module.exports = {
    create(branch) {
        if (branch.type == 'free')
            return sqlite.create(branch.id);

        if (process.env.NODE_ENV == 'development')
            return postgresOnDevelopment.create(branch.id);

        if (['production', 'staging'].includes(process.env.NODE_ENV))
            return postgresOnCloud.create(branch.id);
    }
};

