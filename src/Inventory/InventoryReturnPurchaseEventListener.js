import {injectable, inject} from "inversify";
import {EventHandler} from "../Infrastructure/@decorators";

@injectable()
export class InventoryReturnPurchaseEventListener {

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

    @EventHandler("ReturnPurchaseCreated")
    onReturnPurchaseCreated(returnPurchaseId) {

        const returnPurchase = this.invoiceRepository.findById(returnPurchaseId);

        if (returnPurchase.inventoryIds && returnPurchase.inventoryIds.length > 0)
            return returnPurchase.inventoryIds.forEach(id => this.inputService.setInvoice(id, returnPurchaseId));

        returnPurchase.invoiceLines.asEnumerable()
            .groupBy(
                item => item.stockId,
                item => item,
                (key, items) => ({
                    stockId: key,
                    invoiceId: returnPurchaseId,
                    ioType: 'outputBackFromPurchase',
                    lines: items.toArray()
                }))
            .forEach(item => {

                const id = this.outputService.create(item);

                Utility.delay(1000);

                this.outputService.confirm(id);
            });
    }

    @EventHandler("ReturnPurchaseChanged")
    onReturnPurchaseChanged(oldReturnPurchase, returnPurchaseId) {

        const newPurchase = this.invoiceRepository.findById(returnPurchaseId);

        if (newPurchase.inventoryIds && newPurchase.inventoryIds.length > 0)
            return newPurchase.inventoryIds.forEach(id => this.inputService.setInvoice(id, returnPurchaseId));

        const oldLines = oldReturnPurchase.invoiceLines.filter(item => this.productRepository.isGood(item.productId)),
            newLines = newPurchase.invoiceLines.filter(item => this.productRepository.isGood(item.productId)),

            result = this.invoiceCompareService.compare('output', oldLines, newLines),

            inputs = result.filter(item => item.quantity > 0),
            outputs = result.filter(item => item.quantity < 0).map(item => Object.assign({}, item, {quantity: Math.abs(item.quantity)}));

        inputs.asEnumerable()
            .groupBy(
                item => item.stockId,
                item => item,
                (key, items) => ({
                    stockId: key,
                    invoiceId: returnPurchaseId,
                    ioType: 'inputPurchase',
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
                    invoiceId: returnPurchaseId,
                    ioType: 'outputBackFromPurchase',
                    lines: items.toArray()
                }))
            .forEach(item => {

                const id = this.outputService.create(item);

                Utility.delay(1000);

                this.outputService.confirm(id);
            });
    }

    @EventHandler("ReturnPurchaseRemoved")
    onReturnPurchaseRemoved(returnPurchaseId) {

        const inventories = this.inventoryRepository.findByInvoiceId(returnPurchaseId);

        inventories.forEach(item => this.inventoryRepository.update(item.id, {invoiceId: null}));
    }
}