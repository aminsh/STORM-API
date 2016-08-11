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
            var sla = await(repository.findById(cmd.id, cmd.generalLedgerAccountId));

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

        var dimensionStatus = cmd.dimensionAssignmentStatus.asEnumerable()
            .select(function (das) {
                return {
                    dimensionCategoryId: das.id,
                    assignmentStatus: das.status
                };
            })
            .toArray();

        var createdSla = await(repository.create({
            code: cmd.code,
            title: cmd.title,
            isBankAccount: cmd.isBankAccount,
            detailAccountAssignmentStatus: cmd.detailAccountAssignmentStatus,
            isActive: true,
            generalLedgerAccountId: gla.id,
            subsidiaryLedgerAccountDimensionAssignmentStatuses: dimensionStatus
        }));

        return {id: createdSla.id};
    })
});


