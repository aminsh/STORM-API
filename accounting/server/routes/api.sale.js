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
    SettingRepository = require('../data/repository.setting'),
    EventEmitter = require('../services/shared').service.EventEmitter,
    Crypto = require('../services/shared').service.Crypto,
    config = instanceOf('config'),
    md5 = require('md5'),
    Email = instanceOf('Email'),
    render = instanceOf('htmlRender').renderFile,
    branchRepository = instanceOf('branch.repository');


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
            fiscalPeriodId =req.fiscalPeriodId,
            saleDomain = new SaleDomain(req.branchId, req.fiscalPeriodId),
            detailAccountDomain = new DetailAccountDomain(req.branchId),
            productDomain = new ProductDomain(req.branchId),
            settingRepository = new SettingRepository(branchId),
            fiscalPeriodRepository = new FiscalPeriodRepository(req.branchId),
            currentFiscalPeriod = await(fiscalPeriodRepository.findById(req.fiscalPeriodId)),

            cmd = req.body,
            errors = [],

            settings = await(settingRepository.get()),
            inventoryControl = instanceOf('inventory.control', branchId, fiscalPeriodId, settings),
            bankId,
            temporaryDateIsInPeriodRange = true;


        if (!String.isNullOrEmpty(cmd.date))
            temporaryDateIsInPeriodRange =
                cmd.date >= currentFiscalPeriod.minDate &&
                cmd.date <= currentFiscalPeriod.maxDate;

        if (!temporaryDateIsInPeriodRange)
            errors.push(translate('The temporaryDate is not in current period date range'));

        if (!(cmd.invoiceLines && cmd.invoiceLines.length !== 0))
            errors.push('ردیف های فاکتور وجود ندارد');
        else checkLinesValidation();

        let customer = detailAccountDomain.findPersonByIdOrCreate(cmd.customer);

        if (!customer)
            errors.push('مشتری نباید خالی باشد');

        if (cmd.number && await(saleDomain.isInvoiceNumberDuplicated(cmd.number)))
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

        if (cmd.status === 'paid') {
            bankId = settings.bankId;
            if (!bankId)
                errors.push('اطلاعات بانک پیش فرض تعریف نشده - ثبت پرداخت برای این فاکتور امکانپذیر نیست')
        }


        if (errors.length !== 0)
            return res.json({isValid: false, errors});

        errors = await(inventoryControl.control(cmd));

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

        const sale = saleDomain.create(cmd);

        res.json({isValid: true, returnValue: sale});

        if (status === 'waitForPayment')
            EventEmitter.emit('on-sale-created', sale, current);

        if (cmd.status === 'paid') {

            setTimeout(async(() => {
                let paymentRepository = new PaymentRepository(req.branchId),

                    bankPayment = {
                        date: cmd.date,
                        amount: cmd.invoiceLines.asEnumerable().sum(e => (e.unitPrice * e.quantity) - e.discount + e.vat),
                        paymentType: 'receipt',
                        invoiceId: sale.id
                    };

                await(paymentRepository.create(bankPayment));

                bankPayment.bankId = bankId;
                EventEmitter.emit('on-receive-created',
                    [bankPayment],
                    sale.id,
                    {branchId: req.branchId, fiscalPeriodId: req.fiscalPeriodId});

                EventEmitter.emit('on-invoice-paid', sale.id, req.branchId);
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

        if (cmd.number && await(saleDomain.isInvoiceNumberDuplicated(cmd.number, id)))
            errors.push('شماره فاکتور تکراری است');

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

        if (status == 'waitForPayment')
            EventEmitter.emit('on-sale-created', await(invoiceRepository.findById(id)), current);

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
            result = await(invoiceQuery.maxNumber('sale'));

        res.json(result.max);
    }));

router.route('/:invoiceId/send-email')
    .post(async((req, res) => {

        let invoiceQuery,
            userEmail,
            invoiceId,
            invoice,
            branchId,
            branch,
            token,
            link;

        // Initialize Variables
        try {

            invoiceQuery = new InvoiceQuery(req.branchId);
            userEmail = req.body.email;
            invoiceId = req.params.invoiceId;
            invoice = await(invoiceQuery.getById(invoiceId));
            branchId = req.branchId;
            branch = await(branchRepository.getById(branchId));
            token = Crypto.sign({
                branchId: branchId,
                invoiceId: invoiceId
            });
            link = `${config.url.origin}/invoice/token/${token}`;

        } catch (err) {
            console.log(err);
            console.log("Invoice ID: " + req.params.invoiceId);
            console.log(`> ERROR: Wrong invoice id`);
            return res.json({isValid: false});
        }

        // Send Email
        try {

            let html = await(render("/accounting/server/templates/send.invoice.template.ejs", {
                invoiceUrl: link,
                branchLogo: branch.logo,
                branchName: branch.name,
                date: invoice.date,
                number: invoice.number,
                detailAccountDisplay: invoice.detailAccountDisplay
            }));

            await(Email.send({
                from: config.email.from,
                to: userEmail,
                subject: `فاکتور شماره ی ${invoice.number} از طرف ${branch.name}`,
                html: html
            }));

            return res.json({isValid: true});

        } catch (err) {
            console.log(`Error: The email DIDN'T send successfuly !!! `, err);
            return res.json({isValid: false});
        }

    }));

module.exports = router;










