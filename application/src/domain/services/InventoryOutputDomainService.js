import {inject, injectable} from "inversify";

const PersianDate = Utility.PersianDate;

@injectable()
export class InventoryOutputDomainService {

    /** @type {InventoryControlDomainService}*/
    @inject("InventoryControlDomainService") inventoryControlDomainService = undefined;

    /** @type {ProductDomainService}*/
    @inject("ProductDomainService") productDomainService = undefined;

    /** @type {InventoryRepository}*/
    @inject("InventoryRepository") inventoryRepository = undefined;

    /** @type {SettingsRepository}*/
    @inject("SettingsRepository") settingsRepository = undefined;

    /** @type {StockRepository}*/
    @inject("StockRepository") stockRepository = undefined;

    /** @type {InvoiceRepository}*/
    @inject("InvoiceRepository") invoiceRepository = undefined;

    /** @type {IState}*/
    @inject("State") state;

    createForInvoice(cmd) {
        const settings = this.settingsRepository.get(),

            linesShouldTrackByInventory = cmd.invoiceLines.asEnumerable()
                .where(item => item.productId && this.productDomainService.shouldTrackInventory(item.productId))
                .toArray();

        if (linesShouldTrackByInventory.length === 0)
            return;

        if (settings.productOutputCreationMethod === 'defaultStock')
            cmd.invoiceLines.forEach(item => item.stockId = settings.stockId);
        else {

            let errors = linesShouldTrackByInventory.asEnumerable()
                .where(item => Utility.String.isNullOrEmpty(item.stockId))
                .select(item => `برای کالای ${this.productDomainService.findByIdOrCreate({id: item.productId}).title} انبار انتخاب نشده`)
                .toArray();

            if (errors.length > 0)
                throw new ValidationException(errors);
        }

        let errors = linesShouldTrackByInventory.asEnumerable()
            .select(item => ({
                productId: item.productId,
                stockId: item.stockId,
                hasInventory: this.inventoryRepository.getInventoryByProduct(item.productId, this.state.fiscalPeriodId, item.stockId) >= item.quantity
            }))
            .where(item => !item.hasInventory)
            .select(item => ({
                product: this.productDomainService.findByIdOrCreate({id: item.productId}),
                stock: this.stockRepository.findById(item.stockId)
            }))
            .select(item => `کالای ${item.product.title} در انبار ${item.stock.title} به مقدار تعیین شده موجود نیست`)
            .toArray();

        if (errors.length > 0)
            throw new ValidationException(errors);


        let outputs = linesShouldTrackByInventory.asEnumerable()
            .groupBy(
                item => item.stockId,
                item => item,
                (key, items) => ({
                    stockId: key,
                    lines: items.toArray()
                }))
            .select(item => this.create(item))
            .toArray();

        return outputs;
    }

    create(cmd) {

        let errors = (cmd.lines || cmd.inventoryLines).asEnumerable()
            .select(item => ({
                productId: item.productId,
                stockId: cmd.stockId,
                hasInventory: this.inventoryRepository.getInventoryByProduct(item.productId, this.state.fiscalPeriodId, cmd.stockId) >= item.quantity
            }))
            .where(item => !item.hasInventory)
            .select(item => ({
                product: this.productDomainService.findByIdOrCreate({id: item.productId}),
                stock: this.stockRepository.findById(item.stockId)
            }))
            .select(item => `کالای ${item.product.title} در انبار ${item.stock.title} به مقدار تعیین شده موجود نیست`)
            .toArray();

        if (errors.length > 0)
            throw new ValidationException(errors);

        const number = this.inventoryRepository.outputMaxNumber(this.state.fiscalPeriodId, cmd.stockId, 'outputSale').max || 0;

        let output = {
            number: number + 1,
            date: cmd.date || PersianDate.current(),
            stockId: cmd.stockId,
            inventoryType: 'output',
            ioType: cmd.ioType,
            fiscalPeriodId: this.state.fiscalPeriodId
        };

        output.inventoryLines = (cmd.lines || cmd.inventoryLines).asEnumerable()
            .groupBy(line => line.productId, line => line, (key, items) => ({
                productId: key,
                quantity: items.sum(e => e.quantity)
            }))
            .select(line => ({
                productId: line.productId,
                quantity: line.quantity,
                unitPrice: line.unitPrice
            })).toArray();

        this.inventoryRepository.create(output);

        EventEmitter.emit("onOutputCreated", output.id, this.args);

        return output.id;
    }

