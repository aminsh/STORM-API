"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    router = require('express').Router(),
    SaleRepository = require('../../data/repository.sale'),
    ProductRepository = require('../../data/repository.product'),
    DetailAccountRepository = require('../../data/repository.detailAccount'),
    EventEmitter = require('../../services/shared').service.EventEmitter;

router.route('/')
    .post(async((req, res) => {
        let saleRepository = new SaleRepository(req.branchId),
            productRepository = new ProductRepository(req.branchId),
            detailAccountRepository = new DetailAccountRepository(req.branchId),
            cmd = req.body,
            entity = {
                number: cmd.number,
                date: cmd.date,
                description: cmd.description,
                referenceId: cmd.referenceId
            },
            detailAccount = await(detailAccountRepository.findByReferenceId(cmd.customer.id));

        if(!detailAccount)
            detailAccount = await(detailAccountRepository.create({
                code: cmd.customer.code,
                referenceId: cmd.customer.id,
                title: cmd.customer.title
            }));

        entity.detailAccountId = detailAccount.id;

        entity.lines = cmd.lines.asEnumerable()
            .select(line => {

                let product = await(productRepository.findByReferenceId(line.product.id));

                if (!product)
                    product = await(productRepository.create({
                        title: line.product.title,
                        referenceId: line.product.id
                    }));

                return {
                    productId: product.id,
                    quantity: line.quantity,
                    unitPrice: line.unitPrice,
                    discount: line.discount,
                    vat: line.vat
                };
            })
            .toArray();

        let result = await(saleRepository.create(entity));

        EventEmitter.emit('on-sale-created', result);

        res.json({
            success: true,
            returnValue: {id: result.id}
        });
    }));

module.exports = router;