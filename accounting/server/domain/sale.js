"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    config = instanceOf('config'),
    utility = instanceOf('utility'),
    String = utility.String,
    Guid = utility.Guid,
    PersianDate = utility.PersianDate,
    DomainException = instanceOf('domainException'),
    Crypto = instanceOf('Crypto'),
    translate = require('../services/translateService'),
    FiscalPeriodRepository = require('../data/repository.fiscalPeriod'),
    InvoiceRepository = require('../data/repository.invoice'),
    SettingRepository = require('../data/repository.setting'),
    DetailAccountDomain = require('../domain/detailAccount'),
    ProductDomain = require('../domain/product'),
    InventoryDomain = require('../domain/inventory');


module.exports = class SaleDomain {

    constructor(branchId, fiscalPeriodId) {
        this.branchId = branchId;
        this.invoiceRepository = new InvoiceRepository(branchId);
        this.fiscalPeriodRepository = new FiscalPeriodRepository(branchId);
        this.detailAccountDomain = new DetailAccountDomain(branchId);
        this.productDomain = new ProductDomain(branchId);
        this.inventoryDomain = new InventoryDomain(branchId, fiscalPeriodId);
        this.settingsRepository = new SettingRepository(branchId);

        this.currentFiscalPeriod = await(this.fiscalPeriodRepository.findById(fiscalPeriodId));
    }

    createValidator(cmd) {
        let errors = [],
            temporaryDateIsInPeriodRange =
                cmd.date >= this.currentFiscalPeriod.minDate &&
                cmd.date <= this.currentFiscalPeriod.maxDate;



        if (!temporaryDateIsInPeriodRange)
            errors.push(translate('The temporaryDate is not in current period date range'));

        cmd.customer = this.detailAccountDomain.findPersonByIdOrCreate(cmd.customer);

        if (!cmd.customer)
            errors.push('مشتری نباید خالی باشد');

        if (cmd.number && await(this.isInvoiceNumberDuplicated(cmd.number)))
            errors.push('شماره فاکتور تکراری است');

        let linesErrors = this.createLinesValidator(cmd.invoiceLines);

        if (cmd.status === 'paid') {
            const bankId = await(this.settingsRepository.get()).bankId;
            if (!bankId)
                errors.push('اطلاعات بانک پیش فرض تعریف نشده - ثبت پرداخت برای این فاکتور امکانپذیر نیست')
        }

        errors = errors.concat(linesErrors);

        return errors;
    }

    createLinesValidator(lines) {
        let errors = [];

        if (!(lines && lines.length !== 0))
            errors.push('ردیف های فاکتور وجود ندارد');



        if (errors.length > 0)
            return errors;

        lines.forEach(async.result(e => {
            e.product = this.productDomain.findByIdOrCreate(e.product);

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

        return errors;
    }

    create(cmd) {

        const errors = this.createValidator(cmd);

        if (errors.length > 0)
            throw new DomainException(errors);

        cmd.date = cmd.date || PersianDate.current();
        cmd.detailAccountId = cmd.customer.id;
        cmd.status = (cmd.status === 'confirm' || cmd.status === 'paid')
            ? 'waitForPayment'
            : 'draft';

        let entity = {
            date: cmd.date,
            description: cmd.description,
            detailAccountId: cmd.detailAccountId,
            invoiceType: 'sale',
            invoiceStatus: cmd.status,
            orderId: cmd.orderId
        };

        entity.number = cmd.number || (await(this.invoiceRepository.saleMaxNumber()).max || 0) + 1;

        entity.invoiceLines = cmd.invoiceLines.asEnumerable()
            .select(line => ({
                productId: line.productId,
                description: line.description,
                quantity: line.quantity,
                unitPrice: line.unitPrice,
                discount: line.discount || 0,
                vat: line.vat || 0
            }))
            .toArray();

        await(this.invoiceRepository.create(entity));

        return {
            id: entity.id,
            printUrl: this.getPrintUrl(entity.id)
        };
    }

    isInvoiceNumberDuplicated(number, id) {
        return this.invoiceRepository.findByNumber(number, 'sale', id);
    }

    getPrintUrl(id) {
       return `${config.url.origin}/print/?token=${Crypto.sign({
            branchId: this.branchId,
            id: id,
            reportId: 700
        })}`;
    }
};