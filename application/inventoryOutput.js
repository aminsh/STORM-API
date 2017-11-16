"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    PersianDate = instanceOf('utility').PersianDate,
    String = instanceOf('utility').String,
    Enums = instanceOf('Enums'),
    InventoryRepository = require('./data').InventoryeRepository,
    InvoiceRepository = require('./data').InvoiceRepository,
    SettingsRepository = require('./data').SettingsRepository,
    StockRepository = require('./data').StockRepository,
    ProductService = require('./product');

class OutputService {

    constructor(branchId, fiscalPeriodId) {

        this.fiscalPeriodId = fiscalPeriodId;
        this.branchId = branchId;

        this.inventoryRepository = new InventoryRepository(branchId);
        this.invoiceRepository = new InvoiceRepository(branchId);
    }

    createForInvoice(cmd) {
        const settings = await(new SettingsRepository(this.branchId).get()),
            productService = new ProductService(this.branchId),
            stockRepository = new StockRepository(this.branchId);

        if (settings.productOutputCreationMethod === 'defaultStock')
            cmd.invoiceLines.forEach(item => item.stockId = settings.stockId);
        else {

            let errors = cmd.invoiceLines.asEnumerable()
                .where(item => productService.shouldTrackInventory(item.productId))
                .where(item => String.isNullOrEmpty(item.stockId))
                .select(item => `برای کالای ${productService.findByIdOrCreate({id: item.productId}).title} انبار انتخاب نشده`)
                .toArray();

            if (errors.length > 0)
                throw new ValidationException(errors);
        }

        let errors = cmd.invoiceLines.asEnumerable()
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


        let outputs = cmd.invoiceLines.asEnumerable()
            .where(item => productService.shouldTrackInventory(item.productId))
            .groupBy(
                item => item.stockId,
                item => item,
                (key, items) => ({
                    stockId: key,
                    lines: items.toArray()
                }))
            .select(item => this.create(item))
            .select(item => item.id)
            .toArray();

        return outputs;
    }

    create(cmd) {

        const number = this.inventoryRepository.outputMaxNumber(this.fiscalPeriodId,cmd.stockId, 'outputSale').max || 0;

        let output = {
            number: number + 1,
            date: cmd.date || PersianDate.current(),
            stockId: cmd.stockId,
            inventoryType: 'output',
            fiscalPeriodId: this.fiscalPeriodId
        };

        output.inventoryLines = cmd.lines.asEnumerable()
            .select(line => ({
                productId: line.productId,
                quantity: line.quantity,
            })).toArray();

        await(this.inventoryRepository.create(output));

        return output;
    }

    setInvoice(id, invoiceId) {
        if (Array.isArray(id))
            return id.forEach(async.result(id => this._setInvoice(id, invoiceId)));

        return this._setInvoice(id, invoiceId);
    }

    _setInvoice(id, invoiceId) {

        let inventory = await(this.inventoryRepository.findById(id)),
            invoice = await(this.invoiceRepository.findById(invoiceId)),

            ioTypeDisplay = Enums.InventoryIOType().getDisplay('outputSale');

        inventory.invoiceId = invoice.id;
        inventory.description = `بابت فاکتور ${ioTypeDisplay} شماره ${invoice.number}`;
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
        let output = await(this.inventoryRepository.findById(id));

        output.inventoryLines.forEach(async.result(line => line.unitPrice = this.getPriceByProduct(line.productId)));

        await(this.inventoryRepository.updateBatch(id, output));
    }

    getPriceByProduct(productId) {
        let inputs = await(this.inventoryRepository
            .getAllInputBeforeDate(this.fiscalPeriodId, productId, new Date));

        if (!inputs.asEnumerable().all(item => item.unitPrice && item.unitPrice > 0))
            throw new ValidationException(['رسید (ها) با قیمت صفر وجود دارد -  امکان محاسبه قیمت وجود ندارد']);

        const
            sumPrice = inputs.asEnumerable().sum(e => (e.unitPrice * e.quantity)),
            sumQuantity = inputs.asEnumerable().sum(e => e.quantity);


        return sumPrice / sumQuantity;
    }

    setJournal(id, journalId) {
        return this.inventoryRepository.update(id, {journalId});
    }
}

module.exports = OutputService;