var publisher = require('./command.publisher');
var eventEmitter = require('./eventEmitter');
var guidService = require('./../utilities/guidService');
var Promise = require('promise');

function commandBus(message) {
    return new Promise(function (resolve) {
        message.commandId = guidService.newGuid();

        eventEmitter.once(message.commandId, function (result) {
            resolve(result);
        });

        var serializedMessage = JSON.stringify(message);

        var name = message.branchId == undefined
            ? message.name
            : '{0}/{1}'.format(message.name, message.branchId);

        publisher.publish(name, serializedMessage);
    });
}

module.exports.send = commandBus;