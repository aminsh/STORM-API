var async = require('asyncawait/async');
var await = require('asyncawait/await');
var command = require('../services/command.define.js');
var string = require('../utilities/string');
var translate = require('../services/translateService');
var repository = require('../data/repository.subsidiaryLedgerAccount.js');
var generalLedgerAccountRepository = require('../data/repository.generalLedgerAccount.js');

command.define('command.subsidiaryLedgerAccount.create', {
    validate: async(function (cmd) {
        var errors = [];

        if (string.isNullOrEmpty(cmd.title))
            errors.push(translate('The code is required'));
        else {
            if (cmd.title.length < 3)
                errors.push(translate('The title should have at least 3 character'));
        }

        if (!string.isNullOrEmpty(cmd.code)) {
            var sla = await(repository.findByCode(cmd.code, cmd.generalLedgerAccountId));

            if (sla)
                errors.push(translate('The code is duplicated'));
        }

        return {
            isValid: !errors.asEnumerable().any(),
            errors: errors
        };
    }),
    handle: async(function (cmd) {
        var gla = await(generalLedgerAccountRepository.findById(cmd.generalLedgerAccountId));

        var createdSla = await(repository.create({
            code: cmd.code,
            title: cmd.title,
            isBankAccount: cmd.isBankAccount,
            detailAccountAssignmentStatus: cmd.detailAccountAssignmentStatus,
            dimension1AssignmentStatus: cmd.dimension1AssignmentStatus,
            dimension2AssignmentStatus: cmd.dimension2AssignmentStatus,
            dimension3AssignmentStatus: cmd.dimension3AssignmentStatus,
            isActive: true,
            generalLedgerAccountId: gla.id
        }));

        return {id: createdSla.id};
    })
});

command.define('command.subsidiaryLedgerAccount.update', {
    validate: async(function (cmd) {
        var errors = [];

        if (string.isNullOrEmpty(cmd.title))
            errors.push(translate('The code is required'));
        else {
            if (cmd.title.length < 3)
                errors.push(translate('The title should have at least 3 character'));
        }

        if (!string.isNullOrEmpty(cmd.code)) {
            var sla = await(repository.findByCode(cmd.code, cmd.generalLedgerAccountId, cmd.id));

            if (sla)
                errors.push(translate('The code is duplicated'));
        }

        return {
            isValid: !errors.asEnumerable().any(),
            errors: errors
        };
    }),
    handle: async(function (cmd) {
        var entity = await(repository.findById(cmd.id));

        entity.code = cmd.code;
        entity.title = cmd.title;
        entity.isBankAccount = cmd.isBankAccount;
        entity.detailAccountAssignmentStatus = cmd.detailAccountAssignmentStatus;
        entity.dimension1AssignmentStatus = cmd.dimension1AssignmentStatus;
        entity.dimension2AssignmentStatus = cmd.dimension2AssignmentStatus;
        entity.dimension3AssignmentStatus = cmd.dimension3AssignmentStatus;

        await(repository.update(entity));

    })
});


