import { inject, injectable, postConstruct } from "inversify";

const Guid = Utility.Guid,
    PersianDate = Utility.PersianDate;

@injectable()
export class PurchaseService {

    /** @type {ProductService}*/
    @inject("ProductService") productDomainService = undefined;

    @inject("InventoryRepository")
    /**@type{InventoryRepository}*/ inventoryRepository = undefined;

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
        let errors = [];

        if (!( entity.invoiceLines && entity.invoiceLines.length !== 0 ))
            errors.push('ردیف های فاکتور وجود ندارد');
        else
            errors = entity.invoiceLines.asEnumerable().selectMany(this._validateLine.bind(this)).toArray();

        if (Utility.String.isNullOrEmpty(entity.detailAccountId))
            errors.push('تامین کننده نباید خالی باشد');

        return errors;
    }

    _validateLine(line) {
        let errors = [];

        if (Guid.isEmpty(line.product) && Utility.String.isNullOrEmpty(line.description))
            errors.push('کالا یا شرح کالا نباید خالی باشد');

        if (!( line.quantity && line.quantity !== 0 ))
            errors.push('مقدار نباید خالی یا صفر باشد');

        if (!( line.unitPrice && line.unitPrice !== 0 ))
            errors.push('قیمت واحد نباید خالی یا صفر باشد');

        return errors;
    }

    mapToEntity(cmd) {

        const detailAccount = this.detailAccountService.findPersonByIdOrCreate(cmd.vendor);

        return {
            id: cmd.id,
            date: cmd.date || PersianDate.current(),
            invoiceStatus: cmd.status || 'draft',
            description: cmd.description,
            title: cmd.title,
            charges: this._mapCostAndCharge(cmd.charges),
            detailAccountId: detailAccount ? detailAccount.id : null,
            orderId: cmd.orderId,
            discount: cmd.discount,
            invoiceLines: cmd.invoiceLines.asEnumerable()
                .select(line => {

                    const product = this.productDomainService.findByIdOrCreate(line.product);

                    return {
                        product: product,
                        description: line.description || product.title,
                        stockId: this.selectStock(product, line),
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

    selectStock(product, line) {
        if (!product)
            return null;

        if (product.productType !== 'good')
            return null;

        if (this.settings.productOutputCreationMethod === 'defaultStock')
            return this.settings.stockId;

        if (this.settings.productOutputCreationMethod === 'stockOnRequest')
            return line.stockId;

        if (this.settings.productOutputCreationMethod === 'defaultStockOnProduct')
            return product.stocks && product.stocks.length > 0
                ? ( product.stocks.asEnumerable().firstOrDefault(item => item.isDefault) || {} ).stockId
                : null
    }

    _mapToData(entity) {

        return Object.assign({}, entity, {
            charges: JSON.stringify(entity.charges),
            inventoryIds: JSON.stringify(entity.inventoryIds),
            invoiceLines: entity.invoiceLines.asEnumerable()
                .select(line => ( {
                    id: line.id,
                    productId: line.product ? line.product.id : null,
                    description: line.description,
                    stockId: line.stockId,
                    quantity: line.quantity,
                    unitPrice: line.unitPrice,
                    discount: line.discount,
                    vat: line.vat,
                    tax: line.tax
                } ))
                .toArray()
        });
    }

    _mapCostAndCharge(data) {

        if (!data)
            return [];

        if (Array.isArray(data))
            return data.asEnumerable().select(e => ( {
                key: e.key,
                value: e.value || 0,
                vatIncluded: e.vatIncluded
            } )).toArray();

        return Object.keys(data).asEnumerable()
            .select(key => ( {
                key,
                vatIncluded: false,
                value: data[ key ]
            } ))
            .toArray();

    }

    create(cmd) {

        let entity = this.mapToEntity(cmd),
            errors = this.validation(entity);

        if (errors.length > 0)
            throw new ValidationException(errors);

        entity.number = this.invoiceRepository.maxNumber('purchase') + 1;
        entity.invoiceType = 'purchase';
        entity.invoiceStatus = 'draft';

        entity = this.invoiceRepository.create(this._mapToData(entity));

        return entity.id;
    }

    confirm(id) {

        const invoice = this.invoiceRepository.findById(id);

        if (!invoice)
            throw new NotFoundException();

        let entity = this.invoiceRepository.findById(id),
            errors = this.validation(entity);

        if (entity.invoiceStatus === 'confirmed')
            errors.push('این فاکتور قبلا تایید شده');

        if (entity.invoiceStatus === 'fixed')
            errors.push('فاکتور قطعی شده');

        if (errors.length > 0)
            throw  new ValidationException(errors);

        let data = { invoiceStatus: 'confirmed' };

        this.invoiceRepository.update(id, data);

        this.eventBus.send('PurchaseCreated', id);
    }

    update(id, cmd) {

        cmd.id = id;

        const invoice = this.invoiceRepository.findById(id);

        if (!invoice)
            throw new NotFoundException();

        let errors = [];
        let entity = this.mapToEntity(cmd);

        const relatedInputs = this.inventoryRepository.findByInvoiceId(id);

        if (relatedInputs && relatedInputs.length > 0 && this._invoiceLinesChanged(invoice.invoiceLines, entity.invoiceLines))
            errors.push('برای فاکتور جاری ، رسید ورود به انبار صادر شده ، ابتدا رسید (ها) ی ورودی حذف نمایید');

        if (errors.length > 0)
            throw new ValidationException(errors);

        errors = this.validation(entity);

        if (errors.length > 0)
            throw new ValidationException(errors);

        this.invoiceRepository.updateBatch(id, this._mapToData(entity));

        if (entity.invoiceStatus !== 'draft')
            this.eventBus.send("PurchaseChanged", id);
    }

    remove(id) {

        const invoice = this.invoiceRepository.findById(id);

        if (!invoice)
            throw new NotFoundException();

        const relatedInputs = this.inventoryRepository.findByInvoiceId(id);

        if (relatedInputs && relatedInputs.length > 0 )
            errors.push('برای فاکتور جاری ، رسید ورود به انبار صادر شده ، ابتدا رسید (ها) ی ورودی حذف نمایید');

        this.invoiceRepository.remove(id);

        this.eventBus.send('PurchaseRemoved', id);
    }

    fix(id) {

        const invoice = this.invoiceRepository.findById(id);

        if (!invoice)
            throw new NotFoundException();

        if (invoice.invoiceStatus === 'draft')
            throw new ValidationException([ 'فاکتور در وضعیت پیش نویس است ، ابتدا تایید کنید' ]);

        if (invoice.invoiceStatus === 'fixed')
            throw new ValidationException([ 'فاکتور قبلا قطعی شده' ]);

        this.invoiceRepository.update(id, { invoiceStatus: 'fixed' });
    }

    _invoiceLinesChanged(oldLines, newLines) {
        let removedLines = oldLines.filter(item => !newLines.asEnumerable().any(nl => nl.product.id === item.productId));

        if (removedLines.length > 0)
            return true;

        let addedLines = newLines.filter(item => !oldLines.asEnumerable().any(nl => nl.productId === item.product.id));

        if (addedLines.length > 0)
            return true;

        let changedLines = oldLines.asEnumerable()
            .join(newLines,
                oldLine => oldLine.productId,
                newLine => newLine.product.id,
                (oldLine, newLine) => ( {
                    productId: oldLine.productId,
                    oldQuantity: oldLine.quantity,
                    newQuantity: newLine.quantity
                } ))
            .where(item => item.oldQuantity !== item.newQuantity)
            .toArray();

        return changedLines.length > 0;
    }
}
