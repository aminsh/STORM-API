"use strict";

const InputService = require('./inventoryInput'),
    ProductService = require('./product'),
    SettingsRepository = require('./data').SettingsRepository,
    InvoiceRepository = require('./data').InvoiceRepository,
    InventoryRepository = require('./data').InventoryRepository;

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

        let inputs = cmd.invoiceLines.asEnumerable()
            .where(item => productService.shouldTrackInventory(item.productId))
            .groupBy(
                item => item.stockId,
                item => item,
                (key, items) => ({
                    stockId: key,
                    lines: items.toArray()
                }))
            .select(item => this.inputService.create(item))
            .select(item => item.id)
            .toArray();

        return inputs;
    }

    setPrice(ids, invoiceId) {

        const inventoryRepository = new InventoryRepository(this.branchId);

        let invoice = new InvoiceRepository(this.branchId).findById(invoiceId),
            inputs = ids.asEnumerable().select(id => inventoryRepository.findById(id)).toArray();

        inputs.forEach(input => {
           let list = input.inventoryLines.asEnumerable()
               .select(line => {

                   let invoiceLine = invoice.invoiceLines.asEnumerable()
                       .single(invoiceLine => invoiceLine.id === line.invoiceLineId);

                   return {
                       id: line.id,
                       unitPrice: invoiceLine.unitPrice - invoiceLine.discount
                   };
               })
               .toArray();

           this.inputService.setPrice(input.id, list);
        });

    }
}

module.exports = InputPurchaseService;