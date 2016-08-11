var redis = require('redis');
var pub = redis.createClient();
var eventEmitter = require('./eventEmitter');
var guidService = require('./../utilities/guidService');
var Promise = require('promise');

function commandBus(name, command) {
    return new Promise(function (resolve) {
        command.commandId = guidService.newGuid();

        eventEmitter.once(command.commandId, function (result) {
            resolve(result);
        });

        var serializedCmd = JSON.stringify(command);
        pub.publish(name, serializedCmd);
    });
}

module.exports = commandBus;