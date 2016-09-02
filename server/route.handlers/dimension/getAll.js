var db = require('../../models');
var kendoQueryService = require('../../services/kendoQueryService');
var view = require('../../viewModel.assemblers/view.dimension');

function getAll(req, res) {
    var kendoRequest = kendoQueryService.getKendoRequestData(req.query);

    (kendoRequest.where)
        ? kendoRequest.where.dimensionCategoryId = req.params.categoryId
        : kendoRequest.where = {dimensionCategoryId: req.params.categoryId};

    db.dimension.findAll(kendoRequest)
        .then(function (result) {
            res.json(view(result));
        });
}

module.exports = getAll;