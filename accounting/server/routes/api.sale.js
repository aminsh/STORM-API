"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    InvoiceService = ApplicationService.InvoiceService,
    OutputService = ApplicationService.InventoryOutputService,
    JournalService = ApplicationService.JournalService,
    FiscalPeriodRepository = require('../data/repository.fiscalPeriod'),
    router = require('express').Router(),
    String = require('../utilities/string'),
    translate = require('../services/translateService'),
    Guid = instanceOf('utility').Guid,
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

        let cmd = req.body,
            serviceId = 1;

        try {

            /* create invoice */
            serviceId = Guid.new();

            EventEmitter.emit('onServiceStarted', serviceId, {command: cmd, state: req, service: 'createInvoice'});

            const invoiceService = new InvoiceService(req.branchId),
                invoice = invoiceService.create(cmd);

            EventEmitter.emit('onServiceSucceed', serviceId, invoice);

            if (!['confirm', 'paid'].includes(cmd.status))
                return res.json({isValid: true, returnValue: invoice});

            /* create output */
            serviceId = Guid.new();

            EventEmitter.emit('onServiceStarted', serviceId, {
                command: cmd,
                state: req,
                service: 'createInventoryOutputForInvoice'
            });

            const outputService = new OutputService(req.branchId, req.fiscalPeriodId),
                outputId = outputService.createForInvoice(invoice);

            EventEmitter.emit('onServiceSucceed', serviceId, outputId);

            /* confirm invoice */
            serviceId = Guid.new();

            EventEmitter.emit('onServiceStarted', serviceId, {command: cmd, state: req, service: 'confirmInvoice'});

            invoiceService.confirm(invoice.id);

            EventEmitter.emit('onServiceSucceed', serviceId);

            /* response */
            res.json({isValid: true, returnValue: invoice});

            serviceId = Guid.new();

            EventEmitter.emit('onServiceStarted', serviceId, {
                command: cmd,
                state: req,
                service: 'setInvoiceToInventory'
            });

            outputService.setInvoice(outputId, invoice.id);

            EventEmitter.emit('onServiceSucceed', serviceId);


            serviceId = Guid.new();

            EventEmitter.emit('onServiceStarted', serviceId, {
                command: cmd,
                state: req,
                service: 'journalGenerateForInvoice'
            });

            const journalId = new JournalService(req.branchId, req.fiscalPeriodId, req.user)
                .generateForInvoice(invoice.id);

            invoiceService.setJournal(invoice.id, journalId);

            EventEmitter.emit('onServiceSucceed', serviceId, journalId);

        }
        catch (e) {

            EventEmitter.emit('onServiceFailed', serviceId, e);

            const errors = e instanceof ValidationException
                ? e.errors
                : ['internal errors'];

            res['_headerSent'] === false && res.json({isValid: false, errors});

            console.log(e);
        }

    }));

router.route('/:id/confirm')
    .post(async((req, res) => {

        let branchId = req.branchId,
            fiscalPeriodId = req.fiscalPeriodId,
            invoiceRepository = new InvoiceRepository(branchId),
            cmd = req.body,
            entity = {invoiceStatus: 'waitForPayment'},
            id = req.params.id,
            invoice = await(invoiceRepository.findById(id)),
            settingRepository = new SettingRepository(branchId),
            errors = [],
            current = {
                branchId,
                fiscalPeriodId: req.fiscalPeriodId,
                userId: req.user.id
            },
            settings = await(settingRepository.get()),
            sale = Object.assign(invoice, cmd);

        if (invoice.invoiceStatus !== 'draft')
            errors.push('این فاکتور قبلا تایید شده');

        if (settings.canControlInventory)
            errors = await(instanceOf('inventory.control',
                branchId, fiscalPeriodId, settings).control(sale));

        if (errors.length !== 0)
            return res.json({isValid: false, errors});

        await(invoiceRepository.update(id, entity));

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

        const invoiceService = new InvoiceService(req.branchId);

        invoiceService.update(cmd);

        //invoice = await(invoiceRepository.findById(id));

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










