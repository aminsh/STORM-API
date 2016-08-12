var async = require('asyncawait/async');
var await = require('asyncawait/await');
var command = require('../services/command.define.js');
var string = require('../utilities/string');
var translate = require('../services/translateService');
var repository = require('../data/repository.dimension.js');

command.define('command.dimension.create', {
    validate: async(function (cmd) {
        var errors = [];

        if (!string.isNullOrEmpty(cmd.code)) {
            var dimension = await(repository.findByCode(cmd.code, cmd.dimensionCategoryId));

            if (dimension)
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
        var entity = await(repository.create({
            code: cmd.code,
            title: cmd.title,
            description: cmd.description,
            isActive: true
        }));

        return {id: entity.id};
    })
});

command.define('command.dimension.update', {
    validate: async(function (cmd) {
        var errors = [];

        if (!string.isNullOrEmpty(cmd.code)) {
            var dimension = await(repository.findByCode(cmd.code, cmd.dimensionCategoryId, cmd.id));

            if (dimension)
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
        var entity = await(repository.findById(cmd.id));

        entity.title = cmd.title;
        entity.code = cmd.code;
        entity.description = cmd.description;

        await(repository.update(entity));
    })
});

command.define('command.dimension.remove', {
    validate: async(function (cmd) {
        var errors = [];

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

command.define('command.dimension.activate', {
    validate: async(function (cmd) {
        var errors = [];

        return {
            isValid: !errors.asEnumerable().any(),
            errors: errors
        };
    }),
    handle: async(function (cmd) {
        var entity = await(repository.findById(cmd.id));

        entity.isActive = true;

        await(repository.update(entity));
    })
});

command.define('command.dimension.deactivate', {
    validate: async(function (cmd) {
        var errors = [];

        return {
            isValid: !errors.asEnumerable().any(),
            errors: errors
        };
    }),
    handle: async(function (cmd) {
        var entity = await(repository.findById(cmd.id));

        entity.isActive = false;

        await(repository.update(entity));
    })
});
