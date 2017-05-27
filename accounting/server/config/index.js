"use strict";

const path = require('path'),
    rootPath = path.normalize(__dirname + '/../../'),
    env = process.env.NODE_ENV || 'development',
    version = {
        vendor: '1.0.0',
        acc: '1.0.0',
        css: '1.0.0',
        template: '1.0.0'
    },
    branchId = 'c3339d0d-b4f7-4c96-b5c2-2d4376ceb9ea',
    db = env == 'development'
        ? {
            client: 'pg',
            connection: 'postgres://postgres:P@ssw0rd@localhost:5432/dbAcc',
            debug: true
        } : {
            client: 'pg',
            connection: process.env.APP_DATABASE_URL,
            debug: true
        };


module.exports = {
    rootPath,
    env,
    version,
    branchId,
    db
};

