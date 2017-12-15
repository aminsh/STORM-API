"use strict";

const InputService = require('./inventoryInput'),
    ProductService = require('./product'),
    SettingsRepository = require('./data').SettingsRepository,
    InvoiceRepository = require('./data').InvoiceRepository,
    InventoryRepository = require('./data').InventoryRepository,
    String = instanceOf('utility').String;

class InputPurchaseService {

    constructor(branchId, fiscalPeriodId) {
        this.branchId = branchId;
        this.fiscalPeriodId = fiscalPeriodId;

        this.inputService = new InputService(branchId, fiscalPeriodId);
    }

    create(cmd) {
        const settings = new SettingsRepository(this.branchId).get(),
            productService = new ProductService(this.branchId);

        if (settings.productOutputCreationMethod === 'defaultStock')
            cmd.invoiceLines.forEach(item => item.stockId = settings.stockId);
        else {

            let errors = cmd.invoiceLines.asEnumerable()
                .where(item => productService.shouldTrackInventory(item.productId))
                .where(item => String.isNullOrEmpty(item.stockId))
                .select(item => 'برای کالای {0} انبار انتخاب نشده'.format(productService.findByIdOrCreate({id: item.productId}).title))
                .toArray();

            if (errors.length > 0)
                throw new ValidationException(errors);
        }

        return cmd.invoiceLines.asEnumerable()
            .where(item => productService.shouldTrackInventory(item.productId))
            .groupBy(
                item => item.stockId,
                item => item,
                (key, items) => ({
                    stockId: key,
                    ioType: 'inputBackFromSaleOrConsuming',
                    lines: items.toArray()
                }))
            .select(item => this.inputService.create(item))
            .toArray();
    }

    calculatePrice(id) {

        let input = new InventoryRepository(this.branchId).findById(id),
            invoiceReturn = new InvoiceRepository(branchId).findById(input.invoiceId),
            productAndLastPriceCreatedForThisInvoice = this._getProductAndLastPriceCreatedForThisInvoice(invoiceReturn);

        if (productAndLastPriceCreatedForThisInvoice.asEnumerable().any(item => item.price === 0))
            throw new ValidationException(['قیمت گذاری حواله انجام نشده ، امکان محاسبه قیمت وجود ندارد']);

        let totalPrice = productAndLastPriceCreatedForThisInvoice.asEnumerable().sum(item => item.price),
            totalCharge = invoiceReturn.charges.asEnumerable().sum(e => e.value),

            lines = input.inventoryLines
                .asEnumerable()
                .join(productAndLastPriceCreatedForThisInvoice,
                    inputLine => inputLine.productId,
                    outputLine => outputLine.productId,
                    (inputLine, outputLine) => ({
                        id: inputLine.id,
                        productId: inputLine.productId,
                        unitPrice: (totalCharge * ((100 * outputLine.price) / totalPrice) / 100) + outputLine.price
                    }))
                .where(item => item.productId)
                .toArray();

        this.inputService.setPrice(input.id, lines);
    }

    _getProductAndLastPriceCreatedForThisInvoice(invoice) {

        if (String.isNullOrEmpty(invoice.ofInvoiceId))
            throw new ValidationException(['ofInvoiceId is empty']);

        const outputsByInvoice = new InventoryRepository(this.branchId)
            .findByInvoiceId(invoice.ofInvoiceId, 'output');

        if (!(outputsByInvoice && outputsByInvoice.length > 0))
            throw new ValidationException(['حواله ای برای این فاکتور وجود ندارد']);

        return outputsByInvoice.asEnumerable()

        /*
            if we have more than one price recent price should be write
        */
            .orderByDescending(item => item.createdAt)

            .selectMany(item => item.inventoryLines)
            .groupBy(
                item => item.productId,
                item => item.unitPrice || 0,
                (key, items) => ({productId: key, price: items.first()}))
            .toArray();
    }
}

module.exports = InputPurchaseService;