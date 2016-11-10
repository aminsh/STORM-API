var knexService = require('../../services/knexService');
var kendoQueryResolve = require('../../services/kendoQueryResolve');
var view = require('../../viewModel.assemblers/view.subsidiaryLedgerAccount');

function getAll(req, res) {
    var query = knexService.select().from(function () {
        var selectExp = '"subsidiaryLedgerAccounts".*,' +
            '"subsidiaryLedgerAccounts".code || \' \' || "subsidiaryLedgerAccounts".title as "display",' +
            '"generalLedgerAccounts".code || \'-\' || "subsidiaryLedgerAccounts".code || \' \' || "subsidiaryLedgerAccounts".title as "account"'
        this.select(knexService.raw(selectExp))
            .from('subsidiaryLedgerAccounts')
            .leftJoin('generalLedgerAccounts', 'generalLedgerAccounts.id', 'subsidiaryLedgerAccounts.generalLedgerAccountId')
            .as('baseSubsidiaryLedgerAccounts');
    }).as('baseSubsidiaryLedgerAccounts');

    kendoQueryResolve(query, req.query, view)
        .then(function (result) {
            res.json(result);
        });
}

function getAllByGeneralLedgerAccount(req, res) {
    var query = knexService.select().from(function () {
        var selectExp = '"subsidiaryLedgerAccounts".*,' +
            '"subsidiaryLedgerAccounts".code || \' \' || "subsidiaryLedgerAccounts".title as "display"'
        this.select(knexService.raw(selectExp))
            .from('subsidiaryLedgerAccounts')
            .leftJoin('generalLedgerAccounts', 'generalLedgerAccounts.id', 'subsidiaryLedgerAccounts.generalLedgerAccountId')
            .where('generalLedgerAccountId', req.params.parentId)
            .as('baseSubsidiaryLedgerAccounts');
    }).as('baseSubsidiaryLedgerAccounts');

    kendoQueryResolve(query, req.query, view)
        .then(function (result) {
            res.json(result);
        });
}

module.exports.getAllByGeneralLedgerAccount = getAllByGeneralLedgerAccount;
module.exports.getAll = getAll;