    update(id, cmd) {

        let output = this.inventoryRepository.findById(id);

        if (!output)
            throw new ValidationException(['حواله وجود ندارد']);

        if (output.fixQuantity)
            throw new ValidationException(['حواله ثبت تعدادی شده ، امکان ویرایش وجود ندارد']);

        /* for created lines */
        let errors = cmd.inventoryLines.asEnumerable()
            .where(item => !output.inventoryLines.asEnumerable().any(e => e.id === item.id))
            .select(item => ({
                productId: item.productId,
                stockId: cmd.stockId,
                hasInventory: this.inventoryRepository.getInventoryByProduct(item.productId, this.state.fiscalPeriodId, cmd.stockId) >= item.quantity
            }))
            .where(item => !item.hasInventory)
            .select(item => ({
                product: this.productDomainService.findByIdOrCreate({id: item.productId}),
                stock: this.stockRepository.findById(item.stockId)
            }))
            .select(item => `کالای ${item.product.title} در انبار ${item.stock.title} به مقدار تعیین شده موجود نیست`)
            .toArray();

        errors = this.inventoryControlDomainService.validateTurnover({
            stockId: cmd.stockId,
            inventoryLines: cmd.inventoryLines.asEnumerable()

            /* updated lines */
                .where(item => item.id && output.inventoryLines.asEnumerable().any(e => e.id === item.id))

                .select(item => ({
                    id: item.id,
                    productId: item.productId,
                    quantity: item.quantity
                }))
                .toArray()
        }).asEnumerable().concat(errors).toArray();

        if (errors.length > 0)
            throw new ValidationException(errors);

        let entity = {
            number: cmd.ioType === output.ioType && cmd.stockId === output.stockId
                ? output.number
                : (this.inventoryRepository.outputMaxNumber(this.state.fiscalPeriodId, cmd.stockId, cmd.ioType).max || 0) + 1,
            date: cmd.date || output.date,
            stockId: cmd.stockId,
            ioType: cmd.ioType,
            description: cmd.description
        };

        entity.inventoryLines = (cmd.lines || cmd.inventoryLines).asEnumerable()
            .groupBy(
                line => line.productId,
                line => line, (key, items) => ({
                    id: (items.asEnumerable().firstOrDefault(e => e.id) || {}).id,
                    productId: key,
                    quantity: items.sum(e => e.quantity)
                }))
            .select(line => ({
                id: line.id,
                productId: line.productId,
                quantity: line.quantity,
            }))
            .toArray();

        this.inventoryRepository.updateBatch(id, entity);
    }

    remove(id) {
        let output = this.inventoryRepository.findById(id);

        if (!output)
            throw new ValidationException(['حواله وجود ندارد']);

        if (output.fixQuantity)
            throw new ValidationException(['حواله ثبت تعدادی شده ، امکان حذف وجود ندارد']);

        if (!Utility.String.isNullOrEmpty(output.invoiceId))
            throw new ValidationException(['برای حواله جاری فاکتور صادر شده ، امکان حذف وجود ندارد']);

        if (!Utility.String.isNullOrEmpty(output.journalId))
            throw new ValidationException(['برای حواله جاری سند حسابداری صادر شده ، امکان حذف وجود ندارد']);

        this.inventoryRepository.remove(id);
    }

    setInvoice(id, invoiceId) {
        if (Array.isArray(id))
            return id.forEach(id => this._setInvoice(id, invoiceId));

        this._setInvoice(id, invoiceId);
    }

    _setInvoice(id, invoiceId) {

        let inventory = this.inventoryRepository.findById(id),
            invoice = this.invoiceRepository.findById(invoiceId),

            ioTypeDisplay = Enums.InventoryIOType().getDisplay('outputSale');

        inventory.invoiceId = invoice.id;
        inventory.description = 'بابت فاکتور {0} شماره {1}'.format(ioTypeDisplay, invoice.number);
        inventory.ioType = 'outputSale';

        inventory.inventoryLines = inventory.inventoryLines.asEnumerable()
            .join(
                invoice.invoiceLines,
                inventoryLine => inventoryLine.productId,
                invoiceLine => invoiceLine.productId,
                (inventoryLine, invoiceLine) => ({
                    id: inventoryLine.id,
                    invoiceLineId: invoiceLine.id,
                }))
            .toArray();

        this.inventoryRepository.updateBatch(id, inventory);
    }

    calculatePrice(id) {
        let output = this.inventoryRepository.findById(id),

            lines = output.inventoryLines.asEnumerable()
                .select(line => ({
                    id: line.id,
                    unitPrice: this.getPriceByProduct(line.productId, output.createdAt)
                }))
                .toArray();

        this.inventoryRepository.updateBatch(id, {id, inventoryLines: lines});

        if (output.inputId)
            EventEmitter.emit('onOutputSetPrice', output.id, this.state);
    }

    getPriceByProduct(productId, date) {
        if (!date)
            throw new ValidationException(['تاریخ وجود ندارد']);

        let inputs = this.inventoryRepository
            .getAllInputBeforeDate(this.state.fiscalPeriodId, productId, date);

        if (!inputs.asEnumerable().all(item => item.unitPrice && item.unitPrice > 0))
            throw new ValidationException(['رسید (ها) با قیمت صفر وجود دارد -  امکان محاسبه قیمت وجود ندارد']);

        const
            sumPrice = inputs.asEnumerable().sum(e => (e.unitPrice * e.quantity)),
            sumQuantity = inputs.asEnumerable().sum(e => e.quantity);


        return sumPrice / sumQuantity;
    }

    setJournal(id, journalId) {
        this.inventoryRepository.update(id, {journalId});
    }

    /**
     * For Stock to stock
     */
    setInput(id, inputId) {
        this.inventoryRepository.update(id, {inputId});
    }

    fixQuantity(id) {
        this.inventoryRepository.update(id, {fixQuantity: true});
    }

    fixAmount(id) {
        this.inventoryRepository.update(id, {fixAmount: true});
    }
}

