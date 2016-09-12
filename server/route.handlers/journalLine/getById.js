var db = require('../../models');
var view = require('../../viewModel.assemblers/view.journalLine');

function getById(req, res) {
    var option = {
        where: {id: req.params.id},
        include: [
            {model: db.generalLedgerAccount},
            {model: db.subsidiaryLedgerAccount},
            {model: db.detailAccount},
            {model: db.dimension, as: 'dimension1'},
            {model: db.dimension, as: 'dimension2'},
            {model: db.dimension, as: 'dimension3'}
        ]
    };

    db.journalLine.findOne(option).then(function (result) {
        res.json(view(result));
    });
}

module.exports = getById;