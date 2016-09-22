var knexService = require('../../services/knexService');
var kendoQueryResolve = require('../../services/kendoQueryResolve');
var view = require('../../viewModel.assemblers/view.dimension');

function getAll(req, res) {
    var query = knexService.select().from(function () {
        this.select(knexService.raw("*,code || ' ' || title as display"))
            .from('dimensions').as('baseDimensions').where('dimensionCategoryId', req.params.categoryId);
    }).as('baseDimensions');

    kendoQueryResolve(query, req.query, view)
        .then(function (result) {
            res.json(result);
        });
}

module.exports = getAll;