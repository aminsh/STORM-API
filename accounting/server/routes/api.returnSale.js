"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    FiscalPeriodRepository = require('../data/repository.fiscalPeriod'),
    router = require('express').Router(),
    String = require('../utilities/string'),
    translate = require('../services/translateService'),
    Guid = require('../services/shared').utility.Guid,
    PersianDate = require('../services/persianDateService'),
    SaleDomain = require('../domain/sale'),
    DetailAccountDomain = require('../domain/detailAccount'),
    ProductDomain = require('../domain/product'),
    InvoiceRepository = require('../data/repository.invoice'),
    InvoiceQuery = require('../queries/query.invoice'),
    PaymentRepository = require('../data/repository.payment'),
    PaymentQuery = require('../queries/query.payment'),
    EventEmitter = require('../services/shared').service.EventEmitter,
    config = instanceOf('config'),
    Common = instanceOf('utility').Common;

router.route('/')
    .get(async((req, res) => {
        let invoiceQuery = new InvoiceQuery(req.branchId),
            result = await(invoiceQuery.getAll(req.query, 'returnSale'));

        res.json(result);
    }))

    .post(async((req, res) => {

        let branchId = req.branchId,
            saleDomain = new SaleDomain(req.branchId, req.fiscalPeriodId),
            detailAccountDomain = new DetailAccountDomain(req.branchId),
            invoiceRepository = new InvoiceRepository(branchId),
            productDomain = new ProductDomain(req.branchId),
            fiscalPeriodRepository = new FiscalPeriodRepository(req.branchId),
            currentFiscalPeriod = await(fiscalPeriodRepository.findById(req.fiscalPeriodId)),
            cmd = req.body,
            errors = [],

            temporaryDateIsInPeriodRange = true;


        if (!String.isNullOrEmpty(cmd.date))
            temporaryDateIsInPeriodRange =
                cmd.date >= currentFiscalPeriod.minDate &&
                cmd.date <= currentFiscalPeriod.maxDate;

        if (!temporaryDateIsInPeriodRange)
            errors.push(translate('The temporaryDate is not in current period date range'));

        if(!cmd.ofInvoiceId)
            errors.push("فاکتور فروش وجود ندارد");

        if(!cmd.stockId)
            errors.push('انبار وجود ندارد');

        if (!(cmd.invoiceLines && cmd.invoiceLines.length !== 0))
            errors.push('ردیف های فاکتور وجود ندارد');
        else checkLinesValidation();

        let customer = detailAccountDomain.findPersonByIdOrCreate(cmd.customer);

        if (!customer)
            errors.push('مشتری نباید خالی باشد');

        if (cmd.number && await(saleDomain.isInvoiceNumberDuplicated(cmd.number, null, 'returnSale')))
            errors.push('شماره فاکتور تکراری است');

        function checkLinesValidation() {
            cmd.invoiceLines.forEach(async.result(e => {
                e.product = productDomain.findByIdOrCreate(e.product);

                if (e.product) {
                    e.productId = e.product.id;
                    if (!e.description) e.description = e.product.title;
                }

                if (Guid.isEmpty(e.productId) && String.isNullOrEmpty(e.description))
                    errors.push('کالا یا شرح کالا نباید خالی باشد');

                if (!(e.quantity && e.quantity !== 0))
                    errors.push('مقدار نباید خالی یا صفر باشد');

                if (!(e.unitPrice && e.unitPrice !== 0))
                    errors.push('قیمت واحد نباید خالی یا صفر باشد');
            }));
        }

        if (errors.length !== 0)
            return res.json({isValid: false, errors});

        let current = {
                branchId,
                fiscalPeriodId: req.fiscalPeriodId,
                userId: req.user.id
            },

            status = (cmd.status === 'confirm' || cmd.status === 'paid')
                ? 'waitForPayment'
                : 'draft';

        cmd.date = cmd.date || PersianDate.current();
        cmd.detailAccountId = customer.id;
        cmd.status = status;

        const result = saleDomain.createReturnSale(cmd);

        res.json({isValid: true, returnValue: result});

        await(Common.waitFor(1000));

        let returnSale = await(invoiceRepository.findById(result.id));
        returnSale.stockId = cmd.stockId;

        if (status === 'waitForPayment')
            EventEmitter.emit('on-returnSale-created', returnSale, current);
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

        const returnSale = await(invoiceRepository.findById(id));

        res.json({isValid: true});

        EventEmitter.emit('on-returnSale-created', returnSale, current);
    }));

router.route('/:id')
    .get(async((req, res) => {
        let invoiceQuery = new InvoiceQuery(req.branchId),
            result = await(invoiceQuery.getById(req.params.id));

        res.json(result);
    }))
    .put(async((req, res) => {
        let invoiceRepository = new InvoiceRepository(req.branchId),
            saleDomain = new SaleDomain(req.branchId),
            id = req.params.id,
            errors = [],
            invoice = await(invoiceRepository.findById(id)),
            cmd = req.body,
            status = cmd.status == 'confirm' ? 'waitForPayment' : 'draft',

            current = {
                branchId: req.branchId,
                fiscalPeriodId: req.cookies['current-period'],
                userId: req.user.id
            };

        if (cmd.number && await(saleDomain.isInvoiceNumberDuplicated(cmd.number, id, 'returnSale')))
            errors.push('شماره فاکتور تکراری است');

        if(!cmd.ofInvoiceId)
            errors.push("فاکتور فروش وجود ندارد");

        if(!cmd.stockId)
            errors.push('انبار وجود ندارد');

        let entity = {
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

        let returnSale = await(invoiceRepository.findById(id));

        returnSale.stockId = cmd.stockId;

        if (status == 'waitForPayment')
            EventEmitter.emit('on-returnSale-created', await(invoiceRepository.findById(id)), current);

        res.json({isValid: true});

    }))
    .delete(async((req, res) => {
        let invoiceRepository = new InvoiceRepository(req.branchId),
            invoice = await(invoiceRepository.findById(req.params.id)),
            errors = [];

        if (invoice.invoiceStatus != 'draft')
            errors.push('فاکتور جاری تایید شده - نمیتوانید آنرا حذف کنید');

        if (errors.length != 0)
            return res.json({isValid: false, errors});

        await(invoiceRepository.remove(req.params.id));

        res.json({isValid: true});
    }));

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
    let invoiceQuery = new InvoiceQuery(req.branchId),
        result = await(invoiceQuery.getAllLines(req.params.id, req.query));

    res.json(result);
}));

router.route('/max/number')
    .get(async((req, res) => {
        let invoiceQuery = new InvoiceQuery(req.branchId),
            result = await(invoiceQuery.maxNumber('returnSale'));

        res.json(result.max);
    }));


module.exports = router;










