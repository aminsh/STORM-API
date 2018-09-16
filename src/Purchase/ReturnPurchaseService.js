import {inject, injectable, postConstruct} from "inversify";

const Guid = Utility.Guid,
    PersianDate = Utility.PersianDate;

@injectable()
export class ReturnPurchaseService {

    /** @type {ProductService}*/
    @inject("ProductService") productService = undefined;

    /** @type {DetailAccountService}*/
    @inject("DetailAccountService") detailAccountService = undefined;

    /** @type {SettingsRepository}*/
    @inject("SettingsRepository") settingsRepository = undefined;

    /** @type {InvoiceRepository}*/
    @inject("InvoiceRepository") invoiceRepository = undefined;

    /** @type {IState}*/
    @inject("State") state = undefined;

    /** @type {EventBus}*/
    @inject("EventBus") eventBus = undefined;

    @postConstruct()
    init() {

        this.settings = this.settingsRepository.get();
    }

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

        if (Utility.String.isNullOrEmpty(entity.ofInvoiceId))
            errors.push("فاکتور خرید وجود ندارد");

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

    getNumber(number, persistedInvoice) {

        const _getNumber = () => persistedInvoice
            ? persistedInvoice.number
            : this.invoiceRepository.maxNumber('returnPurchase') + 1;

        if (!number)
            return _getNumber();

        const isNumberDuplicated = this.invoiceRepository.isNumberDuplicated(number, 'returnPurchase', (persistedInvoice || {}).id);

        if (isNumberDuplicated)
            return _getNumber();

        return number;
    }

    mapToEntity(cmd) {

        const detailAccount = this.detailAccountService.findPersonByIdOrCreate(cmd.customer),
            invoice = cmd.id ? this.invoiceRepository.findById(cmd.id) : undefined;

        return {
            id: cmd.id,
            date: cmd.date || PersianDate.current(),
            invoiceStatus: cmd.status || 'draft',
            number: this.getNumber(cmd.number, invoice),
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

                    const product = this.productService.findByIdOrCreate(line.product);

                    return {
                        productId: product ? product.id : null,
                        description: line.description || product.title,
                        stockId: (this.settings.productOutputCreationMethod === 'defaultStock' && product && product.productType === 'good')
                            ? this.settings.stockId
                            : line.stockId,
                        quantity: line.quantity,
                        unitPrice: line.unitPrice,
                        discount: line.discount || 0,
                        vat: line.vat || 0,
                        tax: line.tax || 0
                    }
                })
                .toArray()
        }
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

        entity.invoiceType = 'returnPurchase';
        entity.invoiceStatus = cmd.status !== 'draft' ? 'confirmed' : 'draft';

        let data = this._mapToData(entity);
        this.invoiceRepository.create(data);

        entity.id = data.id;

        if(entity.invoiceStatus === 'confirmed')
            this.eventBus.send('ReturnPurchaseCreated', entity.id);

        return entity.id;
    }

    confirm(cmd) {

        let entity = this.invoiceRepository.findById(cmd.id),
            errors = this.validation(entity);

        if (entity.invoiceStatus === 'confirmed')
            errors.push('این فاکتور قبلا تایید شده');

        if (entity.invoiceStatus === 'fixed')
            errors.push('این فاکتور قطعی شده');

        if (errors.length > 0)
            throw  new ValidationException(errors);

        let data = {invoiceStatus: 'confirmed'};
        this.invoiceRepository.update(cmd.id, data);

        this.eventBus.send('ReturnPurchaseCreated', entity.id);
    }

    update(id, cmd) {

        const invoice = this.invoiceRepository.findById(id);

        if (!invoice)
            throw new NotFoundException();

        cmd.ofInvoiceId = invoice.ofInvoiceId;
        let errors = this.validation(cmd);

        if (invoice.invoiceStatus === 'fixed')
            throw new ValidationException(['این فاکتور قطعی شده']);

        if (errors.length > 0)
            throw  new ValidationException(errors);

        let entity = this.mapToEntity(cmd);

        if (entity.invoiceStatus !== 'draft')
            entity.invoiceStatus = 'confirmed';

        this.invoiceRepository.updateBatch(id, this._mapToData(entity));

        if (invoice.invoiceStatus === 'draft' && entity.invoiceStatus === 'confirmed')
            this.eventBus.send('ReturnPurchaseCreated', entity.id);
        else
            this.eventBus.send('ReturnPurchaseChanged', invoice, entity.id);
    }

    remove(id) {
        const invoice = this.invoiceRepository.findById(id);

        if (!invoice)
            throw new NotFoundException();

        if (invoice.invoiceStatus === 'fixed')
            throw new ValidationException(['فاکتور جاری قابل حذف نمیباشد']);

        this.invoiceRepository.remove(id);

        if (invoice.invoiceStatus === 'draft')
            return;

        this.eventBus.send('ReturnPurchaseRemoved', id);
    }
}
