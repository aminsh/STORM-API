var knexService = require('../../services/knexService');
var kendoQueryResolve = require('../../services/kendoQueryResolve');
var view = require('../../viewModel.assemblers/view.generalLedgerAccount');

function getAll(req, res) {
    var query = knexService.select().from(function () {
        this.select(knexService.raw("*,code || ' ' || title as display"))
            .from('generalLedgerAccounts').as('baseGeneralLedgerAccounts');
    }).as('baseGeneralLedgerAccounts');

    kendoQueryResolve(query, req.query, view)
        .then(function (result) {
            res.json(result);
        });
}

module.exports = getAll;
