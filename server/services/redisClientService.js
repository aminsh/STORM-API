var redis = require('redis'),
    config = require('../config'),
    client = redis.createClient(config.redis),
    Promise = require('promise');

module.exports = {
    get(key) {
        return new Promise((resolve, reject) => {
            client.get(key, (err, reply) => {
                if (err) return reject(err);
                resolve(JSON.parse(reply));
            });
        });
    },
    set(key, value) {
        client.set(key, JSON.stringify(value));
    },

    publish(channel, data) {
        client.publish(channel, JSON.stringify(data));
    },

    subscribe(channel) {
        client.subscribe(channel);
    },

    on(event, handler) {
        client.on(event, handler);
    }
};
