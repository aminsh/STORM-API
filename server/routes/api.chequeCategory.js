/*var express = require('express');
var router = express.Router();
var chequeCategoryRouteHandler = require('../route.handlers/chequeCategory');

router.route('/cheque-categories')
    .get(chequeCategoryRouteHandler.getAll)
    .post(chequeCategoryRouteHandler.create);

router.route('/cheque-categories/detail-account/:detailAccountId/opens')
    .get(chequeCategoryRouteHandler.getOpens);

router.route('/cheque-categories/:id')
    .get(chequeCategoryRouteHandler.getById)
    .put(chequeCategoryRouteHandler.update)
    .delete(chequeCategoryRouteHandler.remove);

module.exports = router;*/

var router = require('../services/routeService').Router();

router.route({
    method: 'GET',
    path: '/cheque-categories',
    handler: (req, res, knexService, kendoQueryResolve)=> {
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
});

router.route({
    method: 'POST',
    path: '',
    handler: (req, res, chequeCategoryRepository)=> {
        var errors = [];
        var cmd = req.body;

        if (errors.asEnumerable().any())
            return res.json({
                isValid: !errors.asEnumerable().any(),
                errors: errors
            });

        var cheques = [];
        var lastPageNumber = cmd.firstPageNumber + cmd.totalPages - 1;

        for (var i = cmd.firstPageNumber; i <= lastPageNumber; i++)
            cheques.push({
                number: i,
                status: 'White'
            });

        var entity = {
            bankId: cmd.bankId,
            detailAccountId: cmd.detailAccountId,
            totalPages: cmd.totalPages,
            firstPageNumber: cmd.firstPageNumber,
            lastPageNumber: lastPageNumber,
            isClosed: false,
            cheques: cheques
        };

        entity = await(chequeCategoryRepository.create(entity, cheques));

        return res.json({
            isValid: true,
            returnValue: {id: entity.id}
        });
    }
});

router.route({
    method: 'GET',
    path: '/cheque-categories/detail-account/:detailAccountId/opens',
    handler: (req, res, knexService)=> {
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
});

router.route({
    method: 'GET',
    path: '/cheque-categories/:id',
    handler: (req, res, knexService)=> {
        knexService.select().from('chequeCategories').where('id', req.params.id)
            .then(function (result) {
                var entity = result[0];
                res.json(view(entity));
            });
    }
});

router.route({
    method: 'PUT',
    path: '/cheque-categories/:id',
    handler: (req, res, chequeCategoryRepository)=> {
        var errors = [];
        var cmd = req.body;

        if (errors.errors.asEnumerable().any())
            return res.json({
                isValid: !errors.asEnumerable().any(),
                errors: errors
            });

        var entity = await(chequeCategoryRepository.findById(req.params.id));

        entity.bankId = cmd.bankId;
        entity.detailAccountId = cmd.detailAccountId;

        await(chequeCategoryRepository.update(entity));

        res.json({
            isValid: true
        });
    }
});

router.route({
    method: 'DELETE',
    path: '/cheque-categories/:id',
    handler: (req, res, chequeCategoryRepository)=> {
        var errors = [];

        if (errors.errors.asEnumerable().any())
            return res.json({
                isValid: !errors.asEnumerable().any(),
                errors: errors
            });

        await(chequeCategoryRepository.remove(req.params.id));

        res.json({
            isValid: true
        });
    }
});

module.exports = router.routes;

