var async = require('asyncawait/async');
var await = require('asyncawait/await');
var string = require('../../utilities/string');
var translate = require('../../services/translateService');
var repository = require('../../data/repository.journal');
var fiscalPeriodRepository = require('../../data/repository.fiscalPeriod');


function update(req, res) {
    var errors = [];
    var cmd = req.body;
    var current = req.cookies;

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


    if (errors.asEnumerable().any())
        return res.json({
            isValid: false,
            errors: errors
        });

    var entity = await(repository.findById(cmd.id));

    await(repository.update(entity));

    return res.json({
        isValid: true
    });
}
module.exports = async(update);