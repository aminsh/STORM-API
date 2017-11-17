"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    router = require('express').Router(),
    GeneralLedgerAccountService = ApplicationService.GeneralLedgerAccountService,
    Guid = instanceOf('utility').Guid,
    EventEmitter = instanceOf('EventEmitter'),
    GeneralLedgerAccountQuery = require('../queries/query.generalLedgerAccount');


router.route('/')
    .get(async((req, res) => {
        let generalLedgerAccountQuery = new GeneralLedgerAccountQuery(req.branchId),
            result = await(generalLedgerAccountQuery.getAll(req.query));
        res.json(result);
    }))
    .post(async((req, res) => {

        let cmd = req.body,
            serviceId;

        try {

            serviceId = Guid.new();

            EventEmitter.emit('onServiceStarted', serviceId, {command: cmd, state: req, service: 'createGeneralLedgerAccount'});

            const id = new GeneralLedgerAccountService(req.branchId).create(cmd);

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

router.route('/chart-of-accounts')
    .get(async((req, res) => {
        const generalLedgerAccountQuery = new GeneralLedgerAccountQuery(req.branchId),
            result = await(generalLedgerAccountQuery.chartOfAccount());
        res.json(result);
    }));

router.route('/account-categories')
    .get((req, res) => {
        let generalLedgerAccountQuery = new GeneralLedgerAccountQuery(req.branchId),
            result = await(generalLedgerAccountQuery.accountCategory());

        res.json(result);
    });

router.route('/default/chart-of-accounts')
    .get((req, res) => {
        res.json(groups);
    });

router.route('/:id')
    .get(async((req, res) => {
        let generalLedgerAccountQuery = new GeneralLedgerAccountQuery(req.branchId),
            result = await(generalLedgerAccountQuery.getById(req.params.id));
        res.json(result);
    }))
    .put(async((req, res) => {
        let cmd = req.body,
            id = req.params.id,
            serviceId;

        try {

            serviceId = Guid.new();

            EventEmitter.emit('onServiceStarted', serviceId, {command: {cmd, id}, state: req, service: 'updateGeneralLedgerAccountUpdate'});

            new GeneralLedgerAccountService(req.branchId).update(id, cmd);

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

            EventEmitter.emit('onServiceStarted', serviceId, {command: {id}, state: req, service: 'removeGeneralLedgerAccount'});

            new GeneralLedgerAccountService(req.branchId).remove(id);

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

router.route('/account-categories')
    .get((req, res) => {
        let generalLedgerAccountQuery = new GeneralLedgerAccountQuery(req.branchId),
            result = await(generalLedgerAccountQuery.accountCategory());

        res.json(result);
    });


module.exports = router;
