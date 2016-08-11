var fs = require("fs");
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

        cmd.register();
    });
};