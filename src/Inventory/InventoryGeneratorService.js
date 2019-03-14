import { inject, injectable } from "inversify";

@injectable()
export class InventoryGeneratorService {
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

    createOutputFromSale(saleId) {
        let beforeInvoices = this.inventoryRepository.findByInvoiceId(saleId);

        if (beforeInvoices && beforeInvoices.length > 0)
            return;

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

    createInputFromPurchase(purchaseId) {
        let beforeInvoices = this.inventoryRepository.findByInvoiceId(purchaseId);

        if (beforeInvoices && beforeInvoices.length > 0)
            return;

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
                    journalId: purchase.journalId,
                    stockId: key,
                    delivererId: purchase.detailAccountId,
                    invoiceId: purchaseId,
                    ioType: ioType.id,
                    lines: items.select(line => {
                        const total = ( line.unitPrice * line.quantity ) - line.discount,
                            rate = ( total * 100 ) / totalPrice,
                            chargeShare = ( totalCharges * rate ) / 100,
                            discountShare = ( purchase.discount * rate ) / 100,
                            value = ( total + chargeShare - discountShare ) / line.quantity;
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
}