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
        let invoiceQuery = new InvoiceQuery(req.branchId),
            result = await(invoiceQuery.getAll(req.query, 'sale'));

        res.json(result);
    }))

    .post(async((req, res) => {
        let branchId = req.branchId,
            invoiceRepository = new InvoiceRepository(branchId),
            productRepository = new ProductRepository(branchId),
            cmd = req.body,

            current = {
                branchId,
                fiscalPeriodId: req.cookies['current-period'],
                userId: req.user.id
            },

            status = cmd.status == 'confirm' ? 'waitForPayment' : 'draft',

            entity = createInvoice(
                status,
                cmd,
                invoiceRepository,
                productRepository),

            result = await(invoiceRepository.create(entity));

        res.json({isValid: true, returnValue: {id: result.id}});

        if (status == 'waitForPayment')
            EventEmitter.emit('on-sale-created', result, current);
    }));

router.route('/:id/confirm')
    .post(async((req, res) => {

        let branchId = req.branchId,
            invoiceRepository = new InvoiceRepository(branchId),
            entity = {statue: 'waitForPayment'},
            id = req.params.id,
            invoice = await(invoiceRepository.findById(id)),
            errors = [],
            current = {
                branchId,
                fiscalPeriodId: req.cookies['current-period'],
                userId: req.user.id
            };

        if (invoice.status != 'draft')
            errors.push('این فاکتور قبلا تایید شده');

        if (errors.length != 0)
            return res.json({isValid: false, errors});

        await(invoiceRepository.update(id, entity));

        let sale = await(invoiceRepository.findById(id));

        res.json({isValid: true});

        EventEmitter.emit('on-sale-created', sale, current);
    }));

router.route('/:id')
    .get(async((req, res) => {
        let invoiceQuery = new InvoiceQuery(req.branchId),
            result = await(invoiceQuery.getById(req.params.id));

        res.json(result);
    }))
    .put(async((req, res) => {
        let invoiceRepository = new InvoiceRepository(req.branchId),
            id = req.params.id,
            errors = [],
            invoice = await(invoiceRepository.findById(id)),
            cmd = req.body,
            status = cmd.status == 'confirm' ? 'waitForPayment' : 'draft',

            current = {
                branchId: req.branchId,
                fiscalPeriodId: req.cookies['current-period'],
                userId: req.user.id
            },

            entity = {
                date: cmd.date,
                description: cmd.description,
                detailAccountId: cmd.detailAccountId || cmd.customerId,
                invoiceStatus: status
            };

        if (invoice.invoiceStatus != 'draft')
            errors.push('فاکتور جاری قابل ویرایش نمیباشد');

        if (errors.length != 0)
            return res.json({isValid: false, errors});

        entity.invoiceLines = cmd.invoiceLines.asEnumerable()
            .select(line => ({
                id: line.id,
                productId: line.productId,
                description: line.description,
                quantity: line.quantity,
                unitPrice: line.unitPrice,
                discount: line.discount,
                vat: line.vat
            }))
            .toArray();

        await(invoiceRepository.updateBatch(id, entity));

        if (status == 'waitForPayment')
            EventEmitter.emit('on-sale-created', await(invoiceRepository.findById(id)), current);

        res.json({isValid: true});

    }))
    .delete(async((req, res) => {
        let invoiceRepository = new InvoiceRepository(req.branchId),
            invoice = await(invoiceRepository.findById(req.params.id)),
            errors = [];

        if (invoice.invoiceStatus != 'draft')
            errors.push('فاکتور جاری قابل حذف نمیباشد');

        if (errors.length != 0)
            return res.json({isValid: false, errors});

        await(invoiceRepository.remove(req.params.id));

        res.json({isValid: true});
    }));

function createInvoice(status, cmd, invoiceRepository) {
    let entity = {
        number: (await(invoiceRepository.saleMaxNumber()).max || 0) + 1,
        date: cmd.date,
        description: cmd.description,
        detailAccountId: cmd.detailAccountId || cmd.customerId,
        invoiceType: 'sale',
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

router.route('/:id/pay')
    .post(async((req, res) => {
        let payment = new Payment(req.branchId, req.cookies['current-period']);

        await(payment.save(req.params.id, req.body));

        res.json({isValid: true});

        EventEmitter.emit('on-invoice-paid', req.params.id, req.branchId);
    }));

router.route('/:id/lines').get(async((req, res) => {
    let invoiceQuery = new InvoiceQuery(req.branchId),
        result = await(invoiceQuery.getAllLines(req.params.id, req.query));

    res.json(result);
}));

router.route('/max/number')
    .get(async((req, res) => {
        let invoiceQuery = new InvoiceQuery(req.branchId),
            result = await(invoiceQuery.maxNumber('sale'));

        res.json(result.max);
    }));

module.exports = router;










