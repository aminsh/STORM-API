"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    config = instanceOf('config'),
    utility = instanceOf('utility'),
    String = utility.String,
    Guid = utility.Guid,
    PersianDate = utility.PersianDate,
    FiscalPeriodRepository = require('./data').FiscalPeriodRepository,
    InvoiceRepository = require('./data').InvoiceRepository,
    SettingRepository = require('./data').SettingsRepository,
    PaymentRepository = require('./data').PaymentRepository,
    DetailAccount = require('./detailAccount'),
    Product = require('./product'),
    InputPurchaseService = require('./inputPurchase'),
    PaymentService = require("./payment");


class InvoiceService {

    constructor(branchId, fiscalPeriodId) {

        this.branchId = branchId;
        this.fiscalPeriodId = fiscalPeriodId;

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
            errors.push('فروشنده نباید خالی باشد');

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

        const detailAccount = this.detailAccount.findPersonByIdOrCreate(cmd.vendor);

        return {
            id: cmd.id,
            date: cmd.date || PersianDate.current(),
            invoiceStatus: cmd.status || 'draft',
            description: cmd.description,
            title: cmd.title,
            inventoryIds: cmd.inventoryIds,
            charges: this._mapCostAndCharge(cmd.charges),
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

    /**
     * @private
     */
    _setForInventoryPurchase(entity) {
        const inputPurchaseService = new InputPurchaseService(this.branchId, this.fiscalPeriodId);

        let inventoryIds = entity.inventoryIds && entity.inventoryIds.length > 0
            ? entity.inventoryIds
            : inputPurchaseService.create(entity);

        if (!(inventoryIds && inventoryIds.length > 0))
            return;

        inputPurchaseService.inputService.setInvoice(inventoryIds, entity.id);

        if (!(entity.inventoryIds && entity.inventoryIds.length > 0))
            this.invoiceRepository.update(entity.id, {inventoryIds: JSON.stringify(inventoryIds)});

        inputPurchaseService.setPrice(inventoryIds, entity.id);
    }

    /**
     * @private
     */
    _changeStatusIfPaidIsCompleted(id) {

        let invoice = await(this.invoiceRepository.findById(id)),
            sumPayments = new PaymentRepository(this.branchId).getBySumAmountByInvoiceId(invoiceId).sum || 0,

            totalPrice = invoice.invoiceLines.asEnumerable()
                .sum(e => (e.unitPrice * e.quantity) - e.discount + e.vat);

        if (sumPayments >= totalPrice)
            this.invoiceRepository.update(invoiceId, {invoiceStatus: 'paid'});
    }

    _mapToData(entity) {

        return Object.assign({}, entity, {
            charges: JSON.stringify(entity.charges),
            inventoryIds: JSON.stringify(entity.inventoryIds)
        });
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

    create(cmd) {

        let entity = this.mapToEntity(cmd),
            errors = this.validation(entity);

        if (errors.length > 0)
            throw new ValidationException(errors);

        entity.number = this.invoiceRepository.maxNumber('purchase') + 1;
        entity.invoiceType = 'purchase';
        entity.invoiceStatus = cmd.status !== 'draft' ? 'waitForPayment' : 'draft';

        let data = this._mapToData(entity);
        this.invoiceRepository.create(data);

        entity.id = data.id;

        if (entity.invoiceStatus !== 'draft')
            this._setForInventoryPurchase(entity);

        return entity.id;
    }

    confirm(id) {

        let entity = this.invoiceRepository.findById(id),
            errors = this.validation(entity);

        if (entity.invoiceStatus !== 'draft')
            errors.push('این فاکتور قبلا تایید شده');

        if (errors.length > 0)
            throw  new ValidationException(errors);

        let data = {invoiceStatus: 'waitForPayment'};

        this.invoiceRepository.update(id, data);

        this._setForInventoryPurchase(entity);
    }

    update(id, cmd) {

        cmd.id = id;

        const invoice = this.invoiceRepository.findById(id);

        if (invoice.invoiceStatus !== 'draft')
            throw new ValidationException(['فاکتور جاری قابل ویرایش نمیباشد']);

        let entity = this.mapToEntity(cmd);

        if (entity.invoiceStatus !== 'draft')
            entity.invoiceStatus = 'waitForPayment';

        this.invoiceRepository.updateBatch(id, this._mapToData(entity));

        if (entity.invoiceStatus !== 'draft')
            this._setForInventoryPurchase(entity);
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

        entity.invoiceType = 'returnPurchase';
        entity.ofInvoiceId = cmd.ofInvoiceId;
        entity.number = this.invoiceRepository.maxNumber('returnPurchase') + 1;

        this.invoiceRepository.create(entity);

        return entity.id;
    }

    pay(id, payments) {
        const paymentService = new PaymentService(this.branchId),

            paymentIds = paymentService.create(payments, 'pay');

        paymentService.setInvoiceForAll(paymentIds, id);

        this._changeStatusIfPaidIsCompleted(id);
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


}

module.exports = InvoiceService;