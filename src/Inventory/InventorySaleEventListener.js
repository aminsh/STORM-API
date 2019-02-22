import { injectable, inject } from "inversify";
import { EventHandler } from "../Infrastructure/@decorators";

@injectable()
export class InventorySaleEventListener {

    @inject("InputService")
    /**@type{InputService}*/ inputService = undefined;

    @inject("OutputService")
    /**@type{OutputService}*/ outputService = undefined;

    @inject("InvoiceRepository")
    /**@type{InvoiceRepository}*/ invoiceRepository = undefined;

    @inject("ProductRepository")
    /**@type{ProductRepository}*/ productRepository = undefined;

    @inject("InventoryRepository")
    /**@type {InventoryRepository}*/ inventoryRepository = undefined;

    @inject("InvoiceCompareService")
    /**@type{InvoiceCompareService}*/ invoiceCompareService = undefined;

    @inject("SettingsRepository")
    /**@type {SettingsRepository}*/ settingsRepository = undefined;

    @inject("InventoryIOTypeRepository")
    /**@type{InventoryIOTypeRepository}*/ inventoryIOTypeRepository = undefined;

    @inject("State") state = undefined;

    @EventHandler("SaleCreated")
    onSaleCreated(saleId) {
        const settings = this.settingsRepository.get(),
            ioType = this.inventoryIOTypeRepository.findByKey('outputSale');

        if (!settings.canSaleGenerateAutomaticOutput)
            return;

        const sale = this.invoiceRepository.findById(saleId);

        if (sale.invoiceLines.asEnumerable().any(item => !item.stockId))
            return;

        if (sale.invoiceLines.asEnumerable().all(item => !this.productRepository.isGood(item.productId)))
            return;

        let lines = sale.invoiceLines,

            linesByStock = lines.asEnumerable().groupBy(
                line => line.stockId,
                line => line,
                (stockId, lines) => ( {
                    stockId,
                    invoiceId: saleId,
                    ioType: ioType.id,
                    lines: lines.toArray()
                } ))
                .toArray();

        linesByStock.forEach(item => {
            const id = this.outputService.create(item);

            Utility.delay(1000);

            this.outputService.confirm(id);
        });
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