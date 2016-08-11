var redis = require('redis');
var sub = require('./command.subscriber.js');
var async = require('asyncawait/async');
var await = require('asyncawait/await');
var eventEmitter = require('./eventEmitter');

var commands = [];

function Command(name, actions) {

    this.defaultName = name;

    this.commandName = name;

    this.register = function () {
        sub.subscribe(this.commandName);

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
}

function defineCommand(name, actions) {
    commands.push(new Command(name, actions));
}

module.exports.define = defineCommand;
module.exports.commands = commands;