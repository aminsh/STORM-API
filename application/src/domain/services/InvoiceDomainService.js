import {inject, injectable, postConstruct} from "inversify";

const PersianDate = Utility.PersianDate,
    Guid = Utility.Guid;

@injectable()
export class InvoiceDomainService {

    /** @type {InventoryOutputDomainService}*/
    @inject("InventoryOutputDomainService") inventoryOutputDomainService = undefined;

    /** @type {ProductDomainService}*/
    @inject("ProductDomainService") productDomainService = undefined;

    /** @type {PaymentDomainService}*/
    @inject("PaymentDomainService") paymentDomainService = undefined;

    /** @type {DetailAccountDomainService}*/
    @inject("DetailAccountDomainService") detailAccountDomainService = undefined;

    /** @type {SettingsRepository}*/
    @inject("SettingsRepository") settingsRepository = undefined;

    /** @type {PaymentRepository}*/
    @inject("PaymentRepository") paymentRepository = undefined;

    /** @type {FiscalPeriodRepository}*/
    @inject("FiscalPeriodRepository") fiscalPeriodRepository = undefined;

    /** @type {InvoiceRepository}*/
    @inject("InvoiceRepository") invoiceRepository = undefined;

    /** @type {IState}*/
    @inject("State") state;

    @postConstruct()
    init() {
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

        if (Utility.String.isNullOrEmpty(entity.detailAccountId))
            errors.push('مشتری نباید خالی باشد');

        if (entity.costs.length !== 0 && !entity.costs.asEnumerable().all(e => !Utility.String.isNullOrEmpty(e.key) && e.value !== 0))
            errors.push('ردیف های هزینه صحیح نیست');

        if (entity.charges.length !== 0 && !entity.charges.asEnumerable().all(e => !Utility.String.isNullOrEmpty(e.key) && e.value !== 0))
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

        if (Guid.isEmpty(line.productId) && Utility.String.isNullOrEmpty(line.description))
            errors.push('کالا یا شرح کالا نباید خالی باشد');

        if (!(line.quantity && line.quantity !== 0))
            errors.push('مقدار نباید خالی یا صفر باشد');

        if (!(line.unitPrice && line.unitPrice !== 0))
            errors.push('قیمت واحد نباید خالی یا صفر باشد');

        return errors;
    }

    /**
     * @private
     * @param {Utility.String} id
     */
    _changeStatusIfPaidIsCompleted(id) {

        let invoice = this.invoiceRepository.findById(id),
            sumPayments = this.paymentRepository.getBySumAmountByInvoiceId(invoice.id).sum || 0,

            totalPrice = invoice.invoiceLines.asEnumerable()
                .sum(e => (e.unitPrice * e.quantity) - e.discount + e.vat);

        if (sumPayments >= totalPrice)
            this.invoiceRepository.update(id, {invoiceStatus: 'paid'});
    }

    mapToEntity(cmd) {

        const detailAccount = this.detailAccountDomainService.findPersonByIdOrCreate(cmd.customer);

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
            invoiceLines: this._mapLines(cmd.invoiceLines).asEnumerable()
                .select(line => {

                    const product = this.productDomainService.findByIdOrCreate(line.product);

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

    _mapLines(lines) {
        if (!lines)
            return [];

        if (!Array.isArray(lines))
            return [lines];

        return lines;
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

        let inventoryIds = this.inventoryOutputDomainService.createForInvoice(entity);

        return inventoryIds;
    }

    _setToOutput(id, inventoryIds) {

        if (!this.settings.canControlInventory)
            return;

        this.inventoryOutputDomainService.setInvoice(inventoryIds, id);
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

        EventEmitter.emit("onInvoiceCreated", entity.id, this.state);

        return entity.id;
    }

    confirm(id) {

        let entity = this.invoiceRepository.findById(id),
            errors = [];

        if (entity.invoiceStatus !== 'draft')
            errors.push('این فاکتور قبلا تایید شده');

        if (errors.length > 0)
            throw  new ValidationException(errors);

        let inventoryIds = this._createOutput(entity);

        if (inventoryIds)
            this._setToOutput(entity.id, inventoryIds);

        let data = {
            inventoryIds: JSON.stringify(inventoryIds),
            invoiceStatus: 'waitForPayment'
        };

        this.invoiceRepository.update(id, data);

        EventEmitter.emit("onInvoiceConfirmed", entity.id, this.state);
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

    setJournal(id, journalId) {
        return this.invoiceRepository.update(id, {journalId});
    }

    pay(id, payments) {

        const paymentIds = this.paymentDomainService.createMany(payments, 'receive');

        this.paymentDomainService.setInvoiceForAll(paymentIds, id);

        this._changeStatusIfPaidIsCompleted(id);

        return paymentIds;
    }
}

