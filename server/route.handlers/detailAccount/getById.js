var knexService = require('../../services/knexService');
var kendoQueryResolve = require('../../services/kendoQueryResolve');
var view = require('../../viewModel.assemblers/view.detailAccount');

function getById(req, res) {
    knexService.select().from('detailAccounts')
        .where('id', req.params.id)
        .then(function (result) {
            res.json(view(result[0]));
        });
}

module.exports = getById;