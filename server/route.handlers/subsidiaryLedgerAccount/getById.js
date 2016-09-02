var db = require('../../models');
var view = require('../../viewModel.assemblers/view.subsidiaryLedgerAccount');

function getById(req, res) {
    var id = req.params.id;

    db.subsidiaryLedgerAccount.findById(id)
        .then(function (result) {
            res.json(view(result));
        });
}

module.exports = getById;
