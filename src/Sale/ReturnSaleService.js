import {inject, injectable, postConstruct} from "inversify";

const Guid = Utility.Guid,
    PersianDate = Utility.PersianDate;

@injectable()
export class ReturnSaleService {

    /** @type {ProductService}*/
    @inject("ProductService") productService = undefined;

    /** @type {DetailAccountService}*/
    @inject("DetailAccountService") detailAccountService = undefined;

    /** @type {SettingsRepository}*/
    @inject("SettingsRepository") settingsRepository = undefined;

    /** @type {InvoiceRepository}*/
    @inject("InvoiceRepository") invoiceRepository = undefined;

    /**@type {InventoryRepository}*/
    @inject("InventoryRepository") inventoryRepository = undefined;

    /** @type {IState}*/
    @inject("State") state = undefined;

    /** @type {EventBus}*/
    @inject("EventBus") eventBus = undefined;

    @inject("InvoiceTypeRepository")
    /**@type{InvoiceTypeRepository}*/ invoiceTypeRepository = undefined;

    @inject("JournalGenerationTemplateService")
    /**@type{JournalGenerationTemplateService}*/ journalGenerationTemplateService = undefined;

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
            errors.push('مشتری نباید خالی باشد');

        if (Utility.String.isNullOrEmpty(entity.ofInvoiceId))
            errors.push("فاکتور فروش وجود ندارد");

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

        if (this.settings.canControlInventory && !line.stockId)
            errors.push('انبار نباید خالی باشد');

        return errors;
    }

    getNumber(number, persistedInvoice) {

        const _getNumber = () => persistedInvoice
            ? persistedInvoice.number
            : this.invoiceRepository.maxNumber('returnSale') + 1;

        if (!number)
            return _getNumber();

        const isNumberDuplicated = this.invoiceRepository.isNumberDuplicated(number, 'returnSale', (persistedInvoice || {}).id);

        if (isNumberDuplicated)
            return _getNumber();

        return number;
    }

    mapToEntity(cmd) {

        const detailAccount = this.detailAccountService.findPersonByIdOrCreate(cmd.customer),
            invoice = cmd.id ? this.invoiceRepository.findById(cmd.id) : undefined,
            type = cmd.typeId
                ? this.invoiceTypeRepository.findById(cmd.typeId)
                : this.invoiceTypeRepository.findOneOrGetDefault(cmd.type);

        return {
            id: cmd.id,
            date: cmd.date || PersianDate.current(),
            typeId: type ? type.id : null,
            currencyId: cmd.currencyId,
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

        entity.invoiceType = 'returnSale';
        entity.invoiceStatus = 'draft';

        let data = this._mapToData(entity);
        entity = this.invoiceRepository.create(data);

        return entity.id;
    }

    confirm(id) {

        let entity = this.invoiceRepository.findById(id),
            errors = this.validation(entity);

        if (entity.invoiceStatus === 'confirmed')
            errors.push('این فاکتور قبلا تایید شده');

        if (entity.invoiceStatus === 'fixed')
        errors.push('فاکتور ثبت قطعی شده');

        if (errors.length > 0)
            throw  new ValidationException(errors);

        let data = {invoiceStatus: 'confirmed'};

        this.invoiceRepository.update(id, data);

        this.eventBus.send('ReturnSaleCreated', entity.id);
    }

    update(id, cmd) {

        cmd.id = id;

        const invoice = this.invoiceRepository.findById(id);

        let entity = this.mapToEntity(cmd),
            errors = this.validation(entity);

        if (errors.length > 0)
            throw new ValidationException(errors);

        const relatedOutputs = this.inventoryRepository.findByInvoiceId(id);

        if (relatedOutputs && relatedOutputs.length > 0 && this._invoiceLinesChanged(invoice.invoiceLines, entity.invoiceLines))
            errors.push('برای فاکتور جاری ، حواله خروج از انبار صادر شده ، ابتدا حواله (ها) ی خروجی حذف نمایید');

        this.invoiceRepository.updateBatch(id, this._mapToData(entity));

        if (entity.invoiceStatus === 'draft')
            return;

        this.eventBus.send('ReturnSaleChanged', entity.id);
    }

    fix(id) {

        const invoice = this.invoiceRepository.findById(id);

        if (!invoice)
            throw new NotFoundException();

        if(invoice.invoiceStatus === 'draft')
            throw new ValidationException(['فاکتور در وضعیت پیش نویس است ، ابتدا تایید کنید']);

        if(invoice.invoiceStatus === 'fixed')
            throw new ValidationException(['فاکتور قبلا قطعی شده']);

        this.invoiceRepository.update(id, {invoiceStatus: 'fixed'});
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

        this.eventBus.send('ReturnSaleRemoved', invoice.id);
    }

    generateJournal(id) {
        let invoice = this.invoiceRepository.findById(id);


        if (!invoice)
            throw new ValidationException([ 'فاکتور وجود ندارد' ]);

        if (invoice.journalId)
            throw new ValidationException([ 'برای فاکتور جاری قبلا سند صادر شده ، ابتدا سند را حذف کنید' ]);

        const type = invoice.typeId
            ? this.invoiceTypeRepository.findById(invoice.typeId)
            : null;

        if (!type)
            throw new ValidationException([ 'نوع فروش وجود ندارد' ]);

        if (!type.returnJournalGenerationTemplateId)
            throw new ValidationException([ 'نوع فروش الگوی ساخت سند برگشتی را ندارد' ]);

        const journalId = this.journalGenerationTemplateService.generate(type.returnJournalGenerationTemplateId, id, 'Sale');

        Utility.delay(1000);

        this.invoiceRepository.update(id, { journalId });
    }

    _invoiceLinesChanged(oldLines, newLines) {
        let removedLines = oldLines.filter(item => !newLines.asEnumerable().any(nl => nl.productId === item.productId));

        if (removedLines.length > 0)
            return true;

        let addedLines = newLines.filter(item => !oldLines.asEnumerable().any(nl => nl.productId === item.productId));

        if (addedLines.length > 0)
            return true;

        let changedLines = oldLines.asEnumerable()
            .join(newLines,
                oldLine => oldLine.productId,
                newLine => newLine.productId,
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
