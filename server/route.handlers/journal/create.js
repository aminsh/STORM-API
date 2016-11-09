var async = require('asyncawait/async');
var await = require('asyncawait/await');
var string = require('../../utilities/string');
var translate = require('../../services/translateService');
var repository = require('../../data/repository.journal');
var fiscalPeriodRepository = require('../../data/repository.fiscalPeriod');
var persianDateSerivce = require('../../services/persianDateService');

function create(req, res) {
    var errors = [];
    var cmd = req.body;
    var current = req.cookies;

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

    if (errors.errors.asEnumerable().any())
        return res.json({
            isValid: !errors.asEnumerable().any(),
            errors: errors
        });

    var entity = {
        periodId: current.periodId,
        createdById: current.userId,
        journalStatus: 'Temporary',
        temporaryNumber: (await(repository.maxTemporaryNumber(current.periodId)) || 0) + 1,
        temporaryDate: cmd.temporaryDate || persianDateSerivce.current(),
        description: cmd.description,
        isInComplete: false
    };

    entity = await(repository.create(entity));

    return res.json({
        isValid: true,
        returnValue: {id: entity.id}
    });
}

module.exports = async(create);