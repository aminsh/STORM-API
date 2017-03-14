var knexService = require('../../services/knexService');
var kendoQueryResolve = require('../../services/kendoQueryResolve');

function getAll(req, res) {
    var query = knexService.select().from('tags');

    var view = function (t) {
        return {
            id: t.id,
            title: t.title
        };
    };

    kendoQueryResolve(query, req.query, view)
        .then(function (result) {
            res.json(result);
        });
}

module.exports.getAll = getAll;
