"use strict";

const redis = require('redis'),
    config = require('../config'),
    dbClient = redis.createClient(config.redis),
    publisher = redis.createClient(config.redis),
    subscriber = redis.createClient(config.redis),
    Promise = require('promise');

module.exports = {
    get(key) {
        return new Promise((resolve, reject) => {
            dbClient.get(key, (err, reply) => {
                if (err) return reject(err);
                resolve(JSON.parse(reply));
            });
        });
    },
    set(key, value) {
        dbClient.set(key, JSON.stringify(value));
    },

    publish(channel, data) {
        publisher.publish(channel, JSON.stringify(data));
    },

    subscribe(channel) {
        subscriber.subscribe(channel);
    },

    on(event, handler) {
        subscriber.on(event, handler);
    }
};
