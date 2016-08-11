var async = require('asyncawait/async');
var await = require('asyncawait/await');
var command = require('../services/command.define.js');
var translate = require('../services/translateService');
var repository = require('../data/repository.generalLedgerAccount.js');

command.define('command.generalLedgerAccount.remove', {
    validate: async(function (cmd) {
        var errors = [];

        var gla = await(repository.findById(cmd.id));

        if (gla.subsidiaryLedgerAccounts.asEnumerable().any())
            errors
                .push(translate('The Current Account has Subsidiary ledger account'));

        //check for journal line

        return {
            isValid: !errors.asEnumerable().any(),
            errors: errors
        };
    }),
    handle: async(function (cmd) {
        await(repository.remove(cmd.id));
    })
});

command.define('command.generalLedgerAccount.activate', {
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

command.define('command.generalLedgerAccount.deactivate', {
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


