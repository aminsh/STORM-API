/*var express = require('express');
var router = express.Router();
var dimensionRouteHandlers = require('../route.handlers/dimension');

router.route('/dimensions/category/:categoryId')
    .get(dimensionRouteHandlers.getAll)
    .post(dimensionRouteHandlers.create);

router.route('/dimensions/:id')
    .get(dimensionRouteHandlers.getById)
    .put(dimensionRouteHandlers.update)
    .delete(dimensionRouteHandlers.remove);

router.route('/dimensions/:id/activate').put(dimensionRouteHandlers.activate);
router.route('/dimensions/:id/deactivate').put(dimensionRouteHandlers.deactivate);

module.exports = router;*/

var router = require('../services/routeService').Router(),
    view = require('../viewModel.assemblers/view.dimension');

router.route({
    method: 'GET',
    path: '/dimensions/category/:categoryId',
    handler: (req, res, knexService, kendoQueryResolve)=> {
        var query = knexService.select().from(function () {
            this.select(knexService.raw("*,code || ' ' || title as display"))
                .from('dimensions').as('baseDimensions').where('dimensionCategoryId', req.params.categoryId);
        }).as('baseDimensions');

        kendoQueryResolve(query, req.query, view)
            .then(function (result) {
                res.json(result);
            });
    }
});

router.route({
    method: 'POST',
    path: '/dimensions/category/:categoryId',
    handler: (req, res, dimensionRepository)=> {
        var errors = [];
        var cmd = req.body;

        if (!string.isNullOrEmpty(cmd.code)) {
            var dimension = await(repository.findByCode(cmd.code, cmd.dimensionCategoryId));

            if (dimension)
                errors.push(translate('The code is duplicated'));
        }

        if (string.isNullOrEmpty(cmd.title))
            errors.push(translate('The title is required'));
        else {
            if (cmd.title.length < 3)
                errors.push(translate('The title should have at least 3 character'));
        }

        if (errors.errors.asEnumerable().any())
            return res.json({
                isValid: false,
                errors: errors
            });

        var entity = await(dimensionRepository.create({
            code: cmd.code,
            title: cmd.title,
            description: cmd.description,
            isActive: true
        }));

        entity = await(dimensionRepository.create(entity));

        return res.json({
            isValid: true,
            returnValue: {id: entity.id}
        });
    }
});

router.route({
    method: 'GET',
    path: '/dimensions/:id',
    handler: (req, res, knexService)=> {
        knexService.select().from('dimensions').where('id', req.params.id)
            .then(function (result) {
                var entity = result[0];
                res.json(view(entity));
            });
    }
});

router.route({
    method: 'PUT',
    path: '/dimensions/:id',
    handler: (req, res, dimensionRepository)=> {
        var errors = [];
        var cmd = req.body;

        if (!string.isNullOrEmpty(cmd.code)) {
            var dimension = await(repository.findByCode(cmd.code, cmd.dimensionCategoryId, cmd.id));

            if (dimension)
                errors.push(translate('The code is duplicated'));
        }

        if (string.isNullOrEmpty(cmd.title))
            errors.push(translate('The title is required'));
        else {
            if (cmd.title.length < 3)
                errors.push(translate('The title should have at least 3 character'));
        }

        if (errors.asEnumerable().any())
            return res.json({
                isValid: false,
                errors: errors
            });

        var entity = await(dimensionRepository.findById(cmd.id));

        entity.title = cmd.title;
        entity.code = cmd.code;
        entity.description = cmd.description;

        await(dimensionRepository.update(entity));

        return res.json({
            isValid: true
        });
    }
});

router.route({
    method: 'DELETE',
    path: '/dimensions/:id',
    handler: (req, res, dimensionRepository)=> {
        await(dimensionRepository.remove(req.params.id));

        return res.json({
            isValid: true
        });
    }
});

router.route({
    method: 'PUT',
    path: '/dimensions/:id/activate',
    handler: (req, res, dimensionRepository)=> {
        var entity = await(dimensionRepository.findById(req.params.id));

        entity.isActive = true;

        await(dimensionRepository.update(entity));

        return res.json({
            isValid: true
        });
    }
});

router.route({
    method: 'PUT',
    path: '/dimensions/:id/deactivate',
    handler: (req, res, dimensionRepository)=> {
        var entity = await(dimensionRepository.findById(req.params.id));

        entity.isActive = false;

        await(dimensionRepository.update(entity));

        return res.json({
            isValid: true
        });
    }
});

module.exports = router.routes;