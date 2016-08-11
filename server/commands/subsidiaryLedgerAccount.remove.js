var async = require('asyncawait/async');
var await = require('asyncawait/await');
var command = require('../services/command.define.js');
var string = require('../utilities/string');
var translate = require('../services/translateService');
var repository = require('../data/repository.subsidiaryLedgerAccount.js');

command.define('command.subsidiaryLedgerAccount.update', {
    validate: async(function (cmd) {
        var errors = [];

        // check is used on journal line

        return {
            isValid: !errors.asEnumerable().any(),
            errors: errors
        };
    }),
    handle: async(function (cmd) {
        await(repository.remove(cmd.id));
    })
});

