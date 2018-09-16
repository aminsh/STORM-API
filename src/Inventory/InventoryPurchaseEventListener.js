import {injectable, inject} from "inversify";
import {EventHandler} from "../Infrastructure/@decorators";

@injectable()
export class InventoryPurchaseEventListener {

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

    @EventHandler("PurchaseCreated")
    onPurchaseCreated(purchaseId) {

        const purchase = this.invoiceRepository.findById(purchaseId);

        if (purchase.inventoryIds && purchase.inventoryIds.length > 0)
            return purchase.inventoryIds.forEach(id => this.inputService.setInvoice(id, purchaseId));

        purchase.invoiceLines.asEnumerable()
            .groupBy(
                item => item.stockId,
                item => item,
                (key, items) => ({
                    stockId: key,
                    invoiceId: purchaseId,
                    ioType: 'inputPurchase',
                    lines: items.toArray()
                }))
            .forEach(item => this.inputService.create(item));
    }

    @EventHandler("PurchaseChanged")
    onPurchaseChanged(oldPurchase, purchaseId) {

        const newPurchase = this.invoiceRepository.findById(purchaseId);

        if (newPurchase.inventoryIds && newPurchase.inventoryIds.length > 0)
            return newPurchase.inventoryIds.forEach(id => this.inputService.setInvoice(id, purchaseId));

        const oldLines = oldPurchase.invoiceLines.filter(item => this.productRepository.isGood(item.productId)),
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
                    invoiceId: purchaseId,
                    ioType: 'inputPurchase',
                    lines: items.toArray()
                }))
            .forEach(item => this.inputService.create(item));

        outputs.asEnumerable()
            .groupBy(
                item => item.stockId,
                item => item,
                (key, items) => ({
                    stockId: key,
                    invoiceId: purchaseId,
                    ioType: 'outputBackFromPurchase',
                    lines: items.toArray()
                }))
            .forEach(item => this.outputService.create(item));
    }

    @EventHandler("PurchaseRemoved")
    onPurchaseRemoved(purchaseId) {

        const inventories = this.inventoryRepository.findByInvoiceId(purchaseId);

        inventories.forEach(item => this.inventoryRepository.update(item.id, {invoiceId: null}));
    }
}