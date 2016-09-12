var db = require('../../models');
var kendoQueryService = require('../../services/kendoQueryService');
var view = require('../../viewModel.assemblers/view.journalLine');

function getAll(req, res) {
    var options = kendoQueryService.getKendoRequestData(req.query);
    options.distinct = true;
    options.include = [
        {model: db.generalLedgerAccount},
        {model: db.subsidiaryLedgerAccount},
        {model: db.detailAccount},
        {model: db.dimension, as: 'dimension1'},
        {model: db.dimension, as: 'dimension2'},
        {model: db.dimension, as: 'dimension3'}
    ];

    options.where ?
        options.where.journalId = req.params.journalId :
        options.where = {journalId: req.params.journalId};

    db.journalLine.findAndCountAll(options)
        .then(function (result) {
            var kendoResult = kendoQueryService.toKendoResultData(result);
            kendoResult.data = kendoResult.data.asEnumerable()
                .select(view)
                .toArray();

            kendoResult.aggregates = {
                debtor: {
                    sum: kendoResult.data.asEnumerable().sum(function (line) {
                        return line.debtor;
                    })
                },
                creditor: {
                    sum: kendoResult.data.asEnumerable().sum(function (line) {
                        return line.creditor;
                    })
                }
            };

            res.json(kendoResult);
        });
}

module.exports = getAll;