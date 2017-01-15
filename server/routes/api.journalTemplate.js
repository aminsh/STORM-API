
var router = require('../services/routeService').Router(),
    persianDateService = require('../services/persianDateService');

router.route({
    method: 'GET',
    path: '/journal-templates',
    handler: (req, res, knex, kendoQueryResolve)=> {
        var query = knex.select().from('journalTemplates');

        var viewAssembler = function (e) {
            return {
                id: e.id,
                title: e.title
            };
        };

        kendoQueryResolve(query, req.query, viewAssembler)
            .then(function (result) {
                res.json(result);
            });
    }
});

router.route({
    method: 'POST',
    path: '/journal-templates/journal/:journalId',
    handler: (req, res, journalRepository, journalTemplateRepository)=> {
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

        entity = await(journalTemplateRepository.create(entity));

        res.json({
            isValid: true,
            returnValue: entity.id
        });
    }
});

router.route({
    method: 'POST',
    path: '/journal-templates/:id/journal/create',
    handler: (req, res, journalRepository, journalTemplateRepository)=> {
        var id = req.params.id;
        var periodId = req.cookies['current-period'];

        var template = await(journalTemplateRepository.findById(id));

        var newJournal = JSON.parse(template.data);

        newJournal.periodId = periodId;
        newJournal.createdById = req.user.id;
        newJournal.journalStatus = 'Temporary';
        newJournal.temporaryNumber = (await(journalRepository.maxTemporaryNumber(periodId)) || 0) + 1;
        newJournal.temporaryDate = persianDateService.current();

        newJournal = await(journalRepository.create(newJournal));

        res.json({
            isValid: true,
            returnValue: {id: newJournal.id}
        });
    }
});

router.route({
    method: 'DELETE',
    path: '/journal-templates/:id',
    handler: (req, res, journalTemplateRepository)=> {
        var id = req.params.id;

        await(journalTemplateRepository.remove(id));

        res.json({
            isValid: true
        });
    }
});

module.exports = router.routes;
