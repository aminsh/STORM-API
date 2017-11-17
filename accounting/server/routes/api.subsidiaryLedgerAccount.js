"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    SubsidiaryLedgerAccountService = ApplicationService.SubsidiaryLedgerAccountService,
    Guid = instanceOf('utility').Guid,
    EventEmitter = instanceOf('EventEmitter'),
    router = require('express').Router(),
    SubsidiaryLedgerAccountQuery = require('../queries/query.subsidiaryLedgerAccount');

router.route('/').get(async((req, res) => {
    let subsidiaryLedgerAccountQuery = new SubsidiaryLedgerAccountQuery(req.branchId),
        result = await(subsidiaryLedgerAccountQuery.getAll(req.query));
    res.json(result);
}));

router.route('/incomes').get(async((req, res) => {
    let subsidiaryLedgerAccountQuery = new SubsidiaryLedgerAccountQuery(req.branchId),
        result = await(subsidiaryLedgerAccountQuery.getAllIcome(req.query));
    res.json(result);
}));

router.route('/expenses').get(async((req, res) => {
    let subsidiaryLedgerAccountQuery = new SubsidiaryLedgerAccountQuery(req.branchId),
        result = await(subsidiaryLedgerAccountQuery.getAllExpense(req.query));
    res.json(result);
}));

router.route('/account/:id').get(async((req, res) => {
    let subsidiaryLedgerAccountQuery = new SubsidiaryLedgerAccountQuery(req.branchId),
        result = await(subsidiaryLedgerAccountQuery.getAll(req.params.id));
    res.json(result);
}));

router.route('/general-ledger-account/:parentId')
    .get(async((req, res) => {
        let subsidiaryLedgerAccountQuery = new SubsidiaryLedgerAccountQuery(req.branchId),
            result = await(subsidiaryLedgerAccountQuery.getAllByGeneralLedgerAccount(req.params.parentId, req.query));
        res.json(result);
    }))
    .post(async((req, res) => {
        let cmd = req.body,
            serviceId;

        cmd.generalLedgerAccountId = req.params.parentId;

        try {

            serviceId = Guid.new();

            EventEmitter.emit('onServiceStarted', serviceId, {command: cmd, state: req, service: 'subsidiaryLedgerAccountCreate'});

            const id = new SubsidiaryLedgerAccountService(req.branchId).create(cmd);

            EventEmitter.emit('onServiceSucceed', serviceId, {id});

            res.json({isValid: true, returnValue: {id}});

        }
        catch (e) {
            EventEmitter.emit('onServiceFailed', serviceId, e);

            const errors = e instanceof ValidationException
                ? e.errors
                : ['internal errors'];

            res['_headerSent'] === false && res.json({isValid: false, errors});

            console.log(e);
        }
    }));

router.route('/:id')
    .get(async((req, res) => {
        let subsidiaryLedgerAccountQuery = new SubsidiaryLedgerAccountQuery(req.branchId),
            result = await(subsidiaryLedgerAccountQuery.getById(req.params.id));
        res.json(result);
    }))
    .put(async((req, res) => {
        let cmd = req.body,
            id = req.params.id,
            serviceId;

        try {

            serviceId = Guid.new();

            EventEmitter.emit('onServiceStarted', serviceId, {command: {cmd, id}, state: req, service: 'subsidiaryLedgerAccountUpdate'});

            new SubsidiaryLedgerAccountService(req.branchId).update(id, cmd);

            EventEmitter.emit('onServiceSucceed', serviceId);

            res.json({isValid: true});

        }
        catch (e) {
            EventEmitter.emit('onServiceFailed', serviceId, e);

            const errors = e instanceof ValidationException
                ? e.errors
                : ['internal errors'];

            res['_headerSent'] === false && res.json({isValid: false, errors});

            console.log(e);
        }
    }))
    .delete(async((req, res) => {
        let id = req.params.id,
            serviceId;

        try {

            serviceId = Guid.new();

            EventEmitter.emit('onServiceStarted', serviceId, {command: {id}, state: req, service: 'SubsidiaryLedgerAccountRemove'});

            new SubsidiaryLedgerAccountService(req.branchId).remove(id);

            EventEmitter.emit('onServiceSucceed', serviceId);

            res.json({isValid: true});
        }
        catch (e) {
            EventEmitter.emit('onServiceFailed', serviceId, e);

            const errors = e instanceof ValidationException
                ? e.errors
                : ['internal errors'];

            res['_headerSent'] === false && res.json({isValid: false, errors});

            console.log(e);
        }
    }));

module.exports = router;
