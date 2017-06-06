"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    router = require('express').Router(),
    string = require('../utilities/string'),
    translate = require('../services/translateService'),
    InvoiceRepository = require('../data/repository.invoice'),
    ProductRepository = require('../data/repository.product'),
    InvoiceQuery = require('../queries/query.invoice'),
    EventEmitter = require('../services/shared').service.EventEmitter,
    Payment = require('../domain/payment');

router.route('/')
    .get(async((req, res) => {
        let invoiceQuery = new InvoiceQuery(req.cookies['branch-id']),
            result = await(invoiceQuery.getAll(req.query, 'sale'));

        res.json(result);
    }))

    //confirm invoice
    .post(async((req, res) => {
        let branchId = req.cookies['branch-id'],
            invoiceRepository = new InvoiceRepository(branchId),
            productRepository = new ProductRepository(branchId),
            cmd = req.body,

            current = {
                branchId,
                fiscalPeriodId: req.cookies['current-period'],
                userId: req.user.id
            },

            entity = createInvoice(
                'waitForPayment',
                cmd,
                invoiceRepository,
                productRepository),

            result = await(invoiceRepository.create(entity));

        res.json({isValid: true, returnValue: {id: result.id}});

        EventEmitter.emit('on-sale-created', result, current);
    }));

// saved as draft invoice
router.route('/as-draft')
    .post(async((req, res) => {
        let invoiceRepository = new InvoiceRepository(req.cookies['branch-id']),
            productRepository = new ProductRepository(req.cookies['branch-id']),
            cmd = req.body,

            entity = createInvoice('draft',
                cmd,
                invoiceRepository,
                productRepository),

            result = await(invoiceRepository.create(entity));

        res.json({isValid: true, returnValue: {id: result.id}});
    }));

function createInvoice(status, cmd, invoiceRepository, productRepository) {
    let entity = {
        number: (await(invoiceRepository.saleMaxNumber()).max || 0) + 1,
        date: cmd.date,
        description: cmd.description,
        detailAccountId: cmd.detailAccountId,
        invoiceType: 'sale',
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

    return entity;
}

router.route('/:id/pay')
    .post(async((req, res) => {
        let payment = new Payment(req.cookies['branch-id']);

        payment.create(req.body);
        await(payment.save());

        res.json({isValid: true});

        payment.generateJournal();
    }));

router.route('/:id/lines').get(async((req, res) => {
    let invoiceQuery = new InvoiceQuery(req.cookies['branch-id']),
        result = await(invoiceQuery.getAllLines(req.params.id, req.query));

    res.json(result);
}));

module.exports = router;










