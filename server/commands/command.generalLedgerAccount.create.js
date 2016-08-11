var async = require('asyncawait/async');
var await = require('asyncawait/await');
var DefineCommand = require('../utilities/command.define');
var string = require('../utilities/string');
var translate = require('../services/translateService');
var repository = require('../data/repository.generalLedgerAccount');

var command = new DefineCommand('command.generalLedgerAccount.create', {
    validate: async(function (cmd) {
        var errors = [];

        if (string.isNullOrEmpty(cmd.code))
            errors.push(translate('The code is required'));
        else {
            var gla = await(repository.findByCode(cmd.code));

            if (gla)
                errors.push(translate('The code is duplicated'));
        }

        if (string.isNullOrEmpty(cmd.title))
            errors.push(translate('The title is required'));
        else {
            if (cmd.title.length < 3)
                errors.push(translate('The title should have at least 3 character'));
        }

        return {
            isValid: !errors.asEnumerable().any(),
            errors: errors
        };
    }),
    handle: async(function (cmd) {

        var entity = {
            code: cmd.code,
            title: cmd.title,
            postingType: cmd.postingType,
            balanceType: cmd.balanceType,
            description: cmd.description,
            isActive: true
        };

        entity = repository.create(entity);

        return {id: entity.id};
    })
});

module.exports = command;
