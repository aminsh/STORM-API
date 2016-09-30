var knexService = require('../../services/knexService');
var kendoQueryResolve = require('../../services/kendoQueryResolve');
var view = require('../../viewModel.assemblers/view.chequeCategory');
var translateService = require('../../services/translateService');

function getAll(req, res) {

    var query = knexService.select().from(function () {
        var selectExp = '"chequeCategories".*, "detailAccounts".code || \' \' || "detailAccounts".title as "detailAccount","banks".title as "bank"';

        this.select(knexService.raw(selectExp)).from('chequeCategories')
            .leftJoin('detailAccounts', 'chequeCategories.detailAccountId', 'detailAccounts.id')
            .leftJoin('banks', 'chequeCategories.bankId', 'banks.id')
            .as('baseChequeCategories');
    });

    kendoQueryResolve(query, req.query, view)
        .then(function (result) {
            res.json(result);
        });
}

function getOpens(req, res) {

    var selectExp = ' "id","totalPages", "firstPageNumber", "lastPageNumber", ';
    selectExp += '(SELECT "count"(*) from cheques where "chequeCategoryId" = "baseChequeCategories".id ' +
        'AND "status"=\'White\') as "totalWhiteCheques"';

    knexService.select(knexService.raw(selectExp))
        .from(knexService.raw('"chequeCategories" as "baseChequeCategories"'))
        .where('isClosed', false)
        .andWhere('detailAccountId', req.params.detailAccountId)
        .as("baseChequeCategories")
        .then(function (result) {
            res.json(result);
        });
}

function getById(req, res) {
    knexService.select().from('chequeCategories').where('id', req.params.id)
        .then(function (result) {
            var entity = result[0];
            res.json(view(entity));
        });
}

module.exports.getAll = getAll;
module.exports.getOpens = getOpens;
module.exports.getById = getById;