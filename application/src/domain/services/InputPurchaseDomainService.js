import {inject, injectable} from "inversify";

@injectable()
export class InputPurchaseDomainService {

    /**@type {InventoryInputDomainService}*/
    @inject("InventoryInputDomainService") inventoryInputDomainService = undefined;

    /** @type {ProductRepository}*/
    @inject("ProductRepository") productRepository = undefined;

    /** @type {SettingsRepository}*/
    @inject("SettingsRepository") settingsRepository = undefined;

    /** @type {InvoiceRepository}*/
    @inject("InvoiceRepository") invoiceRepository = undefined;

    /** @type {InventoryRepository}*/
    @inject("InventoryRepository") inventoryRepository = undefined;

    create(cmd) {
        const settings = this.settingsRepository.get();

        if (settings.productOutputCreationMethod === 'defaultStock')
            cmd.invoiceLines.forEach(item => item.stockId = settings.stockId);
        else {

            let errors = cmd.invoiceLines.asEnumerable()
                .where(item => this.productRepository.isGood(item.productId))
                .where(item => Utility.String.isNullOrEmpty(item.stockId))
                .select(item => 'برای کالای {0} انبار انتخاب نشده'.format(this.productRepository.findById(item.productId).title))
                .toArray();

            if (errors.length > 0)
                throw new ValidationException(errors);
        }

        return cmd.invoiceLines.asEnumerable()
            .where(item => this.productRepository.isGood(item.productId))
            .groupBy(
                item => item.stockId,
                item => item,
                (key, items) => ({
                    stockId: key,
                    ioType: 'inputPurchase',
                    lines: items.toArray()
                }))
            .select(item => this.inventoryInputDomainService.create(item))
            .toArray();
    }

    setPrice(ids, invoiceId) {

        let invoice = this.invoiceRepository.findById(invoiceId),
            inputs = ids.asEnumerable().select(id => this.inventoryRepository.findById(id)).toArray(),

            totalPrice = invoice.invoiceLines.asEnumerable().sum(line => line.unitPrice * line.quantity),
            totalCharges = invoice.charges.asEnumerable().sum(e => e.value);

        inputs.forEach(input => {
            let list = input.inventoryLines.asEnumerable()
                .select(line => {

                    let invoiceLine = invoice.invoiceLines.asEnumerable()
                            .single(invoiceLine => invoiceLine.productId === line.productId),

                        rate = 100 * ((invoiceLine.quantity * invoiceLine.unitPrice) - invoiceLine.discount) / totalPrice,
                        chargeShare = totalCharges * rate / 100,
                        unitPrice = ((invoiceLine.quantity * invoiceLine.unitPrice) - invoiceLine.discount + chargeShare) / invoiceLine.quantity;

                    return {
                        id: line.id,
                        unitPrice
                    };
                })
                .toArray();

            this.inventoryInputDomainService.setPrice(input.id, list);
        });

    }
}
