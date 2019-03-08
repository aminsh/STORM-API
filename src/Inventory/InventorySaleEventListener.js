import { injectable, inject } from "inversify";
import { EventHandler } from "../Infrastructure/@decorators";

@injectable()
export class InventorySaleEventListener {

    @inject("InventoryRepository")
    /**@type {InventoryRepository}*/ inventoryRepository = undefined;

    @inject('InventoryGeneratorService')
    /**@type {InventoryGeneratorService}*/ inventoryGeneratorService = undefined;

    @EventHandler("SaleCreated")
    onSaleCreated(saleId) {
        this.inventoryGeneratorService.createOutputFromSale(saleId);
    }

    @EventHandler("SaleChanged")
    onSaleChanged(saleId) {
        this.onSaleCreated(saleId);
    }

    @EventHandler("SaleRemoved")
    onSaleRemoved(sale) {
        const inventories = this.inventoryRepository.findByInvoiceId(sale.id);
        inventories.forEach(item => this.inventoryRepository.remove(item.id));
    }
}