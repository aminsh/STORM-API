var knexService = require('../../services/knexService');
var kendoQueryResolve = require('../../services/kendoQueryResolve');
var view = require('../../viewModel.assemblers/view.fiscalPeriod');
var translateService = require('../../services/translateService');

function getAll(req, res) {
    var query = knexService.select().from(function () {
        this.select(knexService.raw('*,\'{0} \' || "minDate" || \' {1} \' || "maxDate" as "display"'
            .format(translateService('From'), translateService('To'))))
            .from('fiscalPeriods')
            .as('baseFiscalPeriod');
    });

    kendoQueryResolve(query, req.query, view)
        .then(function (result) {
            res.json(result);
        });
}

module.exports.getAll = getAll;
