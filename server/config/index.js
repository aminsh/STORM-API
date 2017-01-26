"use strict";

const path = require('path'),
    rootPath = path.normalize(__dirname + '/../../'),
    env = process.env.NODE_ENV || 'development',
    config = require(`./environments/${env}`),
    args = require('yargs').argv;

config.mode = args.mode ? args.mode.toUpperCase() : 'INTEGRATED';
config.rootPath = rootPath;

if (config.db.connection.filename)
    config.db.connection.filename = config.db.connection.filename.format(rootPath);

config.env = env;

module.exports = config;

