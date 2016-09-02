var db = require('../../models');
var kendoQueryService = require('../../services/kendoQueryService');
var view = require('../../viewModel.assemblers/view.dimensionCategory');

function getAll(req, res) {
    var kendoRequest = kendoQueryService.getKendoRequestData(req.query);

    db.dimensionCategory
        .findAndCountAll(kendoRequest)
        .then(function (result) {
            var kendoResult = kendoQueryService.toKendoResultData(result);

            kendoResult.data = kendoResult.data.asEnumerable()
                .select(view)
                .toArray();

            res.json(kendoResult);
        });
}

module.exports = getAll;
