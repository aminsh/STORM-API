"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    router = require('express').Router(),
    knex = instanceOf('knex'),
    InvoiceQuery = require('../queries/query.invoice');

router.route('/:branchId/:invoiceId')
    .get(async(function (req, res) {

        let NotFoundAction = () => res.sendStatus(404),
            branchId = req.params.branchId,
            branch = await(knex.select('id','logo', 'name').from('branches').where({id: branchId}).first());

        if(!branch)
            return NotFoundAction();

        let invoiceQuery = new InvoiceQuery(req.params.branchId),
            invoice = invoiceQuery.getById(req.params.invoiceId);

        if (!invoice)
            return NotFoundAction();

        res.json({invoice, branch});

    }));


module.exports = router;