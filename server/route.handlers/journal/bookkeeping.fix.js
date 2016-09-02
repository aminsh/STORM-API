var async = require('asyncawait/async');
var await = require('asyncawait/await');
var translate = require('../../services/translateService');
var repository = require('../../data/repository.journal');
var fiscalPeriodRepository = require('../../data/repository.fiscalPeriod');

function bookkeeping(req, res) {
    var errors = [];
    var current = req.cookies;

    var currentFiscalPeriod = await(fiscalPeriodRepository.findById(current.id));
    var entity = await(repository.findById(req.params.id));

    if (currentFiscalPeriod.isClosed)
        errors.push(translate('The current period is closed , You are not allowed to delete Journal'));

    if (entity.journalStatue == 'Fixed')
        errors.push(translate('This journal is already fixed'));

    entity.journalStatus = 'BookKeeped';

    await(repository.update(entity));

    return res.json({
        isValid: true
    });
}

function fix(req, res) {
    var errors = [];
    var current = req.cookies;

    var currentFiscalPeriod = await(fiscalPeriodRepository.findById(current.id));
    var entity = await(repository.findById(req.params.id));

    if (currentFiscalPeriod.isClosed)
        errors.push(translate('The current period is closed , You are not allowed to delete Journal'));

    if (entity.journalStatue == 'Fixed')
        errors.push(translate('This journal is already fixed'));

    var entity = await(repository.findById(cmd.id));

    entity.journalStatus = 'Fixed';

    await(repository.update(entity));

    return res.json({
        isValid: true
    });
}

module.exports.bookkeeping = async(bookkeeping);
module.exports.fix = async(fix);