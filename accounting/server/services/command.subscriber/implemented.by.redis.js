var redis = require('redis');
var sub = redis.createClient();

module.exports.on = function (name, action) {
    sub.on('message', function (channel, message) {
        action(message);
    });
};

module.exports.subscribe = function (name) {
    sub.subscribe(name);
}
