"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    router = require('express').Router(),
    InvoiceRepository = require('../data/repository.invoice'),
    ProductDomain = require('../domain/product'),
    DetailAccountDomain = require('../domain/detailAccount'),
    InvoiceQuery = require('../queries/query.invoice'),
    EventEmitter = require('../services/shared').service.EventEmitter,
    PaymentQuery = require('../queries/query.payment'),
    Guid = require('../services/shared').utility.Guid,
    PaymentRepository = require('../data/repository.payment');

router.route('/summary')
    .get(async((req, res) => {
        let invoiceQuery = new InvoiceQuery(req.branchId),
            result = await(invoiceQuery.getSummary(req.fiscalPeriodId, 'purchase'));

        res.json(result);
    }));

router.route('/')
    .get(async((req, res) => {
        let invoiceQuery = new InvoiceQuery(req.branchId),
            result = await(invoiceQuery.getAll(req.query, 'purchase'));

        res.json(result);
    }))
    .post(async((req, res) => {
        let branchId = req.branchId,
            fiscalPeriodId = req.fiscalPeriodId,
            invoiceRepository = new InvoiceRepository(branchId),
            cmd = req.body,
            detailAccountDomain = new DetailAccountDomain(req.branchId),
            productDomain = new ProductDomain(req.branchId),
            errors = [],
            current = {
                branchId,
                fiscalPeriodId,
                userId: req.user.id
            },


            status = cmd.status === 'confirm' ? 'waitForPayment' : 'draft';

        if (!(cmd.invoiceLines && cmd.invoiceLines.length !== 0))
            errors.push('ردیف های فاکتور وجود ندارد');
        else checkLinesValidation();


        let vendor = detailAccountDomain.findPersonByIdOrCreate(cmd.vendor);

        if (!vendor)
            errors.push('فروشنده نباید خالی باشد');

        if (!cmd.stockId)
            errors.push('انبار را مشخص کنید');

        function checkLinesValidation() {
            cmd.invoiceLines.forEach(async.result(e => {
                e.product = productDomain.findByIdOrCreate(e.product);

                if (e.product) {
                    e.productId = e.product.id;
                    if (!e.description) e.description = e.product.title;
                }

                if (Guid.isEmpty(e.productId))
                    errors.push('کالا یانباید خالی باشد');

                if (!(e.quantity && e.quantity !== 0))
                    errors.push('مقدار نباید خالی یا صفر باشد');

                if (!(e.unitPrice && e.unitPrice !== 0))
                    errors.push('قیمت واحد نباید خالی یا صفر باشد');
            }));
        }

        if (errors.length !== 0)
            return res.json({isValid: false, errors});

        let entity = createInvoice(status, cmd, invoiceRepository),

            result = await(invoiceRepository.create(entity));

        res.json({isValid: true, returnValue: {id: result.id}});

        if (status === 'waitForPayment')
            EventEmitter.emit('on-purchase-created',
                {purchaseId: result.id, stockId: cmd.stockId},
                current);
    }));

router.route('/:id/confirm')
    .post(async((req, res) => {

        let branchId = req.branchId,
            invoiceRepository = new InvoiceRepository(branchId),
            entity = {statue: 'waitForPayment'},
            id = req.params.id,
            cmd = req.body,
            errors = [],

            current = {
                branchId,
                fiscalPeriodId: req.fiscalPeriodId,
                userId: req.user.id
            };

        if (!cmd.stockId)
            errors.push('انبار را مشخص کنید');

        if (errors.length !== 0)
            return res.json({isValid: false, errors});

        await(invoiceRepository.update(id, entity));

        res.json({isValid: true});

        EventEmitter.emit('on-purchase-created', {purchaseId: id, stockId: cmd.stockId}, current);
    }));

router.route('/:id')
    .get(async((req, res) => {
        let invoiceQuery = new InvoiceQuery(req.cookies['branch-id']),
            result = await(invoiceQuery.getById(req.params.id));

        res.json(result);
    }))
    .put(async((req, res) => {
        let invoiceRepository = new InvoiceRepository(req.branchId),
            id = req.params.id,
            cmd = req.body,
            errors = [],
            status = cmd.status === 'confirm' ? 'waitForPayment' : 'draft',

            current = {
                branchId: req.branchId,
                fiscalPeriodId: req.cookies['current-period'],
                userId: req.user.id
            },

            entity = {
                date: cmd.date,
                description: cmd.description,
                detailAccountId: cmd.detailAccountId,
                invoiceStatus: status
            };

        if (!cmd.stockId)
            errors.push('انبار را مشخص کنید');

        if(errors.length !== 0)
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

        res.json({isValid: true});

        if (status === 'waitForPayment')
            EventEmitter.emit('on-purchase-created', await(invoiceRepository.findById(id)), current);

    }))
    .delete(async((req, res) => {
        let invoiceRepository = new InvoiceRepository(req.cookies['branch-id']);

        await(invoiceRepository.remove(req.params.id));

        res.json({isValid: true});
    }));

function createInvoice(status, cmd, invoiceRepository) {
    let entity = {
        number: (await(invoiceRepository.purchaseMaxNumber()).max || 0) + 1,
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

router.route('/:id/pay')
    .post(async((req, res) => {
        let payments = req.body,
            id = req.params.id,

            paymentRepository = new PaymentRepository(req.branchId);

        payments.forEach(e => {

            let entity = {
                number: e.number,
                date: e.date,
                invoiceId: id,
                amount: e.amount,
                paymentType: e.paymentType,
                bankName: e.bankName,
                bankBranch: e.bankBranch,
                receiveOrPay: 'pay',
                chequeStatus: e.paymentType == 'cheque' ? 'normal' : null
            };

            await(paymentRepository.create(entity));

            e.id = entity.id;
        });

        res.json({isValid: true});

        EventEmitter.emit('on-pay-created',
            payments,
            id,
            {branchId: req.branchId, fiscalPeriodId: req.fiscalPeriodId});

        EventEmitter.emit('on-invoice-paid', req.params.id, req.branchId);
    }));

router.route('/:id/payments').get(async((req, res) => {
    let paymentQuery = new PaymentQuery(req.branchId),
        result = await(paymentQuery.getPeymentsByInvoiceId(req.params.id));

    res.json(result);
}));


router.route('/:id/lines').get(async((req, res) => {
    let invoiceQuery = new InvoiceQuery(req.cookies['branch-id']),
        result = await(invoiceQuery.getAllLines(req.params.id, req.query));

    res.json(result);
}));

router.route('/max/number')
    .get(async((req, res) => {
        let invoiceQuery = new InvoiceQuery(req.cookies['branch-id']),
            result = await(invoiceQuery.maxNumber('purchase'));

        res.json(result.max);
    }));

module.exports = router;








