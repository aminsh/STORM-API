/*var express = require('express');
var router = express.Router();
var generalLedgerAccountRouteHandlers = require('../route.handlers/generalLedgerAccount');

router.route('/general-ledger-accounts')
    .get(generalLedgerAccountRouteHandlers.getAll)
    .post(generalLedgerAccountRouteHandlers.create);

router.route('/general-ledger-accounts/:id')
    .get(generalLedgerAccountRouteHandlers.getById)
    .put(generalLedgerAccountRouteHandlers.update)
    .delete(generalLedgerAccountRouteHandlers.remove);

router.route('/general-ledger-accounts/:id/activate').put(generalLedgerAccountRouteHandlers.activate);
router.route('/general-ledger-accounts/:id/deactivate').put(generalLedgerAccountRouteHandlers.deactivate);


module.exports = router;*/

var router = require('../services/routeService').Router(),
    view = require('../viewModel.assemblers/view.generalLedgerAccount');

router.route({
    method: 'GET',
    path: '/general-ledger-accounts',
    handler: (req, res,knexService,kendoQueryResolve)=> {
        var query = knexService.select().from(function () {
            this.select(knexService.raw("*,code || ' ' || title as display"))
                .from('generalLedgerAccounts').as('baseGeneralLedgerAccounts');
        }).as('baseGeneralLedgerAccounts');

        kendoQueryResolve(query, req.query, view)
            .then(function (result) {
                res.json(result);
            });
    }
});

router.route({
    method: 'POST',
    path: '/general-ledger-accounts',
    handler: (req, res, generalLedgerAccountRepository)=> {
        var errors = [];
        var cmd = req.body;

        if (string.isNullOrEmpty(cmd.code))
            errors.push(translate('The code is required'));
        else {
            var gla = await(generalLedgerAccountRepository.findByCode(cmd.code));

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

        var entity = {
            code: cmd.code,
            title: cmd.title,
            postingType: cmd.postingType,
            balanceType: cmd.balanceType,
            description: cmd.description,
            isActive: true
        };

        entity = await(generalLedgerAccountRepository.create(entity));

        return res.json({
            isValid: true,
            returnValue: {id: entity.id}
        });
    }
});

router.route({
    method: 'GET',
    path: '/general-ledger-accounts/:id',
    handler: (req, res, knexService)=> {
        knexService.select().from('generalLedgerAccounts').where('id', req.params.id)
            .then(function (result) {
                var entity = result[0];
                res.json(view(entity));
            });
    }
});

router.route({
    method: 'PUT',
    path: '/general-ledger-accounts/:id',
    handler: (req, res, genralLedgerAccountRepository)=> {
        var errors = [];
        var cmd = req.body;

        if (string.isNullOrEmpty(cmd.code))
            errors.push(translate('The code is required'));
        else {
            var gla = await(genralLedgerAccountRepository.findByCode(cmd.code, cmd.id));

            if (gla)
                errors.push(translate('The code is duplicated'));
        }

        if (string.isNullOrEmpty(cmd.title))
            errors.push(translate('The title is required'));
        else {
            if (cmd.title.length < 3)
                errors.push(translate('The title should have at least 3 character'));
        }

        return res.json({
            isValid: !errors.asEnumerable().any(),
            errors: errors
        });

        var generalLedgerAccount = await(repository.findById(cmd.id));

        generalLedgerAccount.title = cmd.title;
        generalLedgerAccount.code = cmd.code;
        generalLedgerAccount.potingType = cmd.postingType;
        generalLedgerAccount.balanceType = cmd.balanceType;
        generalLedgerAccount.description = cmd.description;

        await(genralLedgerAccountRepository.update(generalLedgerAccount));

        return res.json({
            isValid: true
        });
    }
});

router.route({
    method: 'DELETE',
    path: '/general-ledger-accounts/:id',
    handler: (req, res, generalLedgerAccountRepository)=> {
        var errors = [];
        var gla = await(generalLedgerAccountRepository.findById(req.params.id));

        if (gla.subsidiaryLedgerAccounts.asEnumerable().any())
            errors
                .push(translate('The Current Account has Subsidiary ledger account'));

        //check for journal line

        if (errors.asEnumerable().any())
            return res.json({
                isValid: false,
                errors: errors
            });

        await(generalLedgerAccountRepository.remove(req.params.id));

        return res.json({
            isValid: true
        });
    }
});

router.route({
    method: 'PUT',
    path: '/general-ledger-accounts/:id/activate',
    handler: (req, res, generalLedgerAccountRepository)=> {
        var entity = await(generalLedgerAccountRepository.findById(req.params.id));

        entity.isActive = true;

        await(generalLedgerAccountRepository.update(entity));

        return res.json({
            isValid: true
        });
    }
});

router.route({
    method: 'PUT',
    path: '/general-ledger-accounts/:id/deactivate',
    handler: (req, res, generalLedgerAccountRepository)=> {
        var entity = await(generalLedgerAccountRepository.findById(req.params.id));

        entity.isActive = false;

        await(generalLedgerAccountRepository.update(entity));

        return res.json({
            isValid: true
        });
    }
});

module.exports = router.routes;