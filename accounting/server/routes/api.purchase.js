"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    router = require('express').Router(),
    string = require('../utilities/string'),
    translate = require('../services/translateService'),
    InvoiceRepository = require('../data/repository.invoice'),
    InvoiceQuery = require('../queries/query.invoice'),
    ProductRepository = require('../data/repository.product');

router.route('/')
    .get(async((req, res) => {
        let invoiceQuery = new InvoiceQuery(req.cookies['branch-id']),
            result = await(invoiceQuery.getAll(req.query));

        res.json(result);
    }))
    .post(async((req, res) => {
        let invoiceRepository = new InvoiceRepository(req.cookies['branch-id']),
            productRepository = new ProductRepository(req.cookies['branch-id']),
            cmd = req.body,

            entity = {
                number: cmd.number,
                date: cmd.date,
                description: cmd.description,
                detailAccountId: cmd.detailAccountId,
                invoiceType: 'purchase',
                invoiceStatus: status
            };

        entity.lines = cmd.invoiceLines.asEnumerable()
            .select(line => ({
                productId: line.productId,
                description: (line.productId)
                    ? await(productRepository.findById(line.productId)).title
                    : line.description,
                quantity: line.quantity,
                unitPrice: line.unitPrice,
                discount: line.discount,
                vat: line.vat
            }))
            .toArray();

        let result = await(invoiceRepository.create(entity));

        res.json({isValid: true, returnValue: {id: result.id}});
    }));

router.route('/:id/lines').get(async((req, res) => {
    let invoiceQuery = new InvoiceQuery(req.cookies['branch-id']),
        result = await(invoiceQuery.getAllLines(req.params.id, req.query));

    res.json(result);
}));

module.exports = router;










