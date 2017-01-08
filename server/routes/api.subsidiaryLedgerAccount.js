/*var express = require('express');
var router = express.Router();
var subsidiaryLedgerAccountRouteHandlers = require('../route.handlers/subsidiaryLedgerAccount');

router.route('/subsidiary-ledger-accounts').get(subsidiaryLedgerAccountRouteHandlers.getAll);

router.route('/subsidiary-ledger-accounts/general-ledger-account/:parentId')
    .get(subsidiaryLedgerAccountRouteHandlers.getAllByGeneralLedgerAccount)
    .post(subsidiaryLedgerAccountRouteHandlers.create);

router.route('/subsidiary-ledger-accounts/:id')
    .get(subsidiaryLedgerAccountRouteHandlers.getById)
    .put(subsidiaryLedgerAccountRouteHandlers.update)
    .delete(subsidiaryLedgerAccountRouteHandlers.remove);

router.route('/subsidiary-ledger-accounts/:id/activate').put(subsidiaryLedgerAccountRouteHandlers.activate);
router.route('/subsidiary-ledger-accounts/:id/deactivate').put(subsidiaryLedgerAccountRouteHandlers.deactivate);

module.exports = router;*/

var router = require('../services/routeService').Router(),
    view = require('../viewModel.assemblers/view.subsidiaryLedgerAccount');

router.route({
    method: 'GET',
    path: '/subsidiary-ledger-accounts',
    handler: (req, res, knexService, kendoQueryResolve)=> {
        var query = knexService.select().from(function () {
            var selectExp = '"subsidiaryLedgerAccounts".*,' +
                '"subsidiaryLedgerAccounts".code || \' \' || "subsidiaryLedgerAccounts".title as "display",' +
                '"generalLedgerAccounts".code || \'-\' || "subsidiaryLedgerAccounts".code || \' \' || "subsidiaryLedgerAccounts".title as "account"'
            this.select(knexService.raw(selectExp))
                .from('subsidiaryLedgerAccounts')
                .leftJoin('generalLedgerAccounts', 'generalLedgerAccounts.id', 'subsidiaryLedgerAccounts.generalLedgerAccountId')
                .as('baseSubsidiaryLedgerAccounts');
        }).as('baseSubsidiaryLedgerAccounts');

        kendoQueryResolve(query, req.query, view)
            .then(function (result) {
                res.json(result);
            });
    }
});

router.route({
    method: 'GET',
    path: '/subsidiary-ledger-accounts/general-ledger-account/:parentId',
    handler: (req, res, knexService, kendoQueryResolve)=> {
        var query = knexService.select().from(function () {
            var selectExp = '"subsidiaryLedgerAccounts".*,' +
                '"subsidiaryLedgerAccounts".code || \' \' || "subsidiaryLedgerAccounts".title as "display"'
            this.select(knexService.raw(selectExp))
                .from('subsidiaryLedgerAccounts')
                .leftJoin('generalLedgerAccounts', 'generalLedgerAccounts.id', 'subsidiaryLedgerAccounts.generalLedgerAccountId')
                .where('generalLedgerAccountId', req.params.parentId)
                .as('baseSubsidiaryLedgerAccounts');
        }).as('baseSubsidiaryLedgerAccounts');

        kendoQueryResolve(query, req.query, view)
            .then(function (result) {
                res.json(result);
            });
    }
});

router.route({
    method: 'GET',
    path: '/subsidiary-ledger-accounts/:id',
    handler: (req, res, knexService)=> {
        knexService.select().from('subsidiaryLedgerAccounts')
            .where('id', req.params.id)
            .then(function (result) {
                var entity = result[0];
                res.json(view(entity));
            });
    }
});

