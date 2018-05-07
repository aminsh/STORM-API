import {inject, injectable} from "inversify";

const Guid = Utility.Guid,
    PersianDate = Utility.PersianDate;

@injectable()
export class ReturnPurchaseDomainService {

    /** @type {InventoryOutputDomainService}*/
    @inject("InventoryOutputDomainService") inventoryOutputDomainService = undefined;

    /** @type {OutputReturnPurchaseDomainService}*/
    @inject("OutputReturnPurchaseDomainService") outputReturnPurchaseDomainService = undefined;

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

    /** @type {EventBus}*/
    @inject("EventBus") eventBus = undefined;

    validation(entity) {
        let errors = [],

            ofInvoicePurchase = this.invoiceRepository.findReturnInvoiceByInvoiceId(entity.ofInvoiceId),
            ofInvoicePurchaseQuantity = ofInvoicePurchase.asEnumerable().sum(item => item.quantity),

            purchaseInvoice = this.invoiceRepository.findById(entity.ofInvoiceId),
            purchaseQuantity = purchaseInvoice.invoiceLines.asEnumerable().sum(item => item.quantity),
            purchaseUnitPrice = purchaseInvoice.invoiceLines.asEnumerable().sum(item => item.unitPrice),
            purchaseSupplier = purchaseInvoice.detailAccountId,

            returnPurchaseQuantity = entity.invoiceLines.asEnumerable().sum(item => item.quantity),
            returnPurchaseUnitPrice = entity.invoiceLines.asEnumerable().sum(item => item.unitPrice);

        if (!(entity.invoiceLines && entity.invoiceLines.length !== 0))
            errors.push('ردیف های فاکتور وجود ندارد');
        else
            errors = entity.invoiceLines.asEnumerable().selectMany(this._validateLine.bind(this)).toArray();

        if (Utility.String.isNullOrEmpty(entity.detailAccountId))
            errors.push('فروشنده نباید خالی باشد');

        if (Utility.String.isNullOrEmpty(entity.ofInvoiceId))
            errors.push("فاکتور خرید وجود ندارد");

        if (returnPurchaseQuantity > (purchaseQuantity - ofInvoicePurchaseQuantity))
            errors.push("مقدار برگشت از خرید نمی تواند بیشتر از فاکتور خرید باشد");

        if (returnPurchaseUnitPrice > purchaseUnitPrice )
            errors.push("مبلغ برگشت از خرید نمی تواند بیشتر از فاکتور خرید باشد");

        if (entity.detailAccountId !== purchaseSupplier)
            errors.push("فروشنده در برگشت از خرید نمی تواند تغییر کند");

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

        const detailAccount = this.detailAccountDomainService.findPersonByIdOrCreate(cmd.customer);

        return {
            id: cmd.id,
            date: cmd.date || PersianDate.current(),
            invoiceStatus: cmd.status || 'draft',
            description: cmd.description,
            ofInvoiceId: cmd.ofInvoiceId,
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
    _setForInventoryReturn(entity) {


        let inventoryIds = entity.inventoryIds && entity.inventoryIds.length > 0
            ? entity.inventoryIds
            : this.outputReturnPurchaseDomainService.create(entity);

        if (!(inventoryIds && inventoryIds.length > 0))
            return;

        this.inventoryOutputDomainService.setInvoice(inventoryIds, entity.id, 'outputReturnPurchase');

        this.invoiceRepository.update(entity.id, {inventoryIds: JSON.stringify(inventoryIds)});
    }

    /*    /!**
         * @private
         *!/
        _changeStatusIfPaidIsCompleted(id) {

            let invoice = this.invoiceRepository.findById(id),
                sumPayments = this.paymentRepository.getBySumAmountByInvoiceId(id).sum || 0,

                totalPrice = invoice.invoiceLines.asEnumerable()
                    .sum(e => (e.unitPrice * e.quantity) - e.discount + e.vat);

            if (sumPayments >= totalPrice)
                this.invoiceRepository.update(id, {invoiceStatus: 'paid'});
        }*/

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

    /**
     * @private
     */
    _changeStatusIfPaidIsCompleted(id) {

        let invoice = this.invoiceRepository.findById(id),
            sumPayments = this.paymentRepository.getBySumAmountByInvoiceId(id).sum || 0,

            totalPrice = invoice.invoiceLines.asEnumerable()
                    .sum(e => (e.unitPrice * e.quantity) - e.discount + e.vat)
                - (!invoice.discount ? 0 : invoice.discount);

        if (sumPayments >= totalPrice)
            this.invoiceRepository.update(id, {invoiceStatus: 'paid'});
    }

    create(cmd) {

        let entity = this.mapToEntity(cmd),
            errors = this.validation(entity);


        if (errors.length > 0)
            throw new ValidationException(errors);

        entity.number = this.invoiceRepository.maxNumber('returnPurchase') + 1;
        entity.invoiceType = 'returnPurchase';
        entity.invoiceStatus = cmd.status !== 'draft' ? 'waitForPayment' : 'draft';

        let data = this._mapToData(entity);
        this.invoiceRepository.create(data);

        entity.id = data.id;

        if (entity.invoiceStatus !== 'draft')
            this._setForInventoryReturn(entity);

        this.eventBus.send('onReturnPurchaseCreated', entity.id);

        return entity.id;
    }

    confirm(cmd) {

        let entity = this.invoiceRepository.findById(cmd.id),
            errors = this.validation(entity);

        if (entity.invoiceStatus !== 'draft')
            errors.push('این فاکتور قبلا تایید شده');

        if (errors.length > 0)
            throw  new ValidationException(errors);


        this._setForInventoryReturn(entity);

        let data = {invoiceStatus: 'waitForPayment'};
        this.invoiceRepository.update(cmd.id, data);

        this.eventBus.send('onReturnPurchaseConfirmed', entity.id);
    }

    update(id, cmd) {

        const invoice = this.invoiceRepository.findById(id);

        cmd.ofInvoiceId = invoice.ofInvoiceId;
        let errors = this.validation(cmd);

        if (errors.length > 0)
            throw  new ValidationException(errors);

        if (invoice.invoiceStatus !== 'draft')
            throw new ValidationException(['فاکتور جاری قابل ویرایش نمیباشد']);

        let entity = this.mapToEntity(cmd);

        if (entity.invoiceStatus !== 'draft')
            entity.invoiceStatus = 'waitForPayment';

        this.invoiceRepository.updateBatch(id, this._mapToData(entity));

        this._setForInventoryReturn(entity);

        this.eventBus.send('onReturnPurchaseChanged', entity.id);
    }

    remove(id) {
        const invoice = this.invoiceRepository.findById(id);

        if (invoice.invoiceStatus !== 'draft')
            throw new ValidationException(['فاکتور جاری قابل حذف نمیباشد']);

        this.invoiceRepository.remove(id);
    }

    pay(id, payments) {

        const paymentIds = this.paymentDomainService.createMany(payments, 'receive');

        this.paymentDomainService.setInvoiceForAll(paymentIds, id);

        this._changeStatusIfPaidIsCompleted(id);

        return paymentIds;
    }

    setJournal(id, journalId) {
        return this.invoiceRepository.update(id, {journalId});
    }
}
