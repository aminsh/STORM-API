"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    router = require('express').Router(),
    EventEmitter = instanceOf('EventEmitter'),
    Guid = instanceOf('utility').Guid,
    FundService = ApplicationService.FundService,
    DetailAccountQuery = require('../queries/query.detailAccount');

router.route('/')
    .get(async((req, res) => {
        let detailAccountQuery = new DetailAccountQuery(req.branchId),
            result = await(detailAccountQuery.getAllFunds(req.query));
        res.json(result);
    }))
    .post(async((req, res) => {
        let cmd = req.body,
            serviceId;

        try {

            serviceId = Guid.new();

            EventEmitter.emit('onServiceStarted', serviceId, {command: cmd, state: req, service: 'createFund'});

            const fundId = new FundService(req.branchId).create(cmd);

            EventEmitter.emit('onServiceSucceed', serviceId, {fundId});

            res.json({isValid: true, returnValue: {id: fundId}});

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
        let detailAccountQuery = new DetailAccountQuery(req.branchId),
            result = await(detailAccountQuery.getById(req.params.id));
        res.json(result);
    }))
    .put(async((req, res) => {
        let cmd = req.body,
            id = req.params.id,
            serviceId;

        try {

            serviceId = Guid.new();

            EventEmitter.emit('onServiceStarted', serviceId, {command: {cmd, id}, state: req, service: 'updateFund'});

            new FundService(req.branchId).update(id, cmd);

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

            EventEmitter.emit('onServiceStarted', serviceId, {command: {id}, state: req, service: 'removeFund'});

            new FundService(req.branchId).remove(id);

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

router.route('/:id/tiny-turnover').get(async((req, res) => {
    let detailAccountQuery = new DetailAccountQuery(req.branchId),
        result = await(detailAccountQuery.getAllSmallTurnoverById(
            req.params.id,
            'fund',
            req.fiscalPeriodId,
            req.query));

    res.json(result);
}));


module.exports = router;