router.route({
    method: 'POST',
    path: '/subsidiary-ledger-accounts/general-ledger-account/:parentId',
    handler: (req, res, subsidiaryLedgerAccountRepository)=> {
        var errors = [];
        var cmd = req.body;

        if (string.isNullOrEmpty(cmd.title))
            errors.push(translate('The code is required'));
        else {
            if (cmd.title.length < 3)
                errors.push(translate('The title should have at least 3 character'));
        }

        if (!string.isNullOrEmpty(cmd.code)) {
            var sla = await(subsidiaryLedgerAccountRepository.findByCode(cmd.code, cmd.generalLedgerAccountId, cmd.id));

            if (sla)
                errors.push(translate('The code is duplicated'));
        }

        if (errors.asEnumerable().any())
            return res.json({
                isValid: false,
                errors: errors
            });

        var entity = await(subsidiaryLedgerAccountRepository.findById(cmd.id));

        entity.code = cmd.code;
        entity.title = cmd.title;
        entity.isBankAccount = cmd.isBankAccount;
        entity.detailAccountAssignmentStatus = cmd.detailAccountAssignmentStatus;
        entity.dimension1AssignmentStatus = cmd.dimension1AssignmentStatus;
        entity.dimension2AssignmentStatus = cmd.dimension2AssignmentStatus;
        entity.dimension3AssignmentStatus = cmd.dimension3AssignmentStatus;

        await(subsidiaryLedgerAccountRepository.update(entity));

        return res.json({
            isValid: true
        });
    }
});

router.route({
    method: 'PUT',
    path: '/subsidiary-ledger-accounts/:id',
    handler: (req, res, subsidiaryLedgerAccountRepository)=> {
        var errors = [];
        var cmd = req.body;

        if (string.isNullOrEmpty(cmd.title))
            errors.push(translate('The code is required'));
        else {
            if (cmd.title.length < 3)
                errors.push(translate('The title should have at least 3 character'));
        }

        if (!string.isNullOrEmpty(cmd.code)) {
            var sla = await(subsidiaryLedgerAccountRepository.findByCode(cmd.code, cmd.generalLedgerAccountId, cmd.id));

            if (sla)
                errors.push(translate('The code is duplicated'));
        }

        if (errors.asEnumerable().any())
            return res.json({
                isValid: false,
                errors: errors
            });

        var entity = await(subsidiaryLedgerAccountRepository.findById(cmd.id));

        entity.code = cmd.code;
        entity.title = cmd.title;
        entity.isBankAccount = cmd.isBankAccount;
        entity.detailAccountAssignmentStatus = cmd.detailAccountAssignmentStatus;
        entity.dimension1AssignmentStatus = cmd.dimension1AssignmentStatus;
        entity.dimension2AssignmentStatus = cmd.dimension2AssignmentStatus;
        entity.dimension3AssignmentStatus = cmd.dimension3AssignmentStatus;

        await(subsidiaryLedgerAccountRepository.update(entity));

        return res.json({
            isValid: true
        });
    }
});

router.route({
    method: 'DELETE',
    path: '/subsidiary-ledger-accounts/:id',
    handler: (req, res, subsidiaryLedgerAccountRepository)=> {
        // check has journalLine data

        await(subsidiaryLedgerAccountRepository.remove(req.params.id));

        return res.json({
            isValid: true
        });
    }
});

router.route({
    method: 'PUT',
    path: '/subsidiary-ledger-accounts/:id/activate',
    handler: (req, res, subsidiaryLedgerAccountRepository)=> {
        var entity = await(subsidiaryLedgerAccountRepository.findById(req.params.id));

        entity.isActive = true;

        await(subsidiaryLedgerAccountRepository.update(entity));

        return res.json({
            isValid: true
        });
    }
});

router.route({
    method: 'PUT',
    path: '/subsidiary-ledger-accounts/:id/deactivate',
    handler: (req, res, subsidiaryLedgerAccountRepository)=> {
        var entity = await(subsidiaryLedgerAccountRepository.findById(req.params.id));

        entity.isActive = false;

        await(subsidiaryLedgerAccountRepository.update(entity));

        return res.json({
            isValid: true
        });

    }
});

module.exports = router.routes;

