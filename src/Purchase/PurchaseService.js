import {inject, injectable, postConstruct} from "inversify";

const Guid = Utility.Guid,
    PersianDate = Utility.PersianDate;

@injectable()
export class PurchaseService {

    /** @type {ProductService}*/
    @inject("ProductService") productDomainService = undefined;

    /** @type {DetailAccountService}*/
    @inject("DetailAccountService") detailAccountService = undefined;

    /** @type {SettingsRepository}*/
    @inject("SettingsRepository") settingsRepository = undefined;

    /** @type {InvoiceRepository}*/
    @inject("InvoiceRepository") invoiceRepository = undefined;

    @inject("JournalPurchaseGenerationService")
    /**@type{JournalPurchaseGenerationService}*/ journalPurchaseGenerationService = undefined;

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

        if (Guid.isEmpty(line.product) && Utility.String.isNullOrEmpty(line.description))
            errors.push('کالا یا شرح کالا نباید خالی باشد');

        if (!(line.quantity && line.quantity !== 0))
            errors.push('مقدار نباید خالی یا صفر باشد');

        if (!(line.unitPrice && line.unitPrice !== 0))
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
            inventoryIds: cmd.inventoryIds,
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
            inventoryIds: JSON.stringify(entity.inventoryIds),
            invoiceLines: entity.invoiceLines.asEnumerable()
                .select(line => ({
                    id: line.id,
                    productId: line.product ? line.product.id : null,
                    description: line.description,
                    stockId: line.stockId,
                    quantity: line.quantity,
                    unitPrice: line.unitPrice,
                    discount: line.discount,
                    vat: line.vat,
                    tax: line.tax
                }))
                .toArray()
        });
    }

    _mapCostAndCharge(data) {

        if (!data)
            return [];

        if (Array.isArray(data))
            return data.asEnumerable().select(e => ({
                key: e.key,
                value: e.value || 0,
                vatIncluded: e.vatIncluded
            })).toArray();

        return Object.keys(data).asEnumerable()
            .select(key => ({
                key,
                vatIncluded: false,
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
        entity.invoiceStatus = cmd.status !== 'draft' ? 'confirmed' : 'draft';

        let data = this._mapToData(entity);
        this.invoiceRepository.create(data);

        entity.id = data.id;

        if (entity.invoiceStatus !== 'draft') {
            Utility.delay(500);
            this.eventBus.send('PurchaseCreated', entity.id);
        }

        return entity.id;
    }

    confirm(id) {

        const invoice = this.invoiceRepository.findById(id);

        if (!invoice)
            throw new NotFoundException();

        let entity = this.invoiceRepository.findById(id),
            errors = this.validation(entity);

        if (entity.invoiceStatus !== 'draft')
            errors.push('این فاکتور قبلا تایید شده');

        if (errors.length > 0)
            throw  new ValidationException(errors);

        let data = {invoiceStatus: 'confirmed'};

        this.invoiceRepository.update(id, data);

        this.eventBus.send('PurchaseCreated', id);
    }

    update(id, cmd) {

        cmd.id = id;

        const invoice = this.invoiceRepository.findById(id);

        if (!invoice)
            throw new NotFoundException();

        let entity = this.mapToEntity(cmd);

        if (cmd.status !== 'draft')
            entity.invoiceStatus = 'confirmed';

        const data = this._mapToData(entity);

        this.invoiceRepository.updateBatch(id, data);

        if (invoice.invoiceStatus === 'draft' && entity.invoiceStatus === 'confirmed')
            this.eventBus.send('PurchaseCreated', id);
        else
            this.eventBus.send("PurchaseChanged", invoice, id);
    }

    remove(id) {

        const invoice = this.invoiceRepository.findById(id);

        if (!invoice)
            throw new NotFoundException();

        this.invoiceRepository.remove(id);

        this.eventBus.send('PurchaseRemoved', id);
    }

    fix(id) {

        const invoice = this.invoiceRepository.findById(id);

        if (!invoice)
            throw new NotFoundException();

        if (invoice.invoiceStatus === 'draft')
            throw new ValidationException(['فاکتور در وضعیت پیش نویس است ، ابتدا تایید کنید']);

        if (invoice.invoiceStatus === 'fixed')
            throw new ValidationException(['فاکتور قبلا قطعی شده']);

        this.invoiceRepository.update(id, {invoiceStatus: 'fixed'});
    }

    generateJournal(id) {

        const invoice = this.invoiceRepository.findById(id);

        if (!invoice)
            throw new NotFoundException();

        this.journalPurchaseGenerationService.generate(id);
    }
}
