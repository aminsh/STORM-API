import { inject, injectable, postConstruct } from "inversify";

const Guid = Utility.Guid,
    PersianDate = Utility.PersianDate;

@injectable()
export class PurchaseService {

    /** @type {ProductService}*/
    @inject("ProductService") productDomainService = undefined;

    /**@type{InputService}*/
    @inject('InputService') inputService = undefined;

    @inject("InventoryRepository")
    /**@type{InventoryRepository}*/ inventoryRepository = undefined;

    /** @type {DetailAccountService}*/
    @inject("DetailAccountService") detailAccountService = undefined;

    /** @type {SettingsRepository}*/
    @inject("SettingsRepository") settingsRepository = undefined;

    /** @type {InvoiceRepository}*/
    @inject("InvoiceRepository") invoiceRepository = undefined;

    /**@type{InventoryGeneratorService}*/
    @inject("InventoryGeneratorService") inventoryGeneratorService = undefined;

    /** @type {IState}*/
    @inject("State") state = undefined;

    /** @type {EventBus}*/
    @inject("EventBus") eventBus = undefined;

    @inject('JournalGenerationTemplateRepository')
    /**@type{JournalGenerationTemplateRepository}*/ journalGenerationTemplateRepository = undefined;

    @inject("JournalGenerationTemplateService")
    /**@type{JournalGenerationTemplateService}*/ journalGenerationTemplateService = undefined;

    @inject("JournalService")
    /**@type{JournalService}*/ journalService = undefined;

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

        if (relatedInputs && relatedInputs.length > 0)
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
        let errors = [];

        const invoice = this.invoiceRepository.findById(id);

        if (!invoice)
            throw new NotFoundException();

        const relatedInputs = this.inventoryRepository.findByInvoiceId(id);

        if (relatedInputs && relatedInputs.length > 0)
            errors.push('برای فاکتور جاری ، رسید ورود به انبار صادر شده ، ابتدا رسید (ها) ی ورودی حذف نمایید');

        if (errors.length > 0)
            throw  new ValidationException(errors);

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

    generateInputs(id) {
        const invoice = this.invoiceRepository.findById(id);

        if (!invoice)
            throw new NotFoundException();

        const relatedInputs = this.inventoryRepository.findByInvoiceId(id);

        if (relatedInputs && relatedInputs.length > 0)
            throw new ValidationException([ 'قبلا برای فاکتور جاری رسید (ها) ی ورود به انبار صادر شده' ]);


        this.inventoryGeneratorService.createInputFromPurchase(id);
    }

    removeInputs(id) {
        const invoice = this.invoiceRepository.findById(id);

        if (!invoice)
            throw new NotFoundException();

        const relatedInputs = this.inventoryRepository.findByInvoiceId(id);

        if (!( relatedInputs && relatedInputs.length > 0 ))
            throw new ValidationException([ 'برای فاکتور جاری رسیدی صادر نشده است ' ]);

        relatedInputs.forEach(item => this.inputService.remove(item.id));
    }

    generateJournal(id) {
        let invoice = this.invoiceRepository.findById(id);


        if (!invoice)
            throw new ValidationException([ 'فاکتور وجود ندارد' ]);

        if (invoice.journalId)
            throw new ValidationException([ 'برای فاکتور جاری قبلا سند صادر شده ، ابتدا سند را حذف کنید' ]);

        const relatedInputs = this.inventoryRepository.findByInvoiceId(id);

        if(relatedInputs.asEnumerable().any(item => item.journalId))
            throw new ValidationException([ 'برای رسید های مرتبط سند صادر شده ، امکان صدور سند حسابداری وجود ندارد' ]);


        const journalGenerationTemplate = this.journalGenerationTemplateRepository.findByModel('Purchase');

        if (!journalGenerationTemplate)
            throw new ValidationException([ 'الگوی ساخت سند حسابداری وجود ندارد' ]);


        const journalId = this.journalGenerationTemplateService.generate(journalGenerationTemplate.id, id, 'Inventory');

        Utility.delay(1000);

        this.invoiceRepository.update(id, { journalId });

        this.eventBus.send('PurchaseJournalCreated', id);
    }

    removeJournal(id) {
        const invoice = this.invoiceRepository.findById(id);

        if (!invoice)
            throw new NotFoundException();

        if (!invoice.journalId)
            throw new ValidationException([ 'برای فاکتور جاری سند حسابداری صادر نشده' ]);

        this.journalService.remove(invoice.journalId);

        this.invoiceRepository.update(id, { journalId: null });

        this.eventBus.send('PurchaseJournalRemoved', id);
    }
}
