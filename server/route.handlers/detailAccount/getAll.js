var view = require('../../viewModel.assemblers/view.detailAccount');
var knexService = require('../../services/knexService');
var kendoQueryResolve = require('../../services/kendoQueryResolve');

function getAll(req, res) {
    var query = knexService.select().from(function () {
        this.select(knexService.raw("*,code || ' ' || title as display"))
            .from('detailAccounts').as('baseDetailAccounts');
    }).as('baseDetailAccounts');

    kendoQueryResolve(query, req.query, view)
        .then(function (result) {
            res.json(result)
        });
}

module.exports = getAll;