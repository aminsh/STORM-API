var redis = require('redis');
var pub = redis.createClient();

module.exports = pub;
