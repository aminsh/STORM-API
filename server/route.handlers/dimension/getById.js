var db = require('../../models');
var view = require('../../viewModel.assemblers/view.dimension');

function getById(req, res) {
    db.dimension.findById(req.params.id)
        .then(function (result) {
            res.json(view(result));
        });
}

module.exports = getById;