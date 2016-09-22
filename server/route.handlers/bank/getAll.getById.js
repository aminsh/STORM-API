var knexService = require('../../services/knexService');
var kendoQueryResolve = require('../../services/kendoQueryResolve');

function getAll(req, res) {

    var query = knexService.select().from('banks');

    var view = function (entity) {
        return {
            id: entity.id,
            title: entity.title
        };
    };

    kendoQueryResolve(query, req.query, view)
        .then(function (result) {
            res.json(result)
        });
}

function getById(req, res) {
    knexService.select().from('banks').where('id', req.params.id)
        .then(function (result) {
            var entity = result[0];
            res.json({
                id: entity.id,
                title: entity.title
            });
        });
}

module.exports.getAll = getAll;
module.exports.getById = getById;