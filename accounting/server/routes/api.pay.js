"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    router = require('express').Router(),
    PaymentQuery = require('../queries/query.payment'),
    Payment = require('../domain/payment');


router.route('/cheques')
    .get(async((req, res) => {
        let paymentQuery = new PaymentQuery(req.branchId),
            result = await(paymentQuery.getPayableCheques(req.query));

        res.json(result);
    }));

router.route('/cheques/:id/pass')
    .post(async((req, res) => {
        let payment = new Payment(req.branchId, req.fiscalPeriodId),
            cmd = req.body;

        await(payment.passPayableCheque(req.params.id,cmd));

        res.json({isValid: true});
    }));

router.route('/cheques/:id/return')
    .post(async((req, res) => {
        let payment = new Payment(req.branchId, req.fiscalPeriodId),
            cmd = req.body;

        await(payment.returnPayableCheque(req.params.id,cmd));

        res.json({isValid: true});
    }));

module.exports = router;
