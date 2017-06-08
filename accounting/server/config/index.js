"use strict";

const path = require('path'),
    rootPath = path.normalize(__dirname + '/../../'),
    env = process.env.NODE_ENV || 'development',
    version = {
        vendor: '1.0.0',
        app: '1.0.1'
    },
    branchId = 'c3339d0d-b4f7-4c96-b5c2-2d4376ceb9ea',
    db = env == 'development'
        ? {
            client: 'pg',
            connection: 'postgres://postgres:P@ssw0rd@localhost:5432/dbAccounting',
            //connection: 'postgres://heruodemdgocqq:93377433407ad323f529b482c78812429f6ee49b8dae9885e755bbead6fd82bb@ec2-50-19-219-69.compute-1.amazonaws.com:5432/d8vpprg301m6t4?ssl=true',
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

