var async = require('asyncawait/async');
var await = require('asyncawait/await');
var command = require('../services/command.define.js');
var string = require('../utilities/string');
var translate = require('../services/translateService');
var repository = require('../data/repository.detailAccount.js');

command.define('command.detailAccount.create', {
    validate: async(function (cmd) {
        if (string.isNullOrEmpty(cmd.code))
            errors.push(translate('The code is required'));
        else {
            var gla = await(repository.findById(cmd.id));

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
            description: cmd.description,
            isActive: true
        };

        var entity = await(repository.create(entity));

        return {id: entity.id};
    })
});


