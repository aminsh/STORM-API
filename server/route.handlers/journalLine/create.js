var async = require('asyncawait/async');
var await = require('asyncawait/await');
var string = require('../../utilities/string');
var translate = require('../../services/translateService');
var repository = require('../../data/repository.journalLine');
var journalRepository = require('../../data/repository.journal');
var fiscalPeriodRepository = require('../../data/repository.fiscalPeriod');
var persianDateSerivce = require('../../services/persianDateService');

function create(req, res) {
    var errors = [];
    var cmd = req.body;

    var errors = [];

    if (string.isNullOrEmpty(cmd.article))
        errors.push(translate('The Article is required'));

    if (cmd.article.length < 3)
        errors.push(translate('The Article should have at least 3 character'));

    if (errors.asEnumerable().any())
        return res.json({
            isValid: !errors.asEnumerable().any(),
            errors: errors
        });

    var entity = {
        journalId: cmd.journalId,
        generalLedgerAccountId: cmd.generalLedgerAccountId,
        subsidiaryLedgerAccountId: cmd.subsidiaryLedgerAccountId,
        detailAccountId: cmd.detailAccountId,
        dimension1Id: cmd.dimension1Id,
        dimension2Id: cmd.dimension2Id,
        dimension3Id: cmd.dimension3Id,
        description: cmd.description,
        debtor: cmd.balanceType == 'debtor' ? cmd.amount : 0,
        creditor: cmd.balanceType == 'creditor' ? cmd.amount : 0
    };

    entity = await(repository.create(entity));
    await(journalRepository.checkIsComplete(cmd.journalId));

    return res.json({
        isValid: true,
        returnValue: {id: entity.id}
    });
}

module.exports = async(create);