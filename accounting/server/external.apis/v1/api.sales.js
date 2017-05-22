"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    router = require('express').Router(),
    SaleRepository = require('../../data/repository.sale'),
    EventEmitter = require('../../services/shared').service.EventEmitter;

router.route('/')
    .post(async((req, res) => {
        let saleRepository = new SaleRepository(req.branchId),
            cmd = req.body,
            //check not null customer

            entity = {
                number: cmd.number,
                date: cmd.date,
                description: cmd.description,
                customerId: cmd.customer.id
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

        EventEmitter.emit('on-sale-created', result);

        res.json({
            success: true,
            returnValue: {id: result.id}
        });
    }));

module.exports = router;