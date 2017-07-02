"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    router = require('express').Router(),
    String = require('../utilities/string'),
    Guid = require('../services/shared').utility.Guid,
    translate = require('../services/translateService'),
    InvoiceRepository = require('../data/repository.invoice'),
    ProductRepository = require('../data/repository.product'),
    InvoiceQuery = require('../queries/query.invoice'),
    PaymentRepository = require('../data/repository.payment'),
    PaymentQuery = require('../queries/query.payment'),
    SettingRepository = require('../data/repository.setting'),
    EventEmitter = require('../services/shared').service.EventEmitter;

router.route('/summary')
    .get(async((req, res) => {
        let invoiceQuery = new InvoiceQuery(req.branchId),
            result = await(invoiceQuery.getSummary(req.fiscalPeriodId, 'sale'));

        res.json(result);
    }));

router.route('/summary/by-month').get(async((req, res) => {
    let invoiceQuery = new InvoiceQuery(req.branchId),
        result = await(invoiceQuery.getTotalByMonth(req.fiscalPeriodId, 'sale'));

    res.json(result);
}));

router.route('/summary/by-product').get(async((req, res) => {
    let invoiceQuery = new InvoiceQuery(req.branchId),
        result = await(invoiceQuery.getTotalByProduct(req.fiscalPeriodId, 'sale'));

    res.json(result);
}));


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
            settingRepository = new SettingRepository(branchId),
            cmd = req.body,
            errors = [],

            bankId;

        if (!(cmd.invoiceLines && cmd.invoiceLines.length != 0))
            errors.push('ردیف های فاکتور وجود ندارد');
        else checkLinesValidation();

        if (String.isNullOrEmpty(cmd.date))
            errors.push('تاریخ نباید خالی باشد');

        if (Guid.isEmpty(cmd.detailAccountId) && Guid.isEmpty(cmd.customerId))
            errors.push('مشتری نباید خالی باشد');

        function checkLinesValidation() {
            cmd.invoiceLines.forEach(e => {
                if (Guid.isEmpty(e.productId) && String.isNullOrEmpty(e.description))
                    errors.push('کالا یا شرح کالا نباید خالی باشد');

                if (!(e.quantity && e.quantity != 0))
                    errors.push('مقدار نباید خالی یا صفر باشد')

                if (!(e.unitPrice && e.unitPrice != 0))
                    errors.push('قیمت واحد نباید خالی یا صفر باشد')
            });
        }

        if (cmd.status == 'paid') {
            bankId = await(settingRepository.get()).bankId;
            if (!bankId)
                errors.push('اطلاعات بانک پیش فرض تعریف نشده - ثبت پرداخت برای این فاکتور امکانپذیر نیست')
        }

        if (errors.length != 0)
            return res.json({isValid: false, errors});

        let current = {
                branchId,
                fiscalPeriodId: req.fiscalPeriodId,
                userId: req.user.id
            },

            status = (cmd.status == 'confirm' || cmd.status == 'paid')
                ? 'waitForPayment'
                : 'draft',

            entity = createInvoice(
                status,
                cmd,
                invoiceRepository,
                productRepository),

            result = await(invoiceRepository.create(entity));

        res.json({isValid: true, returnValue: {id: result.id}});

        if (status == 'waitForPayment')
            EventEmitter.emit('on-sale-created', result, current);

        if (cmd.status == 'paid') {

            setTimeout(async(() => {
                let paymentRepository = new PaymentRepository(req.branchId),

                    bankPayment = {
                        date: cmd.date,
                        amount: cmd.invoiceLines.asEnumerable().sum(e => (e.unitPrice * e.quantity) - e.discount + e.vat),
                        paymentType: 'receipt',
                        invoiceId: result.id
                    };

                await(paymentRepository.create(bankPayment));

                bankPayment.bankId = bankId;
                EventEmitter.emit('on-receive-created',
                    [bankPayment],
                    result.id,
                    {branchId: req.branchId, fiscalPeriodId: req.fiscalPeriodId});

                EventEmitter.emit('on-invoice-paid', result.id, req.branchId);
            }), 1000);
        }
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

function createInvoice(status, cmd, invoiceRepository, productReposittory) {
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
            description: line.description || await(productReposittory.findById(line.productId)).title,
            quantity: line.quantity,
            unitPrice: line.unitPrice,
            discount: line.discount || 0,
            vat: line.vat || 0
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
                receiveOrPay: 'receive',
                chequeStatus: e.paymentType == 'cheque' ? 'normal' : null
            };

            await(paymentRepository.create(entity));

            e.id = entity.id;
        });

        res.json({isValid: true});

        EventEmitter.emit('on-receive-created',
            payments,
            id,
            {branchId: req.branchId, fiscalPeriodId: req.fiscalPeriodId});

        EventEmitter.emit('on-invoice-paid', req.params.id, req.branchId);
    }));

router.route('/:id/payments').get(async((req, res)=> {
    let paymentQuery = new PaymentQuery(req.branchId),
        result = await(paymentQuery.getPeymentsByInvoiceId(req.params.id));

    res.json(result);
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










