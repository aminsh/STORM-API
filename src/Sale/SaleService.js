import { inject, injectable, postConstruct } from "inversify";

const PersianDate = Utility.PersianDate,
    Guid = Utility.Guid;

@injectable()
export class SaleService {

    /** @type {ProductInventoryService}*/
    @inject("ProductInventoryService") productInventoryService = undefined;

    @inject("InvoiceTypeRepository")
    /**@type{InvoiceTypeRepository}*/ invoiceTypeRepository = undefined;

    /** @type {ProductService}*/
    @inject("ProductService") productService = undefined;

    /**@type {InventoryRepository}*/
    @inject("InventoryRepository") inventoryRepository = undefined;

    /**@type{InventoryService}*/
    @inject("InventoryService") inventoryService = undefined;

    /**@type{OutputService}*/
    @inject("OutputService") outputService = undefined;

    /** @type {ProductRepository}*/
    @inject("ProductRepository") productRepository = undefined;

    /** @type {DetailAccountService}*/
    @inject("DetailAccountService") detailAccountService = undefined;

    /** @type {SettingsRepository}*/
    @inject("SettingsRepository") settingsRepository = undefined;

    /** @type {InvoiceRepository}*/
    @inject("InvoiceRepository") invoiceRepository = undefined;

    @inject("InvoiceCompareService")
    /**@type{InvoiceCompareService}*/ invoiceCompareService = undefined;

    @inject('DetailAccountRepository')
    /**@type{DetailAccountRepository}*/ detailAccountRepository = undefined;

    @inject("JournalGenerationTemplateService")
    /**@type{JournalGenerationTemplateService}*/ journalGenerationTemplateService = undefined;

    @inject("JournalService")
    /**@type{JournalService}*/ journalService = undefined;

    /** @type {IState}*/
    @inject("State") state = undefined;

    /** @type {EventBus}*/
    @inject("EventBus") eventBus = undefined;

    @postConstruct()
    init() {
        this.settings = this.settingsRepository.get();
    }

