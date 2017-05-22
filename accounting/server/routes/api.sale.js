"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    router = require('express').Router(),
    string = require('../utilities/string'),
    translate = require('../services/translateService'),
    SaleRepository = require('../data/repository.sale'),
    SaleQuery = require('../queries/query.sale');

router.route('/')
    .get(async((req, res) => {
        let saleQuery = new SaleQuery(req.cookies['branch-id']),
            result = await(saleQuery.getAll(req.query)),
            invoices = [
                {id: 1, number: 1, date: '1395/01/01', description: 'test'},
                {id: 2, number: 2, date: '1395/01/01', description: 'test'},
                {id: 3, number: 3, date: '1395/01/01', description: 'test'}
            ];

        res.send(invoices);
    }))
    .post(async((req, res) => {
        let saleRepository = new SaleRepository(req.cookies['branch-id']),
            cmd = req.body,

            entity = {
                number: cmd.number,
                date: cmd.date,
                description: cmd.description,
                detailAccountId: cmd.detailAccountId
            };

        entity.lines = cmd.lines.asEnumerable()
            .select(line => ({
                productId: line.productId,
                quantity: line.quantity,
                unitPrice: line.unitPrice,
                discountAmount: line.discount.amount,
                discountRate: line.discount.rate,
                vat: line.vat
            }))
            .toArray();

        let result = await(saleRepository.create(entity));

        res.json({isValid: true, returnValue: {id: result.id}});
    }));

router.route('/:id/lines').get(async((req, res)=>{
    let saleQuery = new SaleQuery(req.cookies['branch-id']),
        result = await(saleQuery.getAllLines(req.params.id,req.query));

    res.json(result);
}));

module.exports = router;










