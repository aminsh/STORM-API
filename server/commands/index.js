var fs = require("fs");
var async = require('asyncawait/async');
var await = require('asyncawait/await');
var sub = require('./command.subscriber');
var eventEmitter = require('./eventEmitter');
var commands = require('../services/command.define').commands;

fs
    .readdirSync(__dirname)
    .filter(function (file) {
        return (file.indexOf(".") !== 0) && (file !== "index.js");
    })
    .forEach(function (file) {
        require('./' + file);
    });

module.exports.registerAll = function (branchId) {
    commands.forEach(function (cmd) {
        cmd.commandName = branchId == undefined
            ? cmd.defaultName
            : "{0}/{1}".format(branchId, cmd.defaultName);

        sub.subscribe(cmd.commandName);
    });


    function register() {
        sub.on('message', async(function (channel, message) {
            var message = JSON.parse(message);
            var cmd = message.command;

            var command = commands.asEnumerable().single(function (c) {
                return c.commandName == message.commandName;
            });

            var validationResult = await(command.actions.validate(cmd));

            if (!validationResult.isValid)
                return eventEmitter.emit(command.commandId, validationResult);

            var returnValue = await(command.actions.handle(cmd));

            return eventEmitter.emit(command.commandId, {
                isValid: true,
                returnValue: returnValue
            });
        }));
    }

    register();
};