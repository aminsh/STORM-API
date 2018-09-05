import {injectable, inject} from "inversify";
import {EventHandler} from "../Infrastructure/@decorators";

@injectable()
export class InventorySaleEventListener {

    @inject("OutputService")
    /**@type{OutputService}*/ outputService = undefined;

    @inject("InventoryService")
    /**@type{InventoryService}*/ inventoryService = undefined;

    @inject("SaleCompareHistoryService")
    /**@type {SaleCompareHistoryService}*/ saleCompareHistoryService = undefined;

    @inject("InventoryRepository")
    /**@type {InventoryRepository}*/ inventoryRepository = undefined;

    @inject("State") state = undefined;

    @EventHandler("SaleCreated")
    onSaleCreated(sale) {

        let lines = sale.invoiceLines,

            linesByStock = lines.asEnumerable().groupBy(
                line => line.stockId,
                line => line,
                (stockId, lines) => ({
                    stockId,
                    ioType: 'outputSale',
                    lines: lines.toArray()
                }))
                .toArray();

        const ids = linesByStock.map(item => this.outputService.create(item));

        ids.forEach(id => this.inventoryService.setInvoice(id, sale, 'outputSale'));
    }

    @EventHandler("SaleChanged")
    onSaleChanged(oldSale, newSale) {

        this.saleCompareHistoryService.execute(newSale);

    }

    @EventHandler("SaleRemoved")
    onSaleRemoved(sale) {

        const inventories = this.inventoryRepository.findByInvoiceId(sale.id);

        inventories.forEach(item => this.inventoryRepository.remove(item.id));
    }
}