var redis = require('redis'),
    config = require('../config'),
    client = redis.createClient(config.redis);

module.exports = client;