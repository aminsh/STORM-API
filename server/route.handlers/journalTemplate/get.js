var knexService = require('../../services/knexService');
var kendoQueryResolve = require('../../services/kendoQueryResolve');

function getAll(req, res) {
    var query = knexService.select().from('journalTemplates');

    var viewAssembler = function (e) {
        return {
            id: e.id,
            title: e.title
        };
    }

    kendoQueryResolve(query, req.query, viewAssembler)
        .then(function (result) {
            res.json(result);
        });
}

module.exports.getAll = getAll;
