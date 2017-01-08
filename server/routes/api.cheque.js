/*var express = require('express');
var router = express.Router();
var chequeRouteHandler = require('../route.handlers/cheque');

router.route('/cheques/category/:categoryId')
    .get(chequeRouteHandler.getAll);

router.route('/cheques/category/:categoryId/whites').get(chequeRouteHandler.getWhites);
router.route('/cheques/used').get(chequeRouteHandler.getUseds);

router.route('/cheques/:id').get(chequeRouteHandler.getById);
router.route('/cheques/:id/write').put(chequeRouteHandler.write);

module.exports = router;*/

var router = require('../services/routeService').Router();

router.route({
    method: 'GET',
    path: '/cheques/category/:categoryId',
    handler: (req, res, knexService, kendoQueryResolve)=> {
        var query = knexService.select().from(function () {
            this.select().from('cheques')
                .where('chequeCategoryId', req.params.categoryId)
                .orderBy('number')
                .as('baseCheques');
        }).as('baseCheques');

        kendoQueryResolve(query, req.query, view)
            .then(function (result) {
                res.json(result);
            });
    }
});

router.route({
    method: 'GET',
    path: '/cheques/category/:categoryId/whites',
    handler: (req, res, knexService, kendoQueryResolve)=> {
        var query = knexService.select('*').from('cheques')
            .where('chequeCategoryId', req.params.categoryId)
            .andWhere('status', 'White');

        kendoQueryResolve(query, req.query, view)
            .then(function (result) {
                res.json(result);
            });
    }
});

router.route({
    method: 'GET',
    path: '/cheques/used',
    handler: (req, res, knexService,kendoQueryResolve)=> {
        var query = knexService.select('*').from('cheques')
            .andWhere('status', 'Used');

        kendoQueryResolve(query, req.query, view)
            .then(function (result) {
                res.json(result);
            });
    }
});

router.route({
    method: 'GET',
    path: '/cheques/:id',
    handler: (req, res, knexService)=> {
        knexService.select().from('cheques').where('id', req.params.id)
            .then(function (result) {
                var entity = result[0];
                res.json(view(entity));
            });
    }
});

router.route({
    method: 'PUT',
    path: '/cheques/:id/write',
    handler: (req, res , chequeRepository)=> {
        var errors = [];
        var cmd = req.body;

        if (errors.asEnumerable().any())
            return res.json({
                isValid: !errors.asEnumerable().any(),
                errors: errors
            });

        var entity = await(chequeRepository.findById(req.params.id));

        entity.date = cmd.date;
        entity.amount = cmd.amount;
        entity.description = cmd.description;
        entity.status = 'Used';
        entity.journalLineId = cmd.journalLineId;

        await(chequeRepository.update(entity));

        return res.json({
            isValid: true
        });
    }
});

module.exports = router.routes;