"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    router = require('express').Router(),
    string = require('../utilities/string'),
    translate = require('../services/translateService');
    //InvoiceRepository = require('../data/repository.invoice'),
    //InvoiceQuery = require('../queries/query.invoice');

router.route('/')
    .get(async((req, res) => {
        let invoiceQuery = new InvoiceQuery(req.cookies['branch-id']),
            invoices = await(invoiceQuery.getAll(req.query));

        res.send(invoices);
    }))
    .post(async((req, res) => {
        let cmd = req.body;

        res.json({isValid: true});
    }));

module.exports = router;










