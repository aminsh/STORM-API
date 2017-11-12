"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    config = instanceOf('config'),
    utility = instanceOf('utility'),
    String = utility.String,
    Guid = utility.Guid,
    PersianDate = utility.PersianDate,
    Crypto = instanceOf('Crypto'),
    FiscalPeriodRepository = require('./data').FiscalPeriodRepository,
    InvoiceRepository = require('./data').InvoiceRepository,
    InvoiceQuery = require('../queries').InvoiceQuery,
    SettingRepository = require('./data').SettingsRepository,
    DetailAccount = require('./detailAccount'),
    Product = require('./product');


class InvoiceService {

    constructor(branchId) {

        this.branchId = branchId;
        this.invoiceRepository = new InvoiceRepository(branchId);
        this.fiscalPeriodRepository = new FiscalPeriodRepository(branchId);
        this.detailAccount = new DetailAccount(branchId);
        this.product = new Product(branchId);
        this.settingsRepository = new SettingRepository(branchId);
    }

    validation(entity) {
        let errors = [];

        if (!(entity.invoiceLines && entity.invoiceLines.length !== 0))
            errors.push('ردیف های فاکتور وجود ندارد');
        else
            errors = entity.invoiceLines.asEnumerable().selectMany(this._validateLine.bind(this)).toArray();

        if (String.isNullOrEmpty(entity.detailAccountId))
            errors.push('مشتری نباید خالی باشد');

        return errors;
    }

    _validateLine(line) {
        let errors = [];

        if (Guid.isEmpty(line.productId) && String.isNullOrEmpty(line.description))
            errors.push('کالا یا شرح کالا نباید خالی باشد');

        if (!(line.quantity && line.quantity !== 0))
            errors.push('مقدار نباید خالی یا صفر باشد');

        if (!(line.unitPrice && line.unitPrice !== 0))
            errors.push('قیمت واحد نباید خالی یا صفر باشد');

        return errors;
    }

    mapToEntity(cmd) {

        const detailAccount = this.detailAccount.findPersonByIdOrCreate(cmd.customer);

        return {
            date: cmd.date || PersianDate.current(),
            description: cmd.description,
            title: cmd.title,
            detailAccountId: detailAccount ? detailAccount.id : null,
            orderId: cmd.orderId,
            invoiceLines: cmd.invoiceLines.asEnumerable()
                .select(line => {

                    const product = this.product.findByIdOrCreate(line.product);

                    return {
                        productId: product ? product.id : null,
                        description: line.description || product.title,
                        stockId: line.stockId,
                        quantity: line.quantity,
                        unitPrice: line.unitPrice,
                        discount: line.discount || 0,
                        vat: line.vat || 0
                    }
                })
                .toArray()
        }
    }

    create(cmd) {

        let entity = this.mapToEntity(cmd);

        entity.invoiceType = 'sale';
        entity.invoiceStatus = 'draft';

        entity = this.invoiceRepository.create(entity);

        return new InvoiceQuery(this.branchId).getById(entity.id);
    }

    confirm(id) {

        let entity = this.invoiceRepository.findById(id),
            errors = this.validation(entity);

        if (entity.invoiceStatus !== 'draft')
            errors.push('این فاکتور قبلا تایید شده');

        if (errors.length > 0)
            throw  new ValidationException(errors);


        this.invoiceRepository.update(id, {
            invoiceStatus: 'waitForPayment',
            number: this.invoiceRepository.saleMaxNumber() + 1
        });
    }

    update(id, cmd) {

        const invoice = this.invoiceRepository.findById(id);

        if (invoice.invoiceStatus !== 'draft')
            throw new ValidationException(['فاکتور جاری قابل ویرایش نمیباشد']);

        let entity = this.mapToEntity(cmd);

        this.invoiceRepository.updateBatch(id, entity);
    }

    createReturnSale(cmd) {

        let entity = {
            date: cmd.date,
            description: cmd.description,
            title: cmd.title,
            detailAccountId: cmd.detailAccountId,
            invoiceType: 'returnSale',
            invoiceStatus: cmd.status,
            ofInvoiceId: cmd.ofInvoiceId
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
        };
    }

    setJournal(id, journalId) {
        return this.invoiceRepository.update(id, {journalId});
    }

    getPrintUrl(id) {
        return `${config.url.origin}/print/?token=${Crypto.sign({
            branchId: this.branchId,
            id: id,
            reportId: 700
        })}`;
    }
}

module.exports = InvoiceService;