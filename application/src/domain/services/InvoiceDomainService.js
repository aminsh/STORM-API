import {inject, injectable, postConstruct} from "inversify";

const PersianDate = Utility.PersianDate,
    Guid = Utility.Guid;

@injectable()
export class InvoiceDomainService {

    /** @type {InvoiceInventoryDomainService}*/
    @inject("InvoiceInventoryDomainService") invoiceInventoryDomainService = undefined;

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

    /** @type {TreasuryPurposeRepository}*/
    @inject("TreasuryPurposeRepository") treasuryPurposeRepository = undefined;


    /** @type {IState}*/
    @inject("State") state = undefined;

    /** @type {EventBus}*/
    @inject("EventBus") eventBus = undefined;

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

    getNumber(number, persistedInvoice) {

        const _getNumber = () => persistedInvoice
            ? persistedInvoice.number
            : this.invoiceRepository.maxNumber('sale') + 1;

        if (!number)
            return _getNumber();

        const isNumberDuplicated = this.invoiceRepository.isNumberDuplicated(number, 'sale', (persistedInvoice || {}).id);

        if (isNumberDuplicated)
            return _getNumber();

        return number;
    }

    mapToEntity(cmd) {

        const detailAccount = this.detailAccountDomainService.findPersonByIdOrCreate(cmd.customer),
            invoice = cmd.id ? this.invoiceRepository.findById(cmd.id) : undefined;

        return {
            id: cmd.id,
            date: cmd.date || PersianDate.current(),
            number: this.getNumber(cmd.number, invoice),
            description: cmd.description,
            title: cmd.title,
            detailAccountId: detailAccount ? detailAccount.id : null,
            orderId: cmd.orderId,
            costs: this._mapCostAndCharge(cmd.costs),
            charges: this._mapCostAndCharge(cmd.charges),
            bankReceiptNumber: cmd.bankReceiptNumber,
            discount: isNaN(parseFloat(cmd.discount)) ? 0 : parseFloat(cmd.discount),
            invoiceLines: this._mapLines(cmd.invoiceLines).asEnumerable()
                .select(line => {

                    let product = this.productDomainService.findByIdOrCreate(line.product);

                    product = product ? product : {id: undefined, title: undefined};

                    return {
                        id: line.id,
                        productId: product ? product.id : null,
                        description: line.description || product.title,
                        stockId: line.stockId,
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
            return data.asEnumerable().select(e => ({key: e.key, value: e.value || 0, vatIncluded: e.vatIncluded})).toArray();

        return Object.keys(data).asEnumerable()
            .select(key => ({
                key,
                vatIncluded: false,
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

    create(cmd) {

        let entity = this.mapToEntity(cmd),
            errors = this._validate(entity),
            inventoryIds;

        if (errors.length > 0)
            throw new ValidationException(errors);

        if (cmd.status && cmd.status !== 'draft')
            inventoryIds = this.invoiceInventoryDomainService.control(entity);

        entity.invoiceType = 'sale';
        entity.invoiceStatus = !cmd.status || cmd.status === 'draft' ? 'draft' : 'confirmed';
        entity.inventoryIds = JSON.stringify(inventoryIds);

        entity = this.invoiceRepository.create(this._mapToData(entity));

        if (inventoryIds)
            this.invoiceInventoryDomainService.setInvoiceToOutput(entity.id, inventoryIds);

        this.eventBus.send("onInvoiceCreated", entity.id);

        return entity.id;
    }

    confirm(id) {

        let entity = this.invoiceRepository.findById(id),
            errors = [];

        if (entity.invoiceStatus !== 'draft')
            errors.push('این فاکتور قبلا تایید شده');

        if (errors.length > 0)
            throw  new ValidationException(errors);

        let inventoryIds = this.invoiceInventoryDomainService.control(entity);

        if (inventoryIds)
            this.invoiceInventoryDomainService.setInvoiceToOutput(entity.id, inventoryIds);

        let data = {
            inventoryIds: JSON.stringify(inventoryIds),
            invoiceStatus: 'confirmed'
        };

        this.invoiceRepository.update(id, data);

        this.eventBus.send("onInvoiceConfirmed", entity.id);
    }

    update(id, cmd) {

        let inventoryIds;

        const invoice = this.invoiceRepository.findById(id);

        if (invoice.invoiceStatus === 'fixed')
            throw new ValidationException(['فاکتور جاری قابل ویرایش نمیباشد']);

        let entity = this.mapToEntity(cmd),
            errors = this._validate(entity);

        if (errors.length > 0)
            throw new ValidationException(errors);

        inventoryIds = this.invoiceInventoryDomainService.control(entity);

        if (inventoryIds)
            this.invoiceInventoryDomainService.setInvoiceToOutput(id, inventoryIds);

        entity.inventoryIds = JSON.stringify(inventoryIds);
        entity.invoiceStatus = cmd.status !== 'draft' ? 'confirmed' : 'draft';

        this.invoiceRepository.updateBatch(id, this._mapToData(entity));

        Utility.delay(500);

        this.eventBus.send("onInvoiceChanged", id);
    }

    remove(id) {
        const invoice = this.invoiceRepository.findById(id);

        if (invoice.invoiceStatus !== 'draft')
            throw new ValidationException(['فاکتور جاری قابل حذف نمیباشد']);

        this.invoiceRepository.remove(id);
        this.treasuryPurposeRepository.removeByReferenceId(id);
    }

    setJournal(id, journalId) {
        return this.invoiceRepository.update(id, {journalId});
    }

    pay(id, payments) {

        const paymentIds = this.paymentDomainService.createMany(payments, 'receive');

        this.paymentDomainService.setInvoiceForAll(paymentIds, id);

        return paymentIds;
    }
}

