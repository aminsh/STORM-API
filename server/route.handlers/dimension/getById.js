var knexService = require('../../services/knexService');
var kendoQueryResolve = require('../../services/kendoQueryResolve');
var view = require('../../viewModel.assemblers/view.dimension');

function getById(req, res) {
    knexService.select().from('dimensions').where('id', req.params.id)
        .then(function (result) {
            var entity = result[0];
            res.json(view(entity));
        });
}

module.exports = getById;