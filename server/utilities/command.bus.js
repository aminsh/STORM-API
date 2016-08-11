var redis = require('redis');
var pub = redis.createClient();
var eventEmitter = require('./eventEmitter');
var guidService = require('./guidService');
var Promise = require('promise');

function commandBus(name, command) {
    return new Promise(function (resolve, reject) {
        command.commandId = guidService.newGuid();

        eventEmitter.on(command.commandId, function (result) {
            resolve(result);
        });

        pub.publish(name, command);
    });
}

module.exports = commandBus;