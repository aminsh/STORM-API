import {inject, injectable, postConstruct} from "inversify";

@injectable()
export class InvoiceInventoryDomainService {

    /** @type {InventoryOutputDomainService}*/
    @inject("InventoryOutputDomainService") inventoryOutputDomainService = undefined;

    /** @type {SettingsRepository}*/
    @inject("SettingsRepository") settingsRepository = undefined;

    /** @type {ProductRepository}*/
    @inject("ProductRepository") productRepository = undefined;

    /** @type {InventoryRepository}*/
    @inject("InventoryRepository") inventoryRepository = undefined;

    /**@type {InvoiceReturnDomainService}*/
    @inject("InvoiceReturnDomainService") invoiceReturnDomainService = undefined;

    /**@type {InputPurchaseDomainService}*/
    @inject("InputPurchaseDomainService") inputPurchaseDomainService = undefined;

    /**@type {InventoryInputDomainService}*/
    @inject("InventoryInputDomainService") inventoryInputDomainService = undefined;

    @postConstruct()
    init() {
        this.settings = this.settingsRepository.get();
    }

    createOutput(invoice) {

        return this.inventoryOutputDomainService.createForInvoice(invoice);
    }

    setInvoiceToOutput(invoiceId, inventoryIds) {

        this.inventoryOutputDomainService.setInvoice(inventoryIds, invoiceId, 'outputSale');
    }

    control(invoiceDTO) {

        let ids,
            invoice = Object.assign({}, invoiceDTO);

        if (!this.shouldControl(invoice))
            return;

        if (this.hasInventoryOutputBefore(invoice)) {
            let compareResult = this.compareWithPreviousOutputs(invoice);

            if (compareResult.output && compareResult.output.length > 0)
                ids = this.createOutput({invoiceLines: compareResult.output});

            if (compareResult.input && compareResult.input.length > 0)
                this.createInput(
                    compareResult.input.map(input => ({
                        productId: input.productId,
                        quantity: Math.abs(input.quantity),
                        stockId: input.stockId
                    })), invoice
                );

        }
        else
            ids = this.createOutput(invoice);

        return ids;
    }

    shouldControl(invoice) {
        if (!this.settings.canControlInventory)
            return;

        return invoice.invoiceLines.asEnumerable()
            .any(line => this.productRepository.isGood(line.productId));

    }

    hasInventoryOutputBefore(invoice) {

        if (!invoice.id)
            return false;

        let inventories = (this.inventoryRepository.findByInvoiceId(invoice.id) || []);

        invoice.inventories = inventories;

        return inventories.length > 0;
    }

    createInput(lines, invoice) {
        let cmd = {invoiceLines: lines};

        return cmd.invoiceLines.asEnumerable()
            .where(item => this.productRepository.isGood(item.productId))
            .groupBy(
                item => item.stockId,
                item => item,
                (key, items) => ({
                    stockId: key,
                    invoiceId: invoice.id,
                    description: 'بابت برگشت فاکتور فروش شماره {0}'.format(invoice.number),
                    ioType: 'inputBackFromSaleOrConsuming',
                    lines: items.toArray()
                }))
            .select(item => this.inventoryInputDomainService.create(item))
            .toArray();
    }

    compareWithPreviousOutputs(invoice) {
        let invoiceLines = invoice.invoiceLines.asEnumerable().where(e => this.productRepository.isGood(e.productId)).toArray(),
            inventoryLines = invoice.inventories.asEnumerable()
                .selectMany(
                    e => e.inventoryLines,
                    (inventory, inventoryLine) => Object.assign({}, inventoryLine, {type: inventory.inventoryType, stockId: inventory.stockId})
                )
                .groupBy(
                    item => item.productId,
                    item => item,
                    (productId, items) => ({
                        productId,
                        quantity: items.sum(e => e.type === 'output' ? e.quantity : e.quantity * -1),
                        stockId: items.first().stockId
                    }))
                .toArray(),

            newLines = invoiceLines.asEnumerable().where(e => !inventoryLines.asEnumerable().any(p => p.productId === e.productId)).toArray(),
            compareEqualProduct = invoiceLines.asEnumerable()
                .join(inventoryLines, item => item.productId, item => item.productId, (invoice, inventory) => ({
                    productId: invoice.productId,
                    stockId: invoice.stockId,
                    quantity: invoice.quantity - inventory.quantity
                }))
                .toArray(),
            removedLines = inventoryLines.asEnumerable().where(e => !invoiceLines.asEnumerable().any(p => p.productId === e.productId)).toArray(),


            output = compareEqualProduct.asEnumerable().where(e => e.quantity > 0)
                .concat(newLines)
                .toArray(),

            input = compareEqualProduct.asEnumerable().where(e => e.quantity < 0)
                .concat(removedLines)
                .toArray();

        return {input, output};
    }
}