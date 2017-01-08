/*var express = require('express');
var router = express.Router();
var detailAccountRouteHandlers = require('../route.handlers/detailAccount');

router.route('/detail-accounts')
    .get(detailAccountRouteHandlers.getAll)
    .post(detailAccountRouteHandlers.create);

router.route('/detail-accounts/:id')
    .get(detailAccountRouteHandlers.getById)
    .put(detailAccountRouteHandlers.update)
    .delete(detailAccountRouteHandlers.remove);

router.route('/detail-accounts/:id/activate').put(detailAccountRouteHandlers.activate);
router.route('/detail-accounts/:id/deactivate').put(detailAccountRouteHandlers.deactivate);


module.exports = router;*/

var router = require('../services/routeService').Router(),
    view = require('../viewModel.assemblers/view.detailAccount');

router.route({
    method: 'GET',
    path: '/detail-accounts',
    handler: (req, res, knexService, kendoQueryResolve)=> {
        var query = knexService.select().from(function () {
            this.select(knexService.raw("*,code || ' ' || title as display"))
                .from('detailAccounts').as('baseDetailAccounts');
        }).as('baseDetailAccounts');

        kendoQueryResolve(query, req.query, view)
            .then(function (result) {
                res.json(result)
            });
    }
});

router.route({
    method: 'POST',
    path: '/detail-accounts',
    handler: (req, res, detailAccountRepository)=> {
        var errors = [];
        var cmd = req.body;

        if (string.isNullOrEmpty(cmd.code))
            errors.push(translate('The code is required'));
        else {
            var gla = await(detailAccountRepository.findByCode(cmd.code));

            if (gla)
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
                isValid: !errors.asEnumerable().any(),
                errors: errors
            });

        var entity = {
            code: cmd.code,
            title: cmd.title,
            description: cmd.description,
            isActive: true
        };

        var entity = await(detailAccountRepository.create(entity));

        return res.json({
            isValid: true,
            returnValue: {id: entity.id}
        });
    }
});

router.route({
    method: 'GET',
    path: '/detail-accounts/:id',
    handler: (req, res, knexService)=> {
        knexService.select().from('detailAccounts')
            .where('id', req.params.id)
            .then(function (result) {
                res.json(view(result[0]));
            });
    }
});

router.route({
    method: 'PUT',
    path: '/detail-accounts/:id',
    handler: (req, res, detailAccountRepository)=> {
        var errors = [];
        var cmd = req.body;

        if (string.isNullOrEmpty(cmd.code))
            errors.push(translate('The code is required'));
        else {
            var gla = await(detailAccountRepository.findByCode(cmd.code, cmd.id));

            if (gla)
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

        var entity = await(detailAccountRepository.findById(cmd.id));

        entity.title = cmd.title;
        entity.code = cmd.code;
        entity.potingType = cmd.postingType;
        entity.balanceType = cmd.balanceType;
        entity.description = cmd.description;

        await(detailAccountRepository.update(entity));

        return res.json({
            isValid: true
        });
    }
});

router.route({
    method: 'DELETE',
    path: '/detail-accounts/:id',
    handler: (req, res, detailAccountRepository)=> {
        var errors = [];

        //check for journal line
        if (errors.asEnumerable().any())
            return res.json({
                isValid: !errors.asEnumerable().any(),
                errors: errors
            });

        await(detailAccountRepository.remove(req.params.id));

        return res.json({
            isValid: true
        });
    }
});

router.route({
    method: 'PUT',
    path: '/detail-accounts/:id/activate',
    handler: (req, res, detailAccountRepository)=> {
        var entity = await(detailAccountRepository.findById(req.params.id));

        entity.isActive = true;

        await(detailAccountRepository.update(entity));

        return res.json({
            isValid: true
        });
    }
});

router.route({
    method: 'PUT',
    path: '/detail-accounts/:id/deactivate',
    handler: (req, res, detailAccountRepository)=> {
        var entity = await(detailAccountRepository.findById(req.params.id));

        entity.isActive = false;

        await(detailAccountRepository.update(entity));

        return res.json({
            isValid: true
        });
    }
});

module.exports = router.routes;