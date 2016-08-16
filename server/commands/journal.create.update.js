var async = require('asyncawait/async');
var await = require('asyncawait/await');
var command = require('../services/command.define.js');
var translate = require('../services/translateService');
var repository = require('../data/repository.journal.js');
var fiscalPeriodRepository = require('../data/repository.fiscalPeriod');
var persianDateSerivce = require('../services/persianDateService');


command.define('command.journal.create', {
    validate: async(function (cmd, current) {
        var errors = [];

        var currentFiscalPeriod = await(fiscalPeriodRepository.findById(current.id));

        if (currentFiscalPeriod.isClosed)
            errors.push(translate('The current period is closed , You are not allowed to create Journal'));

        var checkExistsJournalByTemporaryNumber = await(repository.findByTemporaryNumber(
            cmd.temporaryNumber,
            currentFiscalPeriod.id));

        if (checkExistsJournalByTemporaryNumber)
            errors.push(translate('The journal with this TemporaryNumber already created'));

        var temporaryDateIsInPeriodRange =
            cmd.temporaryDate >= currentFiscalPeriod.minDate &&
            cmd.temporaryDate <= currentFiscalPeriod.maxDate;

        if (!temporaryDateIsInPeriodRange)
            errors.push(translate('The temporaryDate is not in current period date range'));

        return {
            isValid: !errors.asEnumerable().any(),
            errors: errors
        };
    }),
    handle: async(function (cmd, current) {
        var entity = {
            periodId: current.periodId,
            createdById: current.userId,
            journalStatus: 'Temporary',
            temporaryNumber: (await(repository.maxTemporaryNumber(current.periodId)) || 0) + 1,
            temporaryDate: cmd.temporaryDate || persianDateSerivce.current(),
            description: cmd.description
        };

        var journal = await(repository.create(entity));

        return {id: journal.id};
    })
});

command.define('command.journal.create', {
    validate: async(function (cmd, current) {
        var errors = [];

        var currentFiscalPeriod = await(fiscalPeriodRepository.findById(current.id));
        var journal = await(repository.findById(cmd.id));

        if (currentFiscalPeriod.isClosed)
            errors.push(translate('The current period is closed , You are not allowed to edit Journal'));

        var checkExistsJournalByTemporaryNumber = await(repository.findByTemporaryNumber(
            cmd.temporaryNumber,
            currentFiscalPeriod.id));

        if (checkExistsJournalByTemporaryNumber && checkExistsJournalByTemporaryNumber.id != cmd.id)
            errors.push(translate('The journal with this TemporaryNumber already created'));

        var temporaryDateIsInPeriodRange =
            cmd.temporaryDate >= currentFiscalPeriod.minDate &&
            cmd.temporaryDate <= currentFiscalPeriod.maxDate;

        if (!temporaryDateIsInPeriodRange)
            errors.push(translate('The temporaryDate is not in current period date range'));

        if (journal.journalStatue == 'Fixed')
            errors.push(translate('The current journal is fixed , You are not allowed to edit it'));

        return {
            isValid: !errors.asEnumerable().any(),
            errors: errors
        };
    }),
    handle: async(function (cmd) {
        var entity = await(repository.findById(cmd.id));

        entity.temporaryNumber = cmd.temporaryNumber || entity.temporaryNumber;
        entity.temporaryDate = cmd.temporaryDate || entity.temporaryDate;
        entity.description = cmd.description;

        await(repository.update(entity));

    })
});