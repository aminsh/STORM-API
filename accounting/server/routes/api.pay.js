"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    router = require('express').Router(),
    PaymentQuery = require('../queries/query.payment'),
    PaymentRepository = require('../data/repository.payment'),
    EventEmitter = require('../services/shared').service.EventEmitter;

router.route('/cheques')
    .get(async((req, res) => {
        let paymentQuery = new PaymentQuery(req.branchId),
            result = await(paymentQuery.getPayableCheques(req.query));

        res.json(result);
    }));

router.route('/cheques/:id/pass')
    .post(async((req, res) => {
        let paymentRepository = new PaymentRepository(req.branchId),
            cmd = req.body,
            id = req.params.id;

        await(paymentRepository.update(id, {chequeStatus: 'passed'}));

        res.json({isValid: true});

        EventEmitter.emit(
            'on-payable-cheque-passed',
            id,
            cmd,
            {branchId: req.branchId, fiscalPeriodId: req.fiscalPeriodId});
    }));

router.route('/cheques/:id/return')
    .post(async((req, res) => {
        let paymentRepository = new PaymentRepository(req.branchId),
            cmd = req.body,
            id = req.params.id;

        await(paymentRepository.update(id, {chequeStatus: 'return', invoiceId: null}));

        res.json({isValid: true});

        EventEmitter.emit(
            'on-payable-cheque-return',
            id,
            cmd,
            {branchId: req.branchId, fiscalPeriodId: req.fiscalPeriodId});
    }));

module.exports = router;
