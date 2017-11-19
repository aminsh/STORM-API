"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    router = require('express').Router(),
    ScaleService = ApplicationService.ScaleService,
    Guid = instanceOf('utility').Guid,
    EventEmitter = instanceOf('EventEmitter'),
    ScaleQuery = require('../queries/query.scale');

router.route('/')
    .get(async((req, res) => {
        let scaleQuery = new ScaleQuery(req.branchId),
            result = await(scaleQuery.getAll(req.query));
        res.json(result);
    }))
    .post(async((req, res) => {
        let cmd = req.body,
            serviceId;

        try {

            serviceId = Guid.new();

            EventEmitter.emit('onServiceStarted', serviceId, {command: cmd, state: req, service: 'scaleCreate'});

            const id = new ScaleService(req.branchId).create(cmd);

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

module.exports = router;