var redis = require('redis');
var sub = require('../utilities/command.subscriber');
var async = require('asyncawait/async');
var await = require('asyncawait/await');
var eventEmitter = require('./eventEmitter');

function defineCommand(name, actions) {

    sub.subscribe(name);

    sub.on('message', async(function (channel, message) {
        var cmd = JSON.parse(message);
        var validationResult = await(actions.validate(cmd));

        if (!validationResult.isValid)
            return eventEmitter.emit(cmd.commandId, validationResult);

        var returnValue = await(actions.handle(cmd));
        return eventEmitter.emit(cmd.commandId, {
            isValid: true,
            returnValue: returnValue
        });
    }));
}

module.exports = defineCommand;