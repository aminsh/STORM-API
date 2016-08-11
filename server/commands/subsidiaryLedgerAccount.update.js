var async = require('asyncawait/async');
var await = require('asyncawait/await');
var command = require('../services/command.define.js');
var string = require('../utilities/string');
var translate = require('../services/translateService');
var repository = require('../data/repository.subsidiaryLedgerAccount.js');

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

            var sla = await(repository.findByCode(cmd.code, cmd.id));

            if (sla)
                errors.push(translate('The code is duplicated'));
        }

        return {
            isValid: !errors.asEnumerable().any(),
            errors: errors
        };
    }),
    handle: async(function (cmd) {
        var entity = await(repository.findById(cmd.id, cmd.generalLedgerAccountId));

        entity.code = cmd.code;
        entity.title = cmd.title;
        entity.isBankAccount = cmd.isBankAccount;
        entity.detailAccountAssignmentStatus = cmd.detailAccountAssignmentStatus;

        var dimensionStatus = cmd.dimensionAssignmentStatus
            .asEnumerable()
            .select(function (das) {
                return {
                    dimensionCategoryId: das.id,
                    assignmentStatus: das.status
                };
            })
            .toArray();

        await(repository.update(entity, dimensionStatus));
    })
});
