import {inject, injectable} from "inversify";

@injectable()
export class OutputReturnPurchaseDomainService {

    /**@type {InventoryOutputDomainService}*/
    @inject("InventoryOutputDomainService") inventoryOutputDomainService = undefined;

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
                    ioType: 'outputBackFromPurchase',
                    lines: items.toArray()
                }))
            .select(item => this.inventoryOutputDomainService.create(item))
            .toArray();
    }
}
