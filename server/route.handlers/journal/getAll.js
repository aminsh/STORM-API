var db = require('../../models');
var kendoQueryService = require('../../services/kendoQueryService');
var view = require('../../viewModel.assemblers/view.journal');

function getAll(req, res) {
    var options = kendoQueryService.getKendoRequestData(req.query);
    options.distinct = true;
    options.include = [
        {model: db.journalLine},
        {model: db.user, as: 'createdBy'}
    ];

    (options.where)
        ? options.where.periodId = req.cookies['current-period']
        : options.where = {periodId: req.cookies['current-period']};

    db.journal.findAndCountAll(options)
        .then(function (result) {
            var kendoResult = kendoQueryService.toKendoResultData(result);

            kendoResult.data = kendoResult.data.asEnumerable()
                .select(view)
                .toArray();

            res.json(kendoResult);
        });
}

module.exports = getAll;