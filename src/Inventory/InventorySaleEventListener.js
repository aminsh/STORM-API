import {injectable, inject} from "inversify";
import {EventHandler} from "../Infrastructure/@decorators";

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

    @inject("State") state = undefined;

    @EventHandler("SaleCreated")
    onSaleCreated(saleId) {

        const sale = this.invoiceRepository.findById(saleId);

        let lines = sale.invoiceLines,

            linesByStock = lines.asEnumerable().groupBy(
                line => line.stockId,
                line => line,
                (stockId, lines) => ({
                    stockId,
                    invoiceId: saleId,
                    ioType: 'outputSale',
                    lines: lines.toArray()
                }))
                .toArray();

        linesByStock.forEach(item => this.outputService.create(item));
    }

    @EventHandler("SaleChanged")
    onSaleChanged(oldSale, saleId) {

        const newSale = this.invoiceRepository.findById(saleId),
            oldLines = oldSale.invoiceLines.filter(item => this.productRepository.isGood(item.productId)),
            newLines = newSale.invoiceLines.filter(item => this.productRepository.isGood(item.productId)),

            result = this.invoiceCompareService.compare('output', oldLines, newLines),

            inputs = result.filter(item => item.quantity > 0),
            outputs = result.filter(item => item.quantity < 0).map(item => Object.assign({}, item , {quantity: Math.abs(item.quantity)}));

        inputs.asEnumerable()
            .groupBy(
                item => item.stockId,
                item => item,
                (key, items) => ({
                    stockId: key,
                    invoiceId: saleId,
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
                    invoiceId: saleId,
                    ioType: 'outputSale',
                    lines: items.toArray()
                }))
            .forEach(item => this.outputService.create(item));

    }

    @EventHandler("SaleRemoved")
    onSaleRemoved(sale) {

        const inventories = this.inventoryRepository.findByInvoiceId(sale.id);

        inventories.forEach(item => this.inventoryRepository.update(item.id, {invoiceId: null}));
    }
}