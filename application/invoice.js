"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    config = instanceOf('config'),
    utility = instanceOf('utility'),
    EventEmitter = instanceOf('EventEmitter'),
    String = utility.String,
    Guid = utility.Guid,
    PersianDate = utility.PersianDate,
    Crypto = instanceOf('Crypto'),
    FiscalPeriodRepository = require('./data').FiscalPeriodRepository,
    OutputService = require('./inventoryOutput'),
    InvoiceRepository = require('./data').InvoiceRepository,
    SettingRepository = require('./data').SettingsRepository,
    PaymentRepository = require('./data').PaymentRepository,
    DetailAccount = require('./detailAccount'),
    Product = require('./product'),
    PaymentService = require("./payment");


class InvoiceService {

    constructor(branchId, fiscalPeriodId, user) {

        this.args = {branchId, fiscalPeriodId, user};

        this.branchId = branchId;
        this.invoiceRepository = new InvoiceRepository(branchId);
        this.fiscalPeriodRepository = new FiscalPeriodRepository(branchId);
        this.detailAccount = new DetailAccount(branchId);
        this.product = new Product(branchId);
        this.settingsRepository = new SettingRepository(branchId);
        this.outputService = new OutputService(branchId, fiscalPeriodId);
        this.settings = this.settingsRepository.get();
    }


    /**
     * @private
     * @param {Object} entity
     */
    _validate(entity) {
        let errors = [];


        if (!(entity.invoiceLines && entity.invoiceLines.length !== 0))
            errors.push('ردیف های فاکتور وجود ندارد');
        else
            errors = entity.invoiceLines.asEnumerable().selectMany(this._validateLine.bind(this)).toArray();

        if (String.isNullOrEmpty(entity.detailAccountId))
            errors.push('مشتری نباید خالی باشد');

        if (entity.costs.length !== 0 && !entity.costs.asEnumerable().all(e => !String.isNullOrEmpty(e.key) && e.value !== 0))
            errors.push('ردیف های هزینه صحیح نیست');

        if (entity.charges.length !== 0 && !entity.charges.asEnumerable().all(e => !String.isNullOrEmpty(e.key) && e.value !== 0))
            errors.push('ردیف های اضافات صحیح نیست');

        errors = entity.invoiceLines.asEnumerable()
            .selectMany(this._validateLine.bind(this))
            .concat(errors)
            .toArray();

        return errors;
    }

    /**
     * @private
     * @param {Object} line
     */

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

    /**
     * @private
     * @param {string} id
     */
    _changeStatusIfPaidIsCompleted(id) {

        let invoice = await(this.invoiceRepository.findById(id)),
            sumPayments = new PaymentRepository(this.branchId).getBySumAmountByInvoiceId(invoice.id).sum || 0,

            totalPrice = invoice.invoiceLines.asEnumerable()
                .sum(e => (e.unitPrice * e.quantity) - e.discount + e.vat);

        if (sumPayments >= totalPrice)
            this.invoiceRepository.update(invoiceId, {invoiceStatus: 'paid'});
    }

