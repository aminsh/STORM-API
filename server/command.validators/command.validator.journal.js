var translate = require('../services/translateService');
var async = require('asyncawait/async');
var await = require('asyncawait/await');
var fiscalPeriodRepository = require('../data/fiscalPeriodRepository');
var journalRepository = require('../data/journalsRepository');

var onCreate = async(function (cmd, current) {
    var errors = [];

    var currentFiscalPeriod = await(fiscalPeriodRepository.findById(current.id));

    if (currentFiscalPeriod.isClosed)
        errors.push(translate('The current period is closed , You are not allowed to create Journal'));

    var checkExistsJournalByTemporaryNumber = await(journalRepository.findByTemporaryNumber(
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
});

var onUpdate = async(function (cmd, current) {
    var errors = [];

    var currentFiscalPeriod = await(fiscalPeriodRepository.findById(current.id));
    var journal = await(journalRepository.findById(cmd.id));

    if (currentFiscalPeriod.isClosed)
        errors.push(translate('The current period is closed , You are not allowed to edit Journal'));

    var checkExistsJournalByTemporaryNumber = await(journalRepository.findByTemporaryNumber(
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
});

var onDelete = async(function (cmd, current) {
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
});

var onBookkeeping = async(function (cmd, current) {
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
});

var onFixing = async(function (cmd, current) {
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
});

module.exports = {
    onCreate: onCreate,
    onUpdate: onUpdate,
    onDelete: onDelete,
    onBookkeeping: onBookkeeping,
    onFixing: onFixing
};
