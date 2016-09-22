var knexService = require('../../services/knexService');
var kendoQueryResolve = require('../../services/kendoQueryResolve');
var view = require('../../viewModel.assemblers/view.journalLine');

function getById(req, res) {
    knexService.select().from('journalLines').where('id', req.params.id)
        .then(function (result) {
            var entity = result[0];
            res.json(view(entity));
        });
}

module.exports = getById;