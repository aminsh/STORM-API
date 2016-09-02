var db = require('../../models');
var view = require('../../viewModel.assemblers/view.journal');

function getById(req, res) {
    db.journal.findOne({
        where: {id: req.params.id},
        include: [
            {model: db.user, as: 'createdBy'}
        ]
    }).then(function (result) {
        res.json(view(result));
    })
}

module.exports = getById;