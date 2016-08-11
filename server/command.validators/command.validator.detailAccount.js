var string = require('../utilities/string');
var translate = require('../services/translateService');
var models = require('../models');
var async = require('asyncawait/async');
var await = require('asyncawait/await');

var onCreate = async(function (cmd) {
    var errors = [];

    if (string.isNullOrEmpty(cmd.code))
        errors.push(translate('The code is required'));
    else {
        var gla = await(models.detailAccount
            .findOne({where: {code: cmd.code}}));

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
});

var onUpdate = async(function (cmd) {
    var errors = [];

    if (string.isNullOrEmpty(cmd.code))
        errors.push(translate('The code is required'));
    else {
        var gla = await(models.detailAccount
            .findOne({
                where: {
                    code: cmd.code,
                    id: {
                        $ne: cmd.id
                    }
                }
            }));

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
});

var onDelete = async(function (cmd) {
    var errors = [];

    //check for journal line

    return {
        isValid: !errors.asEnumerable().any(),
        errors: errors
    };
});

module.exports = {
    onCreate: onCreate,
    onUpdate: onUpdate,
    onDelete: onDelete
};
