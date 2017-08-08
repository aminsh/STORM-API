"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    router = require('express').Router(),
    string = require('../utilities/string'),
    translate = require('../services/translateService'),
    InvoiceRepository = require('../data/repository.invoice'),
    ProductRepository = require('../data/repository.product'),
    ProductDomain = require('../domain/product'),
    DetailAccountDomain = require('../domain/detailAccount'),
    InvoiceQuery = require('../queries/query.invoice'),
    EventEmitter = require('../services/shared').service.EventEmitter,
    PaymentQuery = require('../queries/query.payment'),
    FiscalPeriodRepository = require('../data/repository.fiscalPeriod'),
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
        let branchId = req.cookies['branch-id'],
            invoiceRepository = new InvoiceRepository(branchId),
            cmd = req.body,
            detailAccountDomain = new DetailAccountDomain(req.branchId),
            productDomain = new ProductDomain(req.branchId),
            fiscalPeriodRepository = new FiscalPeriodRepository(req.branchId),
            currentFiscalPeriod = await(fiscalPeriodRepository.findById(req.cookies['current-period'])),
            errors = [],
            current = {
                branchId,
                fiscalPeriodId: req.cookies['current-period'],
                userId: req.user.id
            },


            status = cmd.status == 'confirm' ? 'waitForPayment' : 'draft';

        let temporaryDateIsInPeriodRange =
            cmd.date >= currentFiscalPeriod.minDate &&
            cmd.date <= currentFiscalPeriod.maxDate;

        if (!temporaryDateIsInPeriodRange)
            errors.push(translate('The temporaryDate is not in current period date range'));

        if (!(cmd.invoiceLines && cmd.invoiceLines.length != 0))
            errors.push('ردیف های فاکتور وجود ندارد');
        else checkLinesValidation();


        let customer = detailAccountDomain.findPersonByIdOrCreate(cmd.customer);

        if (!customer)
            errors.push('مشتری نباید خالی باشد');

        function checkLinesValidation() {
            cmd.invoiceLines.forEach(async.result(e => {
                e.product = productDomain.findByIdOrCreate(e.product);

                if (e.product) {
                    e.productId = e.product.id;
                    if (!e.description) e.description = e.product.title;
                }

                if (Guid.isEmpty(e.productId) && String.isNullOrEmpty(e.description))
                    errors.push('کالا یا شرح کالا نباید خالی باشد');

                if (!(e.quantity && e.quantity != 0))
                    errors.push('مقدار نباید خالی یا صفر باشد');

                if (!(e.unitPrice && e.unitPrice != 0))
                    errors.push('قیمت واحد نباید خالی یا صفر باشد');
            }));
        }

        if (errors.length != 0)
            return res.json({isValid: false, errors});

        let entity = createInvoice(status, cmd, invoiceRepository),

            result = await(invoiceRepository.create(entity));

        res.json({isValid: true, returnValue: {id: result.id}});

        if (status == 'waitForPayment')
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
        let invoiceRepository = new InvoiceRepository(req.branchId),
            id = req.params.id,
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
                detailAccountId: cmd.detailAccountId,
                invoiceStatus: status
            };

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

        if (status == 'waitForPayment')
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








