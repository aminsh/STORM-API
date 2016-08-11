var string = require('../utilities/string');
var translate = require('../services/translateService');
var models = require('../models');
var async = require('asyncawait/async');
var await = require('asyncawait/await');

var onCreate = async(function (cmd) {
    var errors = [];

    if (string.isNullOrEmpty(cmd.title))
        errors.push(translate('The code is required'));
    else {
        if (cmd.title.length < 3)
            errors.push(translate('The title should have at least 3 character'));
    }

    if (!string.isNullOrEmpty(cmd.code)) {
        var sla = await(models.subsidiaryLedgerAccount.findOne({
            where: {
                code: cmd.code
            },
            include: [{
                model: models.generalLedgerAccount,
                where: {id: cmd.generalLedgerAccountId}
            }]
        }));

        if (sla)
            errors.push(translate('The code is duplicated'));
    }

    return {
        isValid: !errors.asEnumerable().any(),
        errors: errors
    };
});

var onUpdate = async(function (cmd) {
    var errors = [];

    if (string.isNullOrEmpty(cmd.title))
        errors.push(translate('The code is required'));
    else {
        if (cmd.title.length < 3)
            errors.push(translate('The title should have at least 3 character'));
    }

    if (!string.isNullOrEmpty(cmd.code)) {
        var sla = await(models.subsidiaryLedgerAccount.findOne({
            where: {
                code: cmd.code,
                id: {
                    $ne: cmd.id
                }
            },
            include: [{
                model: models.generalLedgerAccount,
                where: {id: cmd.generalLedgerAccountId}
            }]
        }));

        if (sla)
            errors.push(translate('The code is duplicated'));
    }

    return {
        isValid: !errors.asEnumerable().any(),
        errors: errors
    };
});

var onDelete = async(function (cmd) {
    var errors = [];

    // check is used on journal line

    return {
        isValid: !errors.asEnumerable().any(),
        errors: errors
    };
})

module.exports = {
    onCreate: onCreate,
    onUpdate: onUpdate,
    onDelete: onDelete
};