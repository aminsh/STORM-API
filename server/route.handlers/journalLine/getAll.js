var knexService = require('../../services/knexService');
var kendoQueryResolve = require('../../services/kendoQueryResolve');
var view = require('../../viewModel.assemblers/view.journalLine');
var async = require('asyncawait/async');
var await = require('asyncawait/await');

function getAll(req, res) {
    var query = knexService.select().from(baseJournalLines).where('journalId', req.params.journalId);

    var result = await(kendoQueryResolve(query, req.query, view));

    var aggregates = await(knexService
        .select(knexService.raw('SUM("debtor") as "sumDebtor", SUM("creditor") as "sumCreditor"'))
        .from('journalLines').where('journalId', req.params.journalId))[0];

    result.aggregates = {
        debtor: {sum: aggregates.sumDebtor},
        creditor: {sum: aggregates.sumCreditor}
    };

    res.json(result);
}

function baseJournalLines() {
    this.select(
        'journalLines.id',
        'journalLines.journalId',
        'journalLines.row',
        'journalLines.article',
        'journalLines.debtor',
        'journalLines.creditor',
        'journalLines.subsidiaryLedgerAccountId',
        knexService.raw('"generalLedgerAccounts"."code" as "generalLedgerAccountCode"'),
        knexService.raw('"generalLedgerAccounts"."code" || \' \' || "generalLedgerAccounts"."title" as "generalLedgerAccountDisplay"'),
        'journalLines.subsidiaryLedgerAccountId',
        knexService.raw('"subsidiaryLedgerAccounts"."code" as "subsidiaryLedgerAccountCode"'),
        knexService.raw('"subsidiaryLedgerAccounts".code || \' \' || "subsidiaryLedgerAccounts".title as "subsidiaryLedgerAccountDisplay"'),
        'journalLines.detailAccountId',
        knexService.raw('"detailAccounts"."code" as "detailAccountCode"'),
        knexService.raw('"detailAccounts"."code" || \' \' || "detailAccounts"."title" as "detailAccountDisplay"'),
        'journalLines.dimension1Id',
        knexService.raw('"dimension1s"."code" || \' \' || "dimension1s"."title" as "dimension1Display"'),
        'journalLines.dimension2Id',
        knexService.raw('"dimension2s"."code" || \' \' || "dimension2s"."title" as "dimension2Display"'),
        'journalLines.dimension3Id',
        knexService.raw('"dimension3s"."code" || \' \' || "dimension3s"."title" as "dimension3Display"'),
        knexService.raw('"cheques"."id" as "chequeId"'),
        knexService.raw('"cheques"."number" as "chequeNumber"'),
        knexService.raw('"cheques"."date" as "chequeDate"'),
        knexService.raw('"cheques"."description" as "chequeDescription"')
    ).from('journalLines')
        .leftJoin('generalLedgerAccounts', 'journalLines.generalLedgerAccountId', 'generalLedgerAccounts.id')
        .leftJoin('subsidiaryLedgerAccounts', 'journalLines.subsidiaryLedgerAccountId', 'subsidiaryLedgerAccounts.id')
        .leftJoin('detailAccounts', 'journalLines.detailAccountId', 'detailAccounts.id')
        .leftJoin(knexService.raw('"dimensions" as "dimension1s"'), 'journalLines.dimension1Id', 'dimension1s.id')
        .leftJoin(knexService.raw('"dimensions" as "dimension2s"'), 'journalLines.dimension2Id', 'dimension2s.id')
        .leftJoin(knexService.raw('"dimensions" as "dimension3s"'), 'journalLines.dimension3Id', 'dimension3s.id')
        .leftJoin('cheques', 'journalLines.id', 'cheques.journalLineId')
        .orderBy('journalLines.row')
        .as('baseJournalLines');
}
module.exports = getAll;