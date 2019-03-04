import { injectable, inject } from "inversify";
import { EventHandler } from "../Infrastructure/@decorators";

@injectable()
export class InventoryPurchaseEventListener {

    @inject("InputService")
    /**@type{InputService}*/ inputService = undefined;

    @inject("InventoryRepository")
    /**@type {InventoryRepository}*/ inventoryRepository = undefined;

    @inject("InvoiceRepository")
    /**@type {InvoiceRepository}*/ invoiceRepository = undefined;

    @inject("InventoryIOTypeRepository")
    /**@type{InventoryIOTypeRepository}*/ inventoryIOTypeRepository = undefined;

    @EventHandler("PurchaseCreated")
    onPurchaseCreated(purchaseId) {

        const purchase = this.invoiceRepository.findById(purchaseId),
            totalPrice = purchase.invoiceLines.asEnumerable().sum(item => ( item.unitPrice * item.quantity ) - item.discount),
            totalCharges = ( purchase.charges && purchase.charges.length > 0 )
                ? purchase.charges.asEnumerable().sum(item => item.value)
                : 0,
            ioType = this.inventoryIOTypeRepository.findByKey('inputPurchase');

        purchase.invoiceLines.asEnumerable()
            .groupBy(
                item => item.stockId,
                item => item,
                (key, items) => ( {
                    date: purchase.date,
                    time: purchase.createdAt,
                    stockId: key,
                    delivererId: purchase.detailAccountId,
                    invoiceId: purchaseId,
                    ioType: ioType.id,
                    lines: items.select(line => {
                        const total = ( line.unitPrice * line.quantity ) - line.discount,
                            rate = ( total * 100 ) / totalPrice,
                            chargeShare = ( totalCharges * rate ) / 100,
                            value = ( total + chargeShare ) / line.quantity;
                        return {
                            productId: line.productId,
                            quantity: line.quantity,
                            unitPrice: value,
                            vat: line.vat,
                            tax: line.tax
                        }
                    }).toArray()
                } ))
            .forEach(item => {
                const id = this.inputService.create(item);

                Utility.delay(1000);

                this.inputService.confirm(id);
            });
    }

    @EventHandler("PurchaseChanged")
    onPurchaseChanged(purchaseId) {
        this.onPurchaseCreated(purchaseId)
    }

    @EventHandler("PurchaseRemoved")
    onPurchaseRemoved(purchaseId) {
        const inventories = this.inventoryRepository.findByInvoiceId(purchaseId);
        inventories.forEach(item => this.inventoryRepository.update(item.id, { invoiceId: null }));
    }
}