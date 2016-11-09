var async = require('asyncawait/async');
var await = require('asyncawait/await');
var knexService = require('../../services/knexService');
var kendoQueryResolve = require('../../services/kendoQueryResolve');
var view = require('../../viewModel.assemblers/view.journal');

function getById(req, res) {
    var result = await(knexService.select().from('journals').where('id', req.params.id))[0];

    var tagIds = await(knexService.select('tagId')
        .from('journalTags')
        .where('journalId', req.params.id))
        .asEnumerable().select(function (t) {
            return t.tagId;
        }).toArray();

    result.tagIds = tagIds;

    var entity = view(result);

    res.json(entity);
}

module.exports = async(getById);