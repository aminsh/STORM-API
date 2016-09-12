var async = require('asyncawait/async');
var await = require('asyncawait/await');
var string = require('../../utilities/string');
var translate = require('../../services/translateService');
var repository = require('../../data/repository.journalLine');
var fiscalPeriodRepository = require('../../data/repository.fiscalPeriod');


function update(req, res) {
    var errors = [];
    var cmd = req.body;

    if (string.isNullOrEmpty(cmd.article))
        errors.push(translate('The Article is required'));

    if (cmd.article.length < 3)
        errors.push(translate('The Article should have at least 3 character'));

    if (errors.asEnumerable().any())
        return res.json({
            isValid: false,
            errors: errors
        });

    var entity = await(repository.findById(cmd.id));

    entity.subsidiaryLedgerAccountId = cmd.subsidiaryLedgerAccountId;
    entity.detailAccountId = cmd.detailAccountId;
    entity.dimension1Id = cmd.dimension1Id;
    entity.dimension2Id = cmd.dimension2Id;
    entity.dimension3Id = cmd.dimension3Id;
    entity.article = cmd.article;
    entity.debtor = cmd.balanceType == 'debtor' ? cmd.amount : 0;
    entity.creditor = cmd.balanceType == 'creditor' ? cmd.amount : 0;

    await(repository.update(entity));

    return res.json({
        isValid: true
    });
}
module.exports = async(update);