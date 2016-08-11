var async = require('asyncawait/async');
var await = require('asyncawait/await');
var command = require('../services/command.define.js');
var translate = require('../services/translateService');
var repository = require('../data/repository.generalLedgerAccount.js');

command.define('command.generalLedgerAccount.update', {
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


