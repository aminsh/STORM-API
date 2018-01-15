import {inject, injectable, postConstruct} from "inversify";

const Guid = Utility.Guid,
    PersianDate = Utility.PersianDate;

@injectable()
export class InvoicePurchaseDomainService {

    /** @type {InventoryInputDomainService}*/
    @inject("InventoryInputDomainService") inventoryInputDomainService = undefined;

    /** @type {InputPurchaseDomainService}*/
    @inject("InputPurchaseDomainService") inputPurchaseDomainService = undefined;

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

    /** @type {InvoiceRepository}*/
    @inject("InvoiceRepository") invoiceRepository = undefined;

    /** @type {IState}*/
    @inject("State") state = undefined;

    @postConstruct()
    init() {
        this.settings = this.settingsRepository.get();
    }

    validation(entity) {
        let errors = [];

        if (!(entity.invoiceLines && entity.invoiceLines.length !== 0))
            errors.push('ردیف های فاکتور وجود ندارد');
        else
            errors = entity.invoiceLines.asEnumerable().selectMany(this._validateLine.bind(this)).toArray();

        if (Utility.String.isNullOrEmpty(entity.detailAccountId))
            errors.push('فروشنده نباید خالی باشد');

        return errors;
    }

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

    mapToEntity(cmd) {

        const detailAccount = this.detailAccountDomainService.findPersonByIdOrCreate(cmd.vendor);

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
            discount: cmd.discount,
            invoiceLines: cmd.invoiceLines.asEnumerable()
                .select(line => {

                    const product = this.productDomainService.findByIdOrCreate(line.product);

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

        let inventoryIds = entity.inventoryIds && entity.inventoryIds.length > 0
            ? entity.inventoryIds
            : this.inputPurchaseDomainService.create(entity);

        if (!(inventoryIds && inventoryIds.length > 0))
            return;

        this.inventoryInputDomainService.setInvoice(inventoryIds, entity.id);

        if (!(entity.inventoryIds && entity.inventoryIds.length > 0))
            this.invoiceRepository.update(entity.id, {inventoryIds: JSON.stringify(inventoryIds)});
    }

    /**
     * @private
     */
    _changeStatusIfPaidIsCompleted(id) {

        let invoice = this.invoiceRepository.findById(id),
            sumPayments = this.paymentRepository.getBySumAmountByInvoiceId(id).sum || 0,

            totalPrice = invoice.invoiceLines.asEnumerable()
                .sum(e => (e.unitPrice * e.quantity) - e.discount + e.vat);

        if (sumPayments >= totalPrice)
            this.invoiceRepository.update(id, {invoiceStatus: 'paid'});
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

    pay(id, payments) {
        const paymentIds = this.paymentDomainService.createMany(payments, 'pay');

        this.paymentDomainService.setInvoiceForAll(paymentIds, id);

        this._changeStatusIfPaidIsCompleted(id);
    }

    setJournal(id, journalId) {
        return this.invoiceRepository.update(id, {journalId});
    }
}