    mapToEntity(cmd) {

        const detailAccount = this.detailAccount.findPersonByIdOrCreate(cmd.customer);

        return {
            id: cmd.id,
            date: cmd.date || PersianDate.current(),
            description: cmd.description,
            title: cmd.title,
            detailAccountId: detailAccount ? detailAccount.id : null,
            orderId: cmd.orderId,
            costs: this._mapCostAndCharge(cmd.costs),
            charges: this._mapCostAndCharge(cmd.charges),
            bankReceiptNumber: cmd.bankReceiptNumber,
            invoiceLines: cmd.invoiceLines.asEnumerable()
                .select(line => {

                    const product = this.product.findByIdOrCreate(line.product);

                    return {
                        id: line.id,
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

    _mapCostAndCharge(data) {

        if (!data)
            return [];

        if (Array.isArray(data))
            return data.asEnumerable().select(e => ({key: e.key, value: e.value || 0})).toArray();

        return Object.keys(data).asEnumerable()
            .select(key => ({
                key,
                value: data[key]
            }))
            .toArray();

    }

    _mapToData(entity) {
        let data = Object.assign({}, entity, {
            costs: JSON.stringify(entity.costs),
            charges: JSON.stringify(entity.charges),
            custom: {bankReceiptNumber: entity.bankReceiptNumber}
        });

        delete data.bankReceiptNumber;

        return data;
    }

    _createOutput(entity) {

        if (!this.settings.canControlInventory)
            return;

        let inventoryIds = this.outputService.createForInvoice(entity);

        return inventoryIds;
    }

    _setToOutput(id, inventoryIds) {

        if (!this.settings.canControlInventory)
            return;

        this.outputService.setInvoice(inventoryIds, id);
    }

    create(cmd) {

        let entity = this.mapToEntity(cmd),
            errors = this._validate(entity),
            inventoryIds;

        if (errors.length > 0)
            throw new ValidationException(errors);

        if (cmd.status && cmd.status !== 'draft')
            inventoryIds = this._createOutput(entity);

        entity.number = this.invoiceRepository.maxNumber('sale') + 1;
        entity.invoiceType = 'sale';
        entity.invoiceStatus = !cmd.status || cmd.status === 'draft' ? 'draft' : 'waitForPayment';
        entity.inventoryIds = JSON.stringify(inventoryIds);

        entity = this.invoiceRepository.create(this._mapToData(entity));

        if (inventoryIds)
            this._setToOutput(entity.id, inventoryIds);

        EventEmitter.emit("onInvoiceCreated", entity.id, this.args);

        return entity.id;
    }

    confirm(id, status) {

        let entity = this.invoiceRepository.findById(id),
            errors = [];

        if (entity.invoiceStatus !== 'draft')
            errors.push('این فاکتور قبلا تایید شده');

        if(!['confirm', 'waitForPayment', 'paid'].includes(status))
            errors.push('وضعیت صحیح نیست');

        if (errors.length > 0)
            throw  new ValidationException(errors);

        let inventoryIds = this._createOutput(entity);

        if (inventoryIds)
            this._setToOutput(entity.id, inventoryIds);

        let data = {
            inventoryIds: JSON.stringify(inventoryIds),
            invoiceStatus: status === 'confirm' ? 'waitForPayment' : status
        };

        this.invoiceRepository.update(id, data);

        EventEmitter.emit("onInvoiceConfirmed", entity.id, this.args);
    }

    update(id, cmd) {
        let inventoryIds;

        const invoice = this.invoiceRepository.findById(id);

        if (invoice.invoiceStatus !== 'draft')
            throw new ValidationException(['فاکتور جاری قابل ویرایش نمیباشد']);

        let entity = this.mapToEntity(cmd),
            errors = this._validate(entity);

        if (errors.length > 0)
            throw new ValidationException(errors);

        if (cmd.status && cmd.status !== 'draft')
            inventoryIds = this._createOutput(entity);

        if (inventoryIds)
            this._setToOutput(id, inventoryIds);

        entity.inventoryIds = JSON.stringify(inventoryIds);
        entity.invoiceStatus = cmd.status !== 'draft' ? 'waitForPayment' : 'draft';

        this.invoiceRepository.updateBatch(id, this._mapToData(entity));

        EventEmitter.emit("onInvoiceEdited", id, this.args);
    }

    remove(id) {
        const invoice = this.invoiceRepository.findById(id);

        if (invoice.invoiceStatus !== 'draft')
            throw new ValidationException(['فاکتور جاری قابل حذف نمیباشد']);

        this.invoiceRepository.remove(id);
    }

    createReturnSale(cmd) {

        let entity = this.mapToEntity(cmd),
            errors = this._validate(entity);

        if (errors.length > 0)
            throw new ValidationException(errors);

        entity.invoiceType = 'returnSale';
        entity.ofInvoiceId = cmd.ofInvoiceId;
        entity.number = this.invoiceRepository.maxNumber('returnSale') + 1;

        this.invoiceRepository.create(entity);

        return entity.id;
    }

    updateReturnSale(id, cmd) {

        let entity = this.mapToEntity(cmd),
            errors = this._validate(entity);

        if (errors.length > 0)
            throw new ValidationException(errors);

        this.invoiceRepository.updateBatch(id, entity);
    }

    setJournal(id, journalId) {
        return this.invoiceRepository.update(id, {journalId});
    }

    pay(id, payments) {
        const paymentService = new PaymentService(this.branchId),

            paymentIds = paymentService.create(payments, 'receive');

        paymentService.setInvoiceForAll(paymentIds, id);

        this._changeStatusIfPaidIsCompleted(id);
    }
}

module.exports = InvoiceService;
