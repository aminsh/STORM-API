"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    router = require('express').Router(),
    string = require('../utilities/string'),
    translate = require('../services/translateService'),
    InvoiceRepository = require('../data/repository.invoice'),
    SaleQuery = require('../queries/query.sale');

router.route('/')
    .get(async((req, res) => {
        let saleQuery = new SaleQuery(req.cookies['branch-id']),
            result = await(saleQuery.getAll(req.query));

       res.json(result);
    }));

router.route('/:type')
    .post(async((req, res) => {
        let invoiceRepository = new InvoiceRepository(req.cookies['branch-id']),
            cmd = req.body,
            status = req.params.type,

            entity = {
                number: await(invoiceRepository.saleMaxNumber()),
                date: cmd.date,
                description: cmd.description,
                detailAccountId: cmd.detailAccountId,
                invoiceType: 'sale',
                invoiceStatus: status
            };

        entity.lines = cmd.invoiceLines.asEnumerable()
            .select(line => ({
                productId: line.productId,
                description: line.description,
                quantity: line.quantity,
                unitPrice: line.unitPrice,
                discount: line.discount,
                vat: line.vat
            }))
            .toArray();

        let result = await(invoiceRepository.create(entity));

        res.json({isValid: true, returnValue: {id: result.id}});
    }));

router.route('/:id/lines').get(async((req, res)=>{
    let saleQuery = new SaleQuery(req.cookies['branch-id']),
        result = await(saleQuery.getAllLines(req.params.id,req.query));

    res.json(result);
}));

module.exports = router;










