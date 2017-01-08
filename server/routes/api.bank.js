/*
var express = require('express');
var router = express.Router();
var bankRouteHandler = require('../route.handlers/bank');
var routeHandler = require('../utilities/routeHandler');

router.route('/banks')
    .get((req, res)=> routeHandler(req, bankRouteHandler.getAll))
    .post(bankRouteHandler.create);

router.route('/banks/:id')
    .get((req, res)=> routeHandler(req, bankRouteHandler.getById))
    .put(bankRouteHandler.update)
    .delete(bankRouteHandler.remove);

module.exports = router;
*/

var router = require('../services/routeService').Router();

router.route({
    method: 'GET',
    path: '/banks',
    handler: (req, res, knexService, kendoQueryResolve)=> {
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
});

router.route({
    method: 'POST',
    path: '/banks',
    handler: (req, res, bankRepository)=> {
        var errors = [];
        var cmd = req.body;
        var repository = bankRepository;

        if (string.isNullOrEmpty(cmd.title))
            errors.push(translate('The title is required'));
        else {
            if (cmd.title.length < 3)
                errors.push(translate('The title should have at least 3 character'));
        }

        if (errors.asEnumerable().any())
            return res.json({
                isValid: !errors.asEnumerable().any(),
                errors: errors
            });

        var entity = {
            title: cmd.title
        };

        var entity = await(repository.create(entity));

        return res.json({
            isValid: true,
            returnValue: {id: entity.id}
        });
    }
});

router.route({
    method: 'GET',
    path: '/banks/:id',
    handler: (req, res, knexService)=> {
        knexService.select().from('banks').where('id', req.params.id)
            .then(function (result) {
                var entity = result[0];
                res.json({
                    id: entity.id,
                    title: entity.title
                });
            });
    }
});

router.route({
    method: 'PUT',
    path: '/banks/:id',
    handler: (req, res, bankRepository)=> {
        var errors = [];
        var cmd = req.body;

        if (string.isNullOrEmpty(cmd.title))
            errors.push(translate('The title is required'));
        else {
            if (cmd.title.length < 3)
                errors.push(translate('The title should have at least 3 character'));
        }

        if (errors.asEnumerable().any())
            return res.json({
                isValid: !errors.asEnumerable().any(),
                errors: errors
            });

        var entity = await(bankRepository.findById(req.params.id));

        entity.title = cmd.title;

        await(bankRepository.update(entity));

        res.json({
            isValid: true
        });
    }
});

router.route({
    method: 'DELETE',
    path: '/banks/:id',
    handler: (req, res, bankRepository)=> {
        var errors = [];

        if (errors.asEnumerable().any())
            return res.json({
                isValid: !errors.asEnumerable().any(),
                errors: errors
            });

        await(bankRepository.remove(req.params.id));

        res.json({
            isValid: true
        });
    }
});

module.exports = router.routes;

