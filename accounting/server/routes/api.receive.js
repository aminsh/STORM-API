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
            result = await(paymentQuery.getReceivableCheques(req.query));

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
            'on-receivable-cheque-passed',
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
            'on-receivable-cheque-return',
            id,
            cmd,
            {branchId: req.branchId, fiscalPeriodId: req.fiscalPeriodId});
    }));

router.route('/income').post(async ((req, res) => {
    let cmd = req.body,
        payments = cmd.payments,
        id = req.params.id,

        paymentRepository = new PaymentRepository(req.branchId);

    payments.forEach(e => {

        let entity = {
            number: e.number,
            date: e.date,
            invoiceId: id,
            amount: e.amount,
            paymentType: e.paymentType,
            bankName: e.bankName,
            bankBranch: e.bankBranch,
            receiveOrPay: 'receive',
            chequeStatus: e.paymentType == 'cheque' ? 'normal' : null
        };

        await(paymentRepository.create(entity));

        e.id = entity.id;
    });

    res.json({isValid: true});

    EventEmitter.emit('on-income-created',
        payments,
        cmd,
        {branchId: req.branchId, fiscalPeriodId: req.fiscalPeriodId});2
}));

module.exports = router;
