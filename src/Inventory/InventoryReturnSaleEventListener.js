import {injectable, inject} from "inversify";
import {EventHandler} from "../Infrastructure/@decorators";

@injectable()
export class InventoryReturnSaleEventListener {

    @inject("InputService")
    /**@type{InputService}*/ inputService = undefined;

    @inject("OutputService")
    /**@type{OutputService}*/ outputService = undefined;

    @inject("InventoryRepository")
    /**@type {InventoryRepository}*/ inventoryRepository = undefined;

    @inject("InvoiceRepository")
    /**@type {InvoiceRepository}*/ invoiceRepository = undefined;

    @inject("ProductRepository")
    /**@type{ProductRepository}*/ productRepository = undefined;

    @inject("InvoiceCompareService")
    /**@type{InvoiceCompareService}*/ invoiceCompareService = undefined;

    @EventHandler("ReturnSaleCreated")
    onReturnSaleCreated(returnSaleId, inventoryIds) {

        const returnSale = this.invoiceRepository.findById(returnSaleId);

        if (inventoryIds && inventoryIds.length > 0)
            return inventoryIds.forEach(id => this.inputService.setInvoice(id, returnSaleId));

        returnSale.invoiceLines.asEnumerable()
            .groupBy(
                item => item.stockId,
                item => item,
                (key, items) => ({
                    stockId: key,
                    invoiceId: returnSaleId,
                    ioType: 'inputBackFromSaleOrConsuming',
                    lines: items.toArray()
                }))
            .forEach(item => this.inputService.create(item));
    }

    @EventHandler("ReturnSaleChanged")
    onReturnSaleChanged(oldReturnSale, returnSaleId, inventoryIds) {

        if (inventoryIds && inventoryIds.length > 0)
            return inventoryIds.forEach(id => this.inputService.setInvoice(id, returnSaleId));

        const newPurchase = this.invoiceRepository.findById(returnSaleId),
            oldLines = oldReturnSale.invoiceLines.filter(item => this.productRepository.isGood(item.productId)),
            newLines = newPurchase.invoiceLines.filter(item => this.productRepository.isGood(item.productId)),

            result = this.invoiceCompareService.compare('input', oldLines, newLines),

            inputs = result.filter(item => item.quantity > 0),
            outputs = result.filter(item => item.quantity < 0).map(item => Object.assign({}, item, {quantity: Math.abs(item.quantity)}));

        inputs.asEnumerable()
            .groupBy(
                item => item.stockId,
                item => item,
                (key, items) => ({
                    stockId: key,
                    invoiceId: returnSaleId,
                    ioType: 'inputBackFromSaleOrConsuming',
                    lines: items.toArray()
                }))
            .forEach(item => this.inputService.create(item));

        outputs.asEnumerable()
            .groupBy(
                item => item.stockId,
                item => item,
                (key, items) => ({
                    stockId: key,
                    invoiceId: returnSaleId,
                    ioType: 'outputSale',
                    lines: items.toArray()
                }))
            .forEach(item => this.outputService.create(item));
    }

    @EventHandler("ReturnSaleRemoved")
    onReturnSaleRemoved(returnSaleId) {

        const inventories = this.inventoryRepository.findByInvoiceId(returnSaleId);

        inventories.forEach(item => this.inventoryRepository.update(item.id, {invoiceId: null}));
    }
}