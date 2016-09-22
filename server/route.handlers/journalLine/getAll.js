var knexService = require('../../services/knexService');
var kendoQueryResolve = require('../../services/kendoQueryResolve');
var view = require('../../viewModel.assemblers/view.journalLine');
var async = require('asyncawait/async');
var await = require('asyncawait/await');

function getAll(req, res) {
    var query = knexService.select().from(function () {
        var selectExp = '"journalLines".*,';
        selectExp += '"generalLedgerAccounts".code as "generalLedgerAccountCode",';
        selectExp += '"subsidiaryLedgerAccounts".code as "subsidiaryLedgerAccountCode",';
        selectExp += '"detailAccounts".code as "detailAccountCode"';

        this.select(knexService.raw(selectExp)).from('journalLines')
            .leftJoin('generalLedgerAccounts', 'journalLines.generalLedgerAccountId', 'generalLedgerAccounts.id')
            .leftJoin('subsidiaryLedgerAccounts', 'journalLines.subsidiaryLedgerAccountId', 'subsidiaryLedgerAccounts.id')
            .leftJoin('detailAccounts', 'journalLines.detailAccountId', 'detailAccounts.id')
            .as('baseJournalLines');
    }).where('journalId', req.params.journalId);

    var result = await(kendoQueryResolve(query, req.query, view));

    var aggregates = await(knexService
        .select(knexService.raw('SUM(debtor) as sumdebtor, SUM(creditor) as sumcreditor'))
        .from('journalLines').where('journalId', req.params.journalId))[0];

    result.aggregates = {
        debtor: {sum: aggregates.sumdebtor},
        creditor: {sum: aggregates.sumcreditor}
    };

    res.json(result);
}

module.exports = getAll;