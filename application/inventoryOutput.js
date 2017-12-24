"use strict";

class OutputService {

    constructor(branchId, fiscalPeriodId, user) {

        this.args = {branchId, fiscalPeriodId, user};

        this.fiscalPeriodId = fiscalPeriodId;
        this.branchId = branchId;

        this.inventoryRepository = new InventoryRepository(branchId);
        this.invoiceRepository = new InvoiceRepository(branchId);

        this.inventoryControlService = new InventoryControlService(branchId, fiscalPeriodId);
    }

    createForInvoice(cmd) {
        const settings = await(new SettingsRepository(this.branchId).get()),
            productService = new ProductService(this.branchId),
            stockRepository = new StockRepository(this.branchId),

            linesShouldTrackByInventory = cmd.invoiceLines.asEnumerable()
                .where(item => item.productId && productService.shouldTrackInventory(item.productId))
                .toArray();

        if(linesShouldTrackByInventory.length === 0)
            return;

        if (settings.productOutputCreationMethod === 'defaultStock')
            cmd.invoiceLines.forEach(item => item.stockId = settings.stockId);
        else {

            let errors = linesShouldTrackByInventory.asEnumerable()
                .where(item => String.isNullOrEmpty(item.stockId))
                .select(item => `برای کالای ${productService.findByIdOrCreate({id: item.productId}).title} انبار انتخاب نشده`)
                .toArray();

            if (errors.length > 0)
                throw new ValidationException(errors);
        }

        let errors = linesShouldTrackByInventory.asEnumerable()
            .select(item => ({
                productId: item.productId,
                stockId: item.stockId,
                hasInventory: this.inventoryRepository.getInventoryByProduct(item.productId, this.fiscalPeriodId, item.stockId) >= item.quantity
            }))
            .where(item => !item.hasInventory)
            .select(item => ({
                product: productService.findByIdOrCreate({id: item.productId}),
                stock: stockRepository.findById(item.stockId)
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
        const productService = new ProductService(this.branchId),
            stockRepository = new StockRepository(this.branchId);

        let errors = (cmd.lines || cmd.inventoryLines).asEnumerable()
            .select(item => ({
                productId: item.productId,
                stockId: cmd.stockId,
                hasInventory: this.inventoryRepository.getInventoryByProduct(item.productId, this.fiscalPeriodId, cmd.stockId) >= item.quantity
            }))
            .where(item => !item.hasInventory)
            .select(item => ({
                product: productService.findByIdOrCreate({id: item.productId}),
                stock: stockRepository.findById(item.stockId)
            }))
            .select(item => `کالای ${item.product.title} در انبار ${item.stock.title} به مقدار تعیین شده موجود نیست`)
            .toArray();

        if (errors.length > 0)
            throw new ValidationException(errors);

        const number = this.inventoryRepository.outputMaxNumber(this.fiscalPeriodId, cmd.stockId, 'outputSale').max || 0;

        let output = {
            number: number + 1,
            date: cmd.date || PersianDate.current(),
            stockId: cmd.stockId,
            inventoryType: 'output',
            ioType: cmd.ioType,
            fiscalPeriodId: this.fiscalPeriodId
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

        await(this.inventoryRepository.create(output));

        EventEmitter.emit("onOutputCreated", output.id, this.args);

        return output.id;
    }

    update(id, cmd) {

        const productService = new ProductService(this.branchId, this.fiscalPeriodId),
            stockRepository = new StockRepository(this.branchId);

        let output = this.inventoryRepository.findById(id);

        if (!output)
            throw new ValidationException(['حواله وجود ندارد']);

        if(output.fixQuantity)
            throw new ValidationException(['حواله ثبت تعدادی شده ، امکان ویرایش وجود ندارد']);

        /* for created lines */
        let errors = cmd.inventoryLines.asEnumerable()
            .where(item => !output.inventoryLines.asEnumerable().any(e => e.id === item.id))
            .select(item => ({
                productId: item.productId,
                stockId: cmd.stockId,
                hasInventory: this.inventoryRepository.getInventoryByProduct(item.productId, this.fiscalPeriodId, cmd.stockId) >= item.quantity
            }))
            .where(item => !item.hasInventory)
            .select(item => ({
                product: productService.findByIdOrCreate({id: item.productId}),
                stock: stockRepository.findById(item.stockId)
            }))
            .select(item => `کالای ${item.product.title} در انبار ${item.stock.title} به مقدار تعیین شده موجود نیست`)
            .toArray();

        errors = this.inventoryControlService.validateTurnover({
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
                : (this.inventoryRepository.outputMaxNumber(this.fiscalPeriodId, cmd.stockId, cmd.ioType).max || 0) + 1,
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

        if(output.fixQuantity)
            throw new ValidationException(['حواله ثبت تعدادی شده ، امکان حذف وجود ندارد']);

        if (!String.isNullOrEmpty(output.invoiceId))
            throw new ValidationException(['برای حواله جاری فاکتور صادر شده ، امکان حذف وجود ندارد']);

        if (!String.isNullOrEmpty(output.journalId))
            throw new ValidationException(['برای حواله جاری سند حسابداری صادر شده ، امکان حذف وجود ندارد']);

        this.inventoryRepository.remove(id);
    }

    setInvoice(id, invoiceId) {
        if (Array.isArray(id))
            return id.forEach(id => this._setInvoice(id, invoiceId));

        this._setInvoice(id, invoiceId);
    }

    _setInvoice(id, invoiceId) {

        let inventory = await(this.inventoryRepository.findById(id)),
            invoice = await(this.invoiceRepository.findById(invoiceId)),

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

        await(this.inventoryRepository.updateBatch(id, inventory));
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
            EventEmitter.emit('onOutputSetPrice', output.id, this.args);
    }

    getPriceByProduct(productId, date) {
        if (!date)
            throw new ValidationException(['تاریخ وجود ندارد']);

        let inputs = this.inventoryRepository
            .getAllInputBeforeDate(this.fiscalPeriodId, productId, date);

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

    fixQuantity(id){
        this.inventoryRepository.update(id, {fixQuantity: true});
    }

    fixAmount(id){
        this.inventoryRepository.update(id, {fixAmount: true});
    }
}

module.exports = OutputService;

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    EventEmitter = instanceOf('EventEmitter'),
    PersianDate = instanceOf('utility').PersianDate,
    String = instanceOf('utility').String,
    Enums = instanceOf('Enums'),
    InventoryRepository = require('./data').InventoryRepository,
    InvoiceRepository = require('./data').InvoiceRepository,
    SettingsRepository = require('./data').SettingsRepository,
    StockRepository = require('./data').StockRepository,
    ProductService = require('./product'),
    InventoryControlService = require('./inventoryControl');