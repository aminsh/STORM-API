var db = require('../../models');
var view = require('../../viewModel.assemblers/view.detailAccount');

function getById(req, res) {
    var id = req.params.id;

    db.detailAccount.findById(id)
        .then(function (gla) {
            res.json(view(gla));
        });
}

module.exports = getById;