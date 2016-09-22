var knexService = require('../../services/knexService');
var kendoQueryResolve = require('../../services/kendoQueryResolve');
var view = require('../../viewModel.assemblers/view.subsidiaryLedgerAccount');

function getAll(req, res) {
    var query = knexService.select().from(function () {
        this.select(knexService.raw("*,code || ' ' || title as display")).from('subsidiaryLedgerAccounts')
            .where('generalLedgerAccountId', req.params.parentId).as('baseSubsidiaryLedgerAccounts');
    }).as('baseSubsidiaryLedgerAccounts');

    kendoQueryResolve(query, req.query, view)
        .then(function (result) {
            res.json(result);
        });
}

module.exports = getAll;