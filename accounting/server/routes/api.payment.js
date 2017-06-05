"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    router = require('express').Router(),
    string = require('../utilities/string'),
    translate = require('../services/translateService'),
    PaymentRepository = require('../data/repository.payment'),
    Payment = require('../models/payment');

router.route('/').post(async((req, res) => {
    let paymentRepository = new PaymentRepository(req.cookies['branch-id']),
        cmd = req.body;

    Payment.create()

}));


module.exports = router;
