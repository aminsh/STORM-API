"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    config = instanceOf('config'),
    utility = instanceOf('utility'),
    String = utility.String,
    Guid = utility.Guid,
    DomainException = instanceOf('domainException'),
    translate = require('../../../services/translateService'),
    FiscalPeriodRepository = require('../../../data/repository.fiscalPeriod'),
    InvoiceRepository = require('../../../data/repository.invoice'),
    SettingRepository = require('../../../data/repository.setting'),
    DetailAccountDomain = require('../../detailAccount'),
    ProductDomain = require('../../product'),
    SaleDomain = require('../../sale');

class CreateSaleValidator {

    constructor(state, command) {

        const branchId = state.branchId,
            fiscalPeriodId = state.fiscalPeriodId;

        this.command = command;

        this.invoiceRepository = new InvoiceRepository(branchId);
        this.fiscalPeriodRepository = new FiscalPeriodRepository(branchId);
        this.detailAccountDomain = new DetailAccountDomain(branchId);
        this.productDomain = new ProductDomain(branchId);
        this.settingsRepository = new SettingRepository(branchId);
        this.saleDomain = new SaleDomain(branchId, fiscalPeriodId);

        this.currentFiscalPeriod = await(this.fiscalPeriodRepository.findById(fiscalPeriodId));
        //this.inventoryControl = instanceOf('inventory.control', {branchId, fiscalPeriodId});

        this.run = async(this.run);
    }

    run() {
        let cmd = this.command,

            errors = [],
            temporaryDateIsInPeriodRange =
                cmd.date >= this.currentFiscalPeriod.minDate &&
                cmd.date <= this.currentFiscalPeriod.maxDate;


        if (!temporaryDateIsInPeriodRange)
            errors.push(translate('The temporaryDate is not in current period date range'));

        cmd.customer = this.detailAccountDomain.findPersonByIdOrCreate(cmd.customer);

        if (!cmd.customer)
            errors.push('مشتری نباید خالی باشد');

        if (cmd.number && await(this.saleDomain.isInvoiceNumberDuplicated(cmd.number)))
            errors.push('شماره فاکتور تکراری است');

        const linesErrors = this.createLinesValidator(cmd.invoiceLines);

        if (cmd.status === 'paid') {
            const bankId = await(this.settingsRepository.get()).bankId;
            if (!bankId)
                errors.push('اطلاعات بانک پیش فرض تعریف نشده - ثبت پرداخت برای این فاکتور امکانپذیر نیست')
        }

        errors = errors.concat(linesErrors);

        //const inventoryErrors = this.inventoryControl.control(cmd.invoiceLines);

        //errors = errors.concat(inventoryErrors);

        if (errors.length > 0)
            throw new DomainException(errors);
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
}

module.exports = CreateSaleValidator;