var db = require('../../models');
var kendoQueryService = require('../../services/kendoQueryService');
var view = require('../../viewModel.assemblers/view.dimension');

function getAll(req, res) {
    var kendoRequest = kendoQueryService.getKendoRequestData(req.query);

    (kendoRequest.where)
        ? kendoRequest.where.dimensionCategoryId = req.params.categoryId
        : kendoRequest.where = {dimensionCategoryId: req.params.categoryId};

    db.dimension.findAndCountAll(kendoRequest)
        .then(function (result) {
            var kendoResult = kendoQueryService.toKendoResultData(result);

            kendoResult.data = kendoResult.data.asEnumerable()
                .select(view)
                .toArray();

            res.json(kendoResult);
        });
}

module.exports = getAll;