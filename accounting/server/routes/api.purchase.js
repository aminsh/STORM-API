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
            result = await(invoiceQuery.getAll(req.query, 'purchase'));

        res.json(result);
    }))
    .post(async((req, res) => {
        let branchId = req.cookies['branch-id'],
            invoiceRepository = new InvoiceRepository(branchId),
            cmd = req.body,

            current = {
                branchId,
                fiscalPeriodId: req.cookies['current-period'],
                userId: req.user.id
            },

            status = cmd.status == 'confirm' ? 'waitForPayment' : 'draft',

            entity = createInvoice(status, cmd),

            result = await(invoiceRepository.create(entity));

        res.json({isValid: true, returnValue: {id: result.id}});

        EventEmitter.emit('on-purchase-created', result, current);
    }));

router.route('/:id/confirm')
    .post(async((req, res) => {

        let branchId = req.cookies['branch-id'],
            invoiceRepository = new InvoiceRepository(branchId),
            entity = {statue: 'waitForPayment'},
            id = req.params.id,

            current = {
                branchId,
                fiscalPeriodId: req.cookies['current-period'],
                userId: req.user.id
            };

        await(invoiceRepository.update(id, entity));

        let purchase = await(invoiceRepository.findById(id)),
            purchaseLines = await(invoiceRepository.findInvoiceLinesByInvoiceId(id));

        purchase.invoiceLines = purchaseLines;

        res.json({isValid: true});

        EventEmitter.emit('on-purchase-created', purchase, current);
    }));

router.route('/:id')
    .get(async((req, res) => {
        let invoiceQuery = new InvoiceQuery(req.cookies['branch-id']),
            result = await(invoiceQuery.getById(req.params.id));

        res.json(result);
    }))
    .put(async((req, res) => {
        let branchId = req.cookies['branch-id'],
            invoiceRepository = new InvoiceRepository(branchId),
            productRepository = new ProductRepository(branchId),

            cmd = req.body;

        let entity = {
            date: cmd.date,
            description: cmd.description,
            detailAccountId: cmd.detailAccountId
        };

        entity.lines = cmd.invoiceLines.asEnumerable()
            .select(line => ({
                id: line.id,
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

        await(invoiceRepository.updateBatch(req.params.id, entity));

        res.json({isValid: true});

    }))
    .delete(async((req, res) => {
        let invoiceRepository = new InvoiceRepository(req.cookies['branch-id']);

        await(invoiceRepository.remove(req.params.id));

        res.json({isValid: true});
    }));

router.route('/:id/lines').get(async((req, res) => {
    let invoiceQuery = new InvoiceQuery(req.cookies['branch-id']),
        result = await(invoiceQuery.getAllLines(req.params.id, req.query));

    res.json(result);
}));

module.exports = router;


function createInvoice(status, cmd) {
    let entity = {
        number: cmd.number,
        date: cmd.date,
        description: cmd.description,
        detailAccountId: cmd.detailAccountId,
        invoiceType: 'purchase',
        invoiceStatus: status
    };

    entity.invoiceLines = cmd.invoiceLines.asEnumerable()
        .select(line => ({
            productId: line.productId,
            description: line.description,
            quantity: line.quantity,
            unitPrice: line.unitPrice,
            discount: line.discount,
            vat: line.vat
        }))
        .toArray();

    return entity;
}










