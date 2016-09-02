var db = require('../../models');
var view = require('../../viewModel.assemblers/view.generalLedgerAccount');

function getById(req, res) {
    var id = req.params.id;

    db.generalLedgerAccount
        .findById(id)
        .then(function (gla) {
            res.json(view(gla));
        });
}

module.exports = getById;