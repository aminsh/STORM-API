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
            result = await(saleQuery.getAll(req.query));

       res.json(result);
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

        entity.lines = cmd.invoiceLines.asEnumerable()
            .select(line => ({
                productId: line.productId,
                quantity: line.quantity,
                unitPrice: line.unitPrice,
                discount: line.discount,
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










