var knexService = require('../../services/knexService');
var kendoQueryResolve = require('../../services/kendoQueryResolve');
var view = require('../../viewModel.assemblers/view.cheque');

function getAll(req, res) {

    var query = knexService.select().from('cheques')
        .where('chequeCategoryId', req.params.categoryId);

    kendoQueryResolve(query, req.query, view)
        .then(function (result) {
            res.json(result);
        });
}

function getWhites(req, res) {
    var query = knexService.select().from('cheques')
        .where('chequeCategoryId', req.params.categroyId)
        .andWhere('status', 'White');

    kendoQueryResolve(query, req.query, view)
        .then(function (result) {
            res.json(result);
        });
}

function getById(req, res) {
    knexService.select().from('cheques').where('id', req.params.id)
        .then(function (result) {
            var entity = result[0];
            res.json(view(entity));
        });
}

module.exports.getAll = getAll;
module.exports.getWhites = getWhites;
module.exports.getById = getById;