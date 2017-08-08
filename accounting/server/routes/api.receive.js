"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    router = require('express').Router(),
    translate = require('../services/translateService'),
    FiscalPeriodRepository = require('../data/repository.fiscalPeriod'),
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
            fiscalPeriodRepository = new FiscalPeriodRepository(req.branchId),
            currentFiscalPeriod = await(fiscalPeriodRepository.findById(req.cookies['current-period'])),
            errors=[],
            id = req.params.id;

        let temporaryDateIsInPeriodRange =
            cmd.date >= currentFiscalPeriod.minDate &&
            cmd.date <= currentFiscalPeriod.maxDate;

        if (!temporaryDateIsInPeriodRange)
            errors.push(translate('The temporaryDate is not in current period date range'));

        if (errors.length != 0)
            return res.json({isValid: false, errors});

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
            id = req.params.id,
            fiscalPeriodRepository = new FiscalPeriodRepository(req.branchId),
            currentFiscalPeriod = await(fiscalPeriodRepository.findById(req.cookies['current-period'])),
            errors=[];

        let temporaryDateIsInPeriodRange =
            cmd.date >= currentFiscalPeriod.minDate &&
            cmd.date <= currentFiscalPeriod.maxDate;

        if (!temporaryDateIsInPeriodRange)
            errors.push(translate('The temporaryDate is not in current period date range'));

        if (errors.length != 0)
            return res.json({isValid: false, errors});

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
        fiscalPeriodRepository = new FiscalPeriodRepository(req.branchId),
        currentFiscalPeriod = await(fiscalPeriodRepository.findById(req.cookies['current-period'])),
        errors=[],
        id = req.params.id,
        date=cmd.date,
        paymentRepository = new PaymentRepository(req.branchId);

    let temporaryDateIsInPeriodRange =
        cmd.date >= currentFiscalPeriod.minDate &&
        cmd.date <= currentFiscalPeriod.maxDate;

    if (!temporaryDateIsInPeriodRange)
        errors.push(translate('The temporaryDate is not in current period date range'));

    if (errors.length != 0)
        return res.json({isValid: false, errors});

    payments.forEach(e => {

        let entity = {
            number: e.number,
            date: date,
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
