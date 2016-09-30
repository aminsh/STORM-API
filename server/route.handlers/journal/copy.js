var async = require('asyncawait/async');
var await = require('asyncawait/await');
var string = require('../../utilities/string');
var translate = require('../../services/translateService');
var repository = require('../../data/repository.journal');
var fiscalPeriodRepository = require('../../data/repository.fiscalPeriod');
var persianDateSerivce = require('../../services/persianDateService');

function copy(req, res) {
    var id = req.params.id;
    var periodId = req.cookies['current-period'];

    var journal = await(repository.findById(id));

    var newJournalLines = journal.journalLines.asEnumerable()
        .select(function (line) {
            return {
                generalLedgerAccountId: line.generalLedgerAccountId,
                subsidiaryLedgerAccountId: line.subsidiaryLedgerAccountId,
                detailAccountId: line.detailAccountId,
                dimension1Id: line.dimension1Id,
                dimension2Id: line.dimension2Id,
                dimension3Id: line.dimension3Id,
                article: line.article,
                debtor: line.debtor,
                creditor: line.creditor
            }
        })
        .toArray()

    var entity = {
        periodId: periodId,
        createdById: req.user.id,
        journalStatus: 'Temporary',
        temporaryNumber: (await(repository.maxTemporaryNumber(periodId)) || 0) + 1,
        temporaryDate: persianDateSerivce.current(),
        description: journal.description,
        journalLines: newJournalLines
    };

    entity = await(repository.create(entity));

    return res.json({
        isValid: true,
        returnValue: {id: entity.id}
    });
}

module.exports.copy = async(copy);
