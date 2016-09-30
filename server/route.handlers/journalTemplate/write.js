var async = require('asyncawait/async');
var await = require('asyncawait/await');
var string = require('../../utilities/string');
var translate = require('../../services/translateService');
var repository = require('../../data/repository.journalTemplate');
var journalRepository = require('../../data/repository.journal');
var persianDateSerivce = require('../../services/persianDateService');

function create(req, res) {
    var journalId = req.params.journalId;
    var cmd = req.body;

    var journal = await(journalRepository.findById(journalId));

    var data = {
        description: journal.description,
        journalLines: journal.journalLines.asEnumerable().select(function (line) {
            return {
                article: line.article,
                generalLedgerAccountId: line.generalLedgerAccountId,
                subsidiaryLedgerAccountId: line.subsidiaryLedgerAccountId,
                detailAccountId: line.detailAccountId,
                dimension1Id: line.dimension1Id,
                dimension2Id: line.dimension2Id,
                dimension3Id: line.dimension3Id,
                debtor: line.debtor,
                creditor: line.creditor
            };
        }).toArray()
    };

    var entity = {
        title: cmd.title,
        data: JSON.stringify(data)
    };

    entity = await(repository.create(entity));

    res.json({
        isValid: true,
        returnValue: entity.id
    });
}

function journalCreate(req, res) {
    var id = req.params.id;
    var periodId = req.cookies['current-period'];

    var template = await(repository.findById(id));

    var newJournal = JSON.parse(template.data);

    newJournal.periodId = periodId;
    newJournal.createdById = req.user.id;
    newJournal.journalStatus = 'Temporary';
    newJournal.temporaryNumber = (await(journalRepository.maxTemporaryNumber(periodId)) || 0) + 1;
    newJournal.temporaryDate = persianDateSerivce.current();

    newJournal = await(journalRepository.create(newJournal));

    res.json({
        isValid: true,
        returnValue: {id: newJournal.id}
    });
}

function remove(req, res) {
    var id = req.params.id;

    await(repository.remove(id));

    res.json({
        isValid: true
    });
}

module.exports.create = async(create);
module.exports.remove = async(remove);
module.exports.journalCreate = async(journalCreate);
