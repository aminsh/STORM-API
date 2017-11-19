"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    router = require('express').Router(),
    ProductCategoryService = ApplicationService.ProductCategoryService,
    Guid = instanceOf('utility').Guid,
    EventEmitter = instanceOf('EventEmitter'),
    ProductCategoryQuery = require('../queries/query.productCategory');

router.route('/')
    .get(async((req, res) => {
        let productCategoryQuery = new ProductCategoryQuery(req.branchId),
            result = await(productCategoryQuery.getAll(req.query));

        res.json(result);
    }))
    .post(async((req, res) => {
        let cmd = req.body,
            serviceId;

        try {

            serviceId = Guid.new();

            EventEmitter.emit('onServiceStarted', serviceId, {command: cmd, state: req, service: 'productCategoryCreate'});

            const id = new ProductCategoryService(req.branchId).create(cmd);

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
        let productCategoryQuery = new ProductCategoryQuery(req.branchId),
            result = await(productCategoryQuery.getById(req.params.id));

        res.json(result);
    }))
    .put(async((req, res) => {
        let cmd = req.body,
            id = req.params.id,
            serviceId;

        try {

            serviceId = Guid.new();

            EventEmitter.emit('onServiceStarted', serviceId, {command: {cmd, id}, state: req, service: 'productCategoryUpdate'});

            new ProductCategoryService(req.branchId).update(id, cmd);

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
