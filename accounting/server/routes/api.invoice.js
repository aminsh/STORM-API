"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    router = require('express').Router();
    /*string = require('../utilities/string'),
    translate = require('../services/translateService'),
    InvoiceRepository = require('../data/repository.invoice'),
    InvoiceQuery = require('../queries/query.invoice');*/

router.route('/')
    .get(async((req, res) => {
        let invoiceQuery = new InvoiceQuery(req.cookies['branch-id']),
            invoices = [
                {id: 1, number: 1, date: '1395/01/01', description: 'test'},
                {id: 2, number: 2, date: '1395/01/01', description: 'test'},
                {id: 3, number: 3, date: '1395/01/01', description: 'test'}
            ];


        res.send(invoices);
    }))
    .post(async((req, res) => {
        let cmd = req.body;



        res.json({isValid: true});
    }));

module.exports = router;










