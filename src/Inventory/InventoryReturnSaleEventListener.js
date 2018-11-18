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
    onReturnSaleCreated(returnSaleId) {

        const returnSale = this.invoiceRepository.findById(returnSaleId);

        if (returnSale.inventoryIds && returnSale.inventoryIds.length > 0)
            return returnSale.inventoryIds.forEach(id => this.inputService.setInvoice(id, returnSaleId));

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
            .forEach(item => {

                const id = this.inputService.create(item);

                Utility.delay(1000);

                this.inputService.confirm(id);
            });
    }

    @EventHandler("ReturnSaleChanged")
    onReturnSaleChanged(oldReturnSale, returnSaleId) {

        const newPurchase = this.invoiceRepository.findById(returnSaleId);

        if (newPurchase.inventoryIds && newPurchase.inventoryIds.length > 0)
            return newPurchase.inventoryIds.forEach(id => this.inputService.setInvoice(id, returnSaleId));

        const oldLines = oldReturnSale.invoiceLines.filter(item => this.productRepository.isGood(item.productId)),
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
            .forEach(item => {

                const id = this.inputService.create(item);

                Utility.delay(1000);

                this.inputService.confirm(id);
            });

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
            .forEach(item => {

                const id = this.outputService.create(item);

                Utility.delay(1000);

                this.outputService.confirm(id);
            });
    }

    @EventHandler("ReturnSaleRemoved")
    onReturnSaleRemoved(returnSaleId) {

        const inventories = this.inventoryRepository.findByInvoiceId(returnSaleId);

        inventories.forEach(item => this.inventoryRepository.update(item.id, {invoiceId: null}));
    }
}