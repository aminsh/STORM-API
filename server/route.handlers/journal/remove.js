var async = require('asyncawait/async');
var await = require('asyncawait/await');
var repository = require('../../data/repository.journal');
var translate = require('../../services/translateService');
var fiscalPeriodRepository = require('../../data/repository.fiscalPeriod');

function remove(req, res) {
    var errors = [];
    var cmd = req.body;
    var current = req.cookies;

    var currentFiscalPeriod = await(fiscalPeriodRepository.findById(current.id));
    var journal = await(repository.findById(cmd.id));

    if (currentFiscalPeriod.isClosed)
        errors.push(translate('The current period is closed , You are not allowed to delete Journal'));

    if (journal.journalStatue == 'Fixed')
        errors.push(translate('The current journal is fixed , You are not allowed to delete it'));

    //check for journal line

    if (errors.asEnumerable().any())
        return res.json({
            isValid: !errors.asEnumerable().any(),
            errors: errors
        });

    await(repository.remove(req.params.id));

    return res.json({
        isValid: true
    });
}

module.exports = async(remove);