var async = require('asyncawait/async');
var await = require('asyncawait/await');
var command = require('../services/command.define.js');
var translate = require('../services/translateService');
var repository = require('../data/repository.journal.js');
var fiscalPeriodRepository = require('../data/repository.fiscalPeriod');

command.define('command.journal.remove', {
    validate: async(function (cmd, current) {
        var errors = [];

        var currentFiscalPeriod = await(fiscalPeriodRepository.findById(current.id));
        var journal = await(journalRepository.findById(cmd.id));

        if (currentFiscalPeriod.isClosed)
            errors.push(translate('The current period is closed , You are not allowed to delete Journal'));

        if (journal.journalStatue == 'Fixed')
            errors.push(translate('The current journal is fixed , You are not allowed to delete it'));

        return {
            isValid: !errors.asEnumerable().any(),
            errors: errors
        };
    }),
    handle: async(function (cmd) {
        await(repository.remove(cmd.id));
    })
});

command.define('command.journal.bookkeeping', {
    validate: async(function (cmd, current) {
        var errors = [];

        var currentFiscalPeriod = await(fiscalPeriodRepository.findById(current.id));
        var journal = await(journalRepository.findById(cmd.id));

        if (currentFiscalPeriod.isClosed)
            errors.push(translate('The current period is closed , You are not allowed to edit Journal'));

        if (journal.journalStatue == 'Fixed')
            errors.push(translate('The current journal is fixed , You are not allowed to edit it'));

        return {
            isValid: !errors.asEnumerable().any(),
            errors: errors
        };
    }),
    handle: async(function (cmd) {
        var entity = await(repository.findById(cmd.id));

        entity.journalStatus = 'BookKeeped';

        await(repository.update(entity));
    })
});

command.define('command.journal.fix', {
    validate: async(function (cmd, current) {
        var errors = [];

        var currentFiscalPeriod = await(fiscalPeriodRepository.findById(current.id));
        var journal = await(journalRepository.findById(cmd.id));

        if (currentFiscalPeriod.isClosed)
            errors.push(translate('The current period is closed , You are not allowed to delete Journal'));

        if (journal.journalStatue == 'Fixed')
            errors.push(translate('This journal is already fixed'));

        return {
            isValid: !errors.asEnumerable().any(),
            errors: errors
        };
    }),
    handle: async(function (cmd) {
        var entity = await(repository.findById(cmd.id));

        entity.journalStatus = 'Fixed';

        await(repository.update(entity));
    })
});

command.define('command.journal.attachImage', {
    validate: async(function (cmd, current) {
        var errors = [];

        return {
            isValid: !errors.asEnumerable().any(),
            errors: errors
        };
    }),
    handle: async(function (cmd, current) {
        var entity = await(repository.findById(cmd.id));

        entity.attachmentFileName = cmd.fileName;

        await(repository.update(entity));
    })
});