    _validate(entity) {
        let errors = [];

        if (!( entity.invoiceLines && entity.invoiceLines.length !== 0 ))
            errors.push('ردیف های فاکتور وجود ندارد');
        else
            errors = entity.invoiceLines.asEnumerable().selectMany(this._validateLine.bind(this)).toArray();

        if (entity.marketerId) {
            let marketerDetailAccount = this.detailAccountRepository.findById(entity.marketerId);

            if (!( marketerDetailAccount && marketerDetailAccount.isMarketer ))
                errors.push('نقش بازاریاب برای {0} تعریف نشده است!'.format(marketerDetailAccount.title));
        }

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

    _validateLine(line) {
        let errors = [];

        if (Guid.isEmpty(line.productId) && Utility.String.isNullOrEmpty(line.description))
            errors.push('کالا یا شرح کالا نباید خالی باشد');

        if (!( line.quantity && line.quantity !== 0 ))
            errors.push('مقدار نباید خالی یا صفر باشد');

        if (!( line.unitPrice && line.unitPrice !== 0 ))
            errors.push('قیمت واحد نباید خالی یا صفر باشد');

        /*if (this.settings.canControlInventory && (line.product && line.product.productType === 'good') && !line.stockId )
            errors.push('انبار نباید خالی باشد');*/

        return errors;
    }

    getNumber(number, persistedInvoice) {

        const _getNumber = () => persistedInvoice
            ? persistedInvoice.number
            : this.invoiceRepository.maxNumber('sale') + 1;

        if (!number)
            return _getNumber();

        const isNumberDuplicated = this.invoiceRepository.isNumberDuplicated(number, 'sale', ( persistedInvoice || {} ).id);

        if (isNumberDuplicated)
            return _getNumber();

        return number;
    }

    mapToEntity(cmd) {

        const detailAccount = this.detailAccountService.findPersonByIdOrCreate(cmd.customer),
            marketer = cmd.marketerId ? this.detailAccountRepository.findById(cmd.marketerId) : null,
            invoice = cmd.id ? this.invoiceRepository.findById(cmd.id) : undefined,
            type = cmd.typeId
                ? this.invoiceTypeRepository.findById(cmd.typeId)
                : this.invoiceTypeRepository.findOneOrGetDefault(cmd.type);

        return {
            id: cmd.id,
            date: cmd.date || PersianDate.current(),
            typeId: type ? type.id : null,
            number: this.getNumber(cmd.number, invoice),
            description: cmd.description,
            title: cmd.title,
            detailAccountId: detailAccount ? detailAccount.id : null,
            marketerId: marketer ? marketer.id : null,
            orderId: cmd.orderId,
            costs: this._mapCostAndCharge(cmd.costs),
            charges: this._mapCostAndCharge(cmd.charges),
            bankReceiptNumber: cmd.bankReceiptNumber,
            discount: isNaN(parseFloat(cmd.discount)) ? 0 : parseFloat(cmd.discount),
            invoiceLines: this._mapLines(cmd.invoiceLines).asEnumerable()
                .select(line => {

                    let product = this.productService.findByIdOrCreate(line.product);

                    product = product ? product : { id: undefined, title: undefined };

                    return {
                        id: line.id,
                        productId: product ? product.id : null,
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

    _mapLines(lines) {
        if (!lines)
            return [];

        if (!Array.isArray(lines))
            return [ lines ];

        return lines;
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

    _mapToData(entity) {
        let data = Object.assign({}, entity, {
            costs: JSON.stringify(entity.costs),
            charges: JSON.stringify(entity.charges),
            custom: { bankReceiptNumber: entity.bankReceiptNumber },
            invoiceLines: entity.invoiceLines.asEnumerable()
                .select(line => ( {
                    id: line.id,
                    productId: line.productId,
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

        delete data.bankReceiptNumber;

        return data;
    }

    _updateInventoryOnCreate(entity) {

        if (!this.settings.canControlInventory)
            return;

        let linesAreGood = entity.invoiceLines.filter(item => item.productId && this.productRepository.isGood(item.productId)),
            result;

        if (linesAreGood.length === 0)
            return;

        this.productInventoryService.start();

        try {
            result = linesAreGood.map(item => this.productInventoryService.change(item.productId, item.stockId, item.quantity * -1))
        }
        catch (e) {

            this.productInventoryService.revertChanges(e);

            throw new Error(e);
        }

        if (result.asEnumerable().any(item => !item.success)) {

            this.productInventoryService.revertChanges();

            throw new ValidationException(result.filter(item => !item.success).map(item => item.message));
        }

        this.productInventoryService.commitChanges();
    }

    /*_updateProductInventoryOnUpdate(oldSale, newSale) {

        if (!this.settings.canControlInventory)
            return;

        let result = [],
            change = (productId, stockId, quantity) => result.push(this.productInventoryService.change(productId, stockId, quantity)),
            oldLines = oldSale.invoiceLines.filter(item => item.productId && this.productRepository.isGood(item.productId)),
            newLines = newSale.invoiceLines.filter(item => item.productId && this.productRepository.isGood(item.productId)),

            compared = this.invoiceCompareService.compare('output', oldLines, newLines);

        this.productInventoryService.start();

        try {

            compared.forEach(item => change(item.productId, item.stockId, item.quantity));

        }
        catch (e) {

            this.productInventoryService.revertChanges(e);

            throw new Error(e);
        }

        if (result.asEnumerable().any(r => !r.success)) {
            const messages = result.filter(r => !r.success).map(r => r.message);

            this.productInventoryService.revertChanges(messages);

            throw new ValidationException(messages);
        }

        this.productInventoryService.commitChanges();
    }*/

    create(cmd) {
        let entity = this.mapToEntity(cmd),
            errors = this._validate(entity);

        if (errors.length > 0)
            throw new ValidationException(errors);

        entity.invoiceType = 'sale';
        entity.invoiceStatus = 'draft';

        entity = this.invoiceRepository.create(this._mapToData(entity));

        return entity.id;
    }

    confirm(id, entity) {

        if (!entity)
            entity = this.invoiceRepository.findById(id);

        let errors = [];

        if (entity.invoiceStatus !== 'draft')
            errors.push('این فاکتور قبلا تایید شده');

        if (errors.length > 0)
            throw new ValidationException(errors);

        let data = {
            invoiceStatus: 'confirmed'
        };

        this.invoiceRepository.update(entity.id, data);

        this.eventBus.send("SaleCreated", entity.id);
    }

    update(id, cmd) {
        const invoice = this.invoiceRepository.findById(id);

        if (invoice.invoiceStatus === 'fixed')
            throw new ValidationException([ 'فاکتور جاری قابل ویرایش نمیباشد' ]);

        let errors = [];
        let entity = this.mapToEntity(cmd);

        if (invoice.journalId)
            errors.push('برای فاکتور جاری سند حسابداری صادر شده ، ابتدا سند حسابداری را حذف نمایید');

        const relatedOutputs = this.inventoryRepository.findByInvoiceId(id);

        if (relatedOutputs && relatedOutputs.length > 0 && this._invoiceLinesChanged(invoice.invoiceLines, entity.invoiceLines))
            errors.push('برای فاکتور جاری ، حواله خروج از انبار صادر شده ، ابتدا حواله (ها) ی خروجی حذف نمایید');

        if (errors.length > 0)
            throw new ValidationException(errors);

        errors = this._validate(entity);

        if (errors.length > 0)
            throw new ValidationException(errors);

        if (entity.invoiceStatus === 'draft') {
            this.invoiceRepository.updateBatch(id, this._mapToData(entity));
            return;
        }

        this.invoiceRepository.updateBatch(id, this._mapToData(entity));

        Utility.delay(500);

        if (entity.invoiceStatus === 'draft')
            return;

        this.eventBus.send('SaleChanged', invoice.id);
    }

    remove(id) {
        const invoice = this.invoiceRepository.findById(id);

        if (!invoice)
            throw new NotFoundException();

        if (invoice.invoiceStatus === 'fixed')
            throw new ValidationException([ 'فاکتور جاری قابل حذف نمیباشد' ]);

        this.invoiceRepository.remove(id);

        if (invoice.invoiceStatus === 'draft')
            return;

        this.eventBus.send("SaleRemoved", id);
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

        this.eventBus.send("SaleFixed", id);
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

        if (!type.journalGenerationTemplateId)
            throw new ValidationException([ 'نوع فروش الگوی ساخت سند ندارد' ]);

        const journalId = this.journalGenerationTemplateService.generate(type.journalGenerationTemplateId, id, 'Sale');

        Utility.delay(1000);

        this.invoiceRepository.update(id, { journalId });
    }

    removeJournal(id) {
        const invoice = this.invoiceRepository.findById(id);

        if (!invoice)
            throw new NotFoundException();

        if (!invoice.journalId)
            throw new ValidationException([ 'برای فاکتور جاری سند حسابداری صادر نشده' ]);

        this.journalService.remove(invoice.journalId);

        this.invoiceRepository.update(id, { journalId: null });
    }

    setStockToInvoice(id, lines) {
        const invoice = this.invoiceRepository.findById(id);

        if (!invoice)
            throw new NotFoundException();

        this.invoiceRepository.patchLines(id, lines);
    }

    generateOutput(id) {
        const invoice = this.invoiceRepository.findById(id);

        if (!invoice)
            throw new NotFoundException();

        const relatedOutputs = this.inventoryRepository.findByInvoiceId(id);

        if (relatedOutputs && relatedOutputs.length > 0)
            throw new ValidationException([ 'قبلا برای فاکتور جاری حواله (ها) ی خروجی از انبار صادر شده' ]);

        this.inventoryService.createOutputFromSale(id);
    }

    removeOutputs(id) {
        const invoice = this.invoiceRepository.findById(id);

        if (!invoice)
            throw new NotFoundException();

        const relatedOutputs = this.inventoryRepository.findByInvoiceId(id);

        if (!( relatedOutputs && relatedOutputs.length > 0 ))
            throw new ValidationException([ 'برای فاکتور جاری حواله ای صادر نشده است ' ]);

        relatedOutputs.forEach(item => this.outputService.remove(item.id));
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

