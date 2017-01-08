var path = require('path'),
    rootPath = path.normalize(__dirname + '/../../'),
    env = process.env.NODE_ENV || 'development',
    config = require(`./environments/${env}`);

config.rootPath = rootPath;

module.exports = config;

