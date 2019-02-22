import { injectable, inject } from "inversify";
import { EventHandler } from "../Infrastructure/@decorators";

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

    @inject("InventoryIOTypeRepository")
    /**@type{InventoryIOTypeRepository}*/ inventoryIOTypeRepository = undefined;

    @EventHandler("ReturnSaleCreated")
    onReturnSaleCreated(returnSaleId) {

        const returnSale = this.invoiceRepository.findById(returnSaleId),
            outputs = returnSale.ofInvoiceId
                ? this.inventoryRepository.findByInvoiceId(returnSale.ofInvoiceId, 'output')
                : [],
            ioType = this.inventoryIOTypeRepository.findByKey('inputBackFromSaleOrConsuming');

        if (returnSale.inventoryIds && returnSale.inventoryIds.length > 0)
            return returnSale.inventoryIds.forEach(id => this.inputService.setInvoice(id, returnSaleId));

        returnSale.invoiceLines.asEnumerable()
            .groupBy(
                item => item.stockId,
                item => item,
                (key, items) => ( {
                    stockId: key,
                    invoiceId: returnSaleId,
                    ioType: ioType.id,
                    lines: items.select(e => ( {
                        productId: e.productId,
                        quantity: e.quantity,
                        baseInventoryId: ( outputs.asEnumerable()
                            .selectMany(o => o.inventoryLines)
                            .firstOrDefault(o => o.productId === e.productId) || {} ).inventoryId
                    } )).toArray()
                } ))
            .forEach(item => {

                const id = this.inputService.create(item);

                Utility.delay(1000);

                this.inputService.confirm(id);
            });
    }

    @EventHandler("ReturnSaleChanged")
    onReturnSaleChanged(returnSaleId) {
        this.onReturnSaleCreated(returnSaleId);
    }

    @EventHandler("ReturnSaleRemoved")
    onReturnSaleRemoved(returnSaleId) {

        const inventories = this.inventoryRepository.findByInvoiceId(returnSaleId);

        inventories.forEach(item => this.inventoryRepository.update(item.id, { invoiceId: null }));
    }
}