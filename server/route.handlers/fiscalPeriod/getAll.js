var knexService = require('../../services/knexService');
var kendoQueryResolve = require('../../services/kendoQueryResolve');
var view = require('../../viewModel.assemblers/view.fiscalPeriod');

function getAll(req, res) {
    var query = knexService.select().from(function () {
        this.select(knexService.raw("minDate || ' ' || maxDate as display")).from('fiscalPeriods');
    });

    kendoQueryResolve(query, req.query, view)
        .then(function (result) {
            res.json(result);
        });
}

module.exports = getAll;
