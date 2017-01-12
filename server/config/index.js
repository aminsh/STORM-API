var path = require('path'),
    rootPath = path.normalize(__dirname + '/../../'),
    env = process.env.NODE_ENV || 'development',
    config = require(`./environments/${env}`);

config.rootPath = rootPath;

if(config.db.connection.filename)
    config.db.connection.filename = config.db.connection.filename.format(rootPath);

module.exports = config;

