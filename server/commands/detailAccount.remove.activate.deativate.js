var async = require('asyncawait/async');
var await = require('asyncawait/await');
var command = require('../services/command.define.js');
var string = require('../utilities/string');
var translate = require('../services/translateService');
var repository = require('../data/repository.detailAccount.js');

command.define('command.detailAccount.remove', {
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

command.define('command.detailAccount.activate', {
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

command.define('command.detailAccount.deactivate', {
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


