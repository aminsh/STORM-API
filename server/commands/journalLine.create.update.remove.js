var async = require('asyncawait/async');
var await = require('asyncawait/await');
var command = require('../services/command.define.js');
var string = require('../utilities/string');
var translate = require('../services/translateService');
var repository = require('../data/repository.journalLine.js');
var dimensionRepository = require('../data/repository.dimension');

command.define('command.journalLine.create', {
    validate: async(function (cmd) {
        var errors = [];

        if (string.isNullOrEmpty(cmd.article))
            errors.push(translate('The Article is required'));

        if (cmd.article.length < 3)
            errors.push(translate('The Article should have at least 3 character'));

        return {
            isValid: !errors.asEnumerable().any(),
            errors: errors
        };
    }),
    handle: async(function (cmd) {
        var dimensions = cmd.dimension.asEnumerable()
            .select(async(function (d) {
                return await(dimensionRepository.findById(d.id));
            }))
            .toArray();

        var entity = {
            journalId: cmd.journalId,
            subsidiaryLedgerAccountId: cmd.subsidiaryLedgerAccountId,
            detailAccountId: cmd.detailAccountId,
            description: cmd.description,
            debtor: cmd.balanceType == 'debtor' ? cmd.amount : 0,
            creditor: cmd.balanceType == 'creditor' ? cmd.amount : 0
        };

        await(repository.create(entity, dimensions));
    })
});

command.define('command.journalLine.update', {
    validate: async(function (cmd) {
        var errors = [];

        if (string.isNullOrEmpty(cmd.article))
            errors.push(translate('The Article is required'));

        if (cmd.article.length < 3)
            errors.push(translate('The Article should have at least 3 character'));

        return {
            isValid: !errors.asEnumerable().any(),
            errors: errors
        };
    }),
    handle: async(function (cmd) {
        var entity = await(repository.findById(cmd.id));

        var dimensions = cmd.dimension.asEnumerable()
            .select(async(function (d) {
                return await(dimensionRepository.findById(d.id));
            }))
            .toArray();

        entity.subsidiaryLedgerAccountId = cmd.subsidiaryLedgerAccountId;
        entity.detailAccountId = cmd.detailAccountId;
        entity.description = cmd.description;
        entity.debtor = cmd.balanceType == 'debtor' ? cmd.amount : 0;
        entity.creditor = cmd.balanceType == 'creditor' ? cmd.amount : 0;

        await(repository.update(entity, dimensions));
    })
});

command.define('command.journalLine.remove', {
    validate: async(function (cmd) {
        var errors = [];


        return {
            isValid: !errors.asEnumerable().any(),
            errors: errors
        };
    }),
    handle: async(function (cmd) {
        await(repository.remove(cmd.id));
    })
});