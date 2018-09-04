import {injectable, inject} from "inversify";
import {EventHandler} from "../Infrastructure/@decorators";

@injectable()
export class InventoryPurchaseEventListener {

    @inject("InputService")
    /**@type{InputService}*/ inputService = undefined;

    @inject("InventoryService")
    /**@type{InventoryService}*/ inventoryService = undefined;

    @inject("PurchaseCompareHistoryService")
    /**@type {PurchaseCompareHistoryService}*/ purchaseCompareHistoryService = undefined;

    @inject("InventoryRepository")
    /**@type {InventoryRepository}*/ inventoryRepository = undefined;

    @EventHandler("PurchaseCreated")
    onPurchaseCreated(purchase) {

        const ids = purchase.invoiceLines.asEnumerable()
            .groupBy(
                item => item.stockId,
                item => item,
                (key, items) => ({
                    stockId: key,
                    ioType: 'inputPurchase',
                    lines: items.toArray()
                }))
            .select(item => this.inputService.create(item))
            .toArray();

        ids.forEach(id => this.inventoryService.setInvoice(id, purchase, 'inputPurchase'));
    }

    @EventHandler("PurchaseChanged")
    onPurchaseChanged(oldPurchase, newPurchase) {

        this.purchaseCompareHistoryService.execute(newPurchase);
    }

    @EventHandler("PurchaseRemoved")
    onPurchaseRemoved(purchase) {

        const inventories = this.inventoryRepository.findByInvoiceId(purchase.id);

        inventories.forEach(item => this.inventoryRepository.remove(item.id));
    }
}