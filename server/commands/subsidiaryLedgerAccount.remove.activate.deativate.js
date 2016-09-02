var async = require('asyncawait/async');
var await = require('asyncawait/await');
var command = require('../services/command.define.js');
var string = require('../utilities/string');
var translate = require('../services/translateService');
var repository = require('../data/repository.subsidiaryLedgerAccount.js');

command.define('command.subsidiaryLedgerAccount.activate', {
    validate: async(function (cmd) {
        var errors = [];

        return {
            isValid: !errors.asEnumerable().any(),
            errors: errors
        };
    }),
    handle: async(function (cmd) {
        var entity = await(repository.findById(cmd.id));

        entity.isActive = true;

        await(repository.update(entity));
    })
});

command.define('command.subsidiaryLedgerAccount.deactivate', {
    validate: async(function (cmd) {
        var errors = [];

        return {
            isValid: !errors.asEnumerable().any(),
            errors: errors
        };
    }),
    handle: async(function (cmd) {
        var entity = await(repository.findById(cmd.id));

        entity.isActive = false;

        await(repository.update(entity));
    })
});

