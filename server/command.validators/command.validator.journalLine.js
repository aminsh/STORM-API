var string = require('../utilities/string');
var translate = require('../services/translateService');
var async = require('asyncawait/async');
var await = require('asyncawait/await');
var fiscalPeriodRepository = require('../data/fiscalPeriodRepository');

var onCreate = async(function (cmd, current) {
    var errors = [];

    if (string.isNullOrEmpty(cmd.article))
        errors.push(translate('The Article is required'));

    if (cmd.article.length < 3)
        errors.push(translate('The Article should have at least 3 character'));

    return {
        isValid: !errors.asEnumerable().any(),
        errors: errors
    };
});

var onUpdate = async(function (cmd, current) {
    var errors = [];

    if (string.isNullOrEmpty(cmd.article))
        errors.push(translate('The Article is required'));

    if (cmd.article.length < 3)
        errors.push(translate('The Article should have at least 3 character'));

    return {
        isValid: !errors.asEnumerable().any(),
        errors: errors
    };
});

var onDelete = async(function (cmd, current) {
    var errors = [];


    return {
        isValid: !errors.asEnumerable().any(),
        errors: errors
    };
});


module.exports = {
    onCreate: onCreate,
    onUpdate: onUpdate,
    onDelete: onDelete,
};

