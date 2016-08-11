var redis = require('redis');
var sub = redis.createClient();

module.exports = sub;