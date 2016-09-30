var db = require('../../models');
var view = require('../../viewModel.assemblers/view.dimensionCategory');

function getById(req, res) {
    var id = req.params.id;

    db.dimensionCategory
        .findById(id)
        .then(function (result) {
            res.json(view(result));
        });
}

module.exports = getById;
