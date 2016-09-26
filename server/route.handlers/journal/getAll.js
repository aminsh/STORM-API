var knexService = require('../../services/knexService');
var kendoQueryResolve = require('../../services/kendoQueryResolve');
var view = require('../../viewModel.assemblers/view.journal');

function getAll(req, res) {
    var currentFiscalPeriod = req.cookies['current-period'];
    var query = knexService.select().from(function () {
        var selectExp = 'journals.*, SUM(debtor) as "sumDebtor", SUM(creditor) as "sumCreditor"'
        this.select(knexService.raw(selectExp)).from('journals')
            .leftJoin('journalLines', 'journals.id', 'journalLines.journalId')
            .where('periodId', currentFiscalPeriod)
            .groupBy('journals.id')
            .as('baseJournals');
    }).as('baseJournals');

    kendoQueryResolve(query, req.query, view)
        .then(function (result) {
            res.json(result);
        });
}

module.exports = getAll;