
var router = require('../services/routeService').Router(),
    view = require('../viewModel.assemblers/view.journalLine');

router.route({
    method: 'GET',
    path: '/journal-lines/journal/:journalId',
    handler: (req, res, knex, kendoQueryResolve)=> {
        var query = knex.select().from(function () {
            baseJournalLines.apply(this, knex);
        }).where('journalId', req.params.journalId);

        var result = await(kendoQueryResolve(query, req.query, view));

        var aggregates = await(knex
            .select(knex.raw('SUM("debtor") as "sumDebtor", SUM("creditor") as "sumCreditor"'))
            .from('journalLines').where('journalId', req.params.journalId))[0];

        result.aggregates = {
            debtor: {sum: aggregates.sumDebtor},
            creditor: {sum: aggregates.sumCreditor}
        };

        res.json(result);
    }
});

router.route({
    method: 'GET',
    path: '/journal-lines/:id',
    handler: (req, res, knex)=> {
        knex.select().from('journalLines').where('id', req.params.id)
            .then(function (result) {
                var entity = result[0];
                res.json(view(entity));
            });
    }
});

router.route({
    method: 'POST',
    path: '/journal-lines/journal/:journalId',
    handler: (req, res, journalLineRepository)=> {
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

        entity = await(journalLineRepository.create(entity));
        await(journalLineRepository.checkIsComplete(cmd.journalId));

        return res.json({
            isValid: true,
            returnValue: {id: entity.id}
        });
    }
});

router.route({
    method: 'PUT',
    path: '/journal-lines/:id',
    handler: (req, res, journalLineRepository)=> {
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

        var entity = await(journalLineRepository.findById(cmd.id));

        entity.subsidiaryLedgerAccountId = cmd.subsidiaryLedgerAccountId;
        entity.detailAccountId = cmd.detailAccountId;
        entity.dimension1Id = cmd.dimension1Id;
        entity.dimension2Id = cmd.dimension2Id;
        entity.dimension3Id = cmd.dimension3Id;
        entity.article = cmd.article;
        entity.debtor = cmd.balanceType == 'debtor' ? cmd.amount : 0;
        entity.creditor = cmd.balanceType == 'creditor' ? cmd.amount : 0;

        await(journalLineRepository.update(entity));

        return res.json({
            isValid: true
        });
    }
});

router.route({
    method: 'DELETE',
    path: '/journal-lines/:id',
    handler: (req, res, journalRepository, journalLineRepository)=> {
        var errors = [];
        var cmd = req.body;

        if (errors.asEnumerable().any())
            return res.json({
                isValid: !errors.asEnumerable().any(),
                errors: errors
            });

        await(journalLineRepository.remove(req.params.id));
        await(journalRepository.checkIsComplete(cmd.journalId));

        return res.json({
            isValid: true
        });
    }
});

module.exports = router.routes;

function baseJournalLines(knex) {
    this.select(
        'journalLines.id',
        'journalLines.journalId',
        'journalLines.row',
        'journalLines.article',
        'journalLines.debtor',
        'journalLines.creditor',
        'journalLines.generalLedgerAccountId',
        'journalLines.subsidiaryLedgerAccountId',
        knex.raw('"generalLedgerAccounts"."code" as "generalLedgerAccountCode"'),
        knex.raw('"generalLedgerAccounts"."code" || \' \' || "generalLedgerAccounts"."title" as "generalLedgerAccountDisplay"'),
        'journalLines.subsidiaryLedgerAccountId',
        knex.raw('"subsidiaryLedgerAccounts"."code" as "subsidiaryLedgerAccountCode"'),
        knex.raw('"subsidiaryLedgerAccounts".code || \' \' || "subsidiaryLedgerAccounts".title as "subsidiaryLedgerAccountDisplay"'),
        'journalLines.detailAccountId',
        knex.raw('"detailAccounts"."code" as "detailAccountCode"'),
        knex.raw('"detailAccounts"."code" || \' \' || "detailAccounts"."title" as "detailAccountDisplay"'),
        'journalLines.dimension1Id',
        knex.raw('"dimension1s"."code" || \' \' || "dimension1s"."title" as "dimension1Display"'),
        'journalLines.dimension2Id',
        knex.raw('"dimension2s"."code" || \' \' || "dimension2s"."title" as "dimension2Display"'),
        'journalLines.dimension3Id',
        knex.raw('"dimension3s"."code" || \' \' || "dimension3s"."title" as "dimension3Display"'),
        knex.raw('"cheques"."id" as "chequeId"'),
        knex.raw('"cheques"."number" as "chequeNumber"'),
        knex.raw('"cheques"."date" as "chequeDate"'),
        knex.raw('"cheques"."description" as "chequeDescription"')
    ).from('journalLines')
        .leftJoin('generalLedgerAccounts', 'journalLines.generalLedgerAccountId', 'generalLedgerAccounts.id')
        .leftJoin('subsidiaryLedgerAccounts', 'journalLines.subsidiaryLedgerAccountId', 'subsidiaryLedgerAccounts.id')
        .leftJoin('detailAccounts', 'journalLines.detailAccountId', 'detailAccounts.id')
        .leftJoin(knex.raw('"dimensions" as "dimension1s"'), 'journalLines.dimension1Id', 'dimension1s.id')
        .leftJoin(knex.raw('"dimensions" as "dimension2s"'), 'journalLines.dimension2Id', 'dimension2s.id')
        .leftJoin(knex.raw('"dimensions" as "dimension3s"'), 'journalLines.dimension3Id', 'dimension3s.id')
        .leftJoin('cheques', 'journalLines.id', 'cheques.journalLineId')
        .orderBy('journalLines.row')
        .as('baseJournalLines');
}