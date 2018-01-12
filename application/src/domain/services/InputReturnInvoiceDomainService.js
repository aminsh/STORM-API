import {inject, injectable} from "inversify";

@injectable()
export class InputReturnInvoiceDomainService {

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
                    ioType: 'inputBackFromSaleOrConsuming',
                    lines: items.toArray()
                }))
            .select(item => this.inventoryInputDomainService.create(item))
            .toArray();
    }

    calculatePrice(id) {

        let input = this.inventoryRepository.findById(id),
            invoiceReturn = this.invoiceRepository.findById(input.invoiceId),
            productAndLastPriceCreatedForThisInvoice = this._getProductAndLastPriceCreatedForThisInvoice(invoiceReturn);

        if (productAndLastPriceCreatedForThisInvoice.asEnumerable().any(item => item.price === 0))
            throw new ValidationException(['قیمت گذاری حواله انجام نشده ، امکان محاسبه قیمت وجود ندارد']);

        let totalPrice = productAndLastPriceCreatedForThisInvoice.asEnumerable().sum(item => item.price),
            totalCharge = invoiceReturn.charges.asEnumerable().sum(e => e.value),

            lines = input.inventoryLines
                .asEnumerable()
                .join(productAndLastPriceCreatedForThisInvoice,
                    inputLine => inputLine.productId,
                    outputLine => outputLine.productId,
                    (inputLine, outputLine) => ({
                        id: inputLine.id,
                        productId: inputLine.productId,
                        unitPrice: (totalCharge * ((100 * outputLine.price) / totalPrice) / 100) + outputLine.price
                    }))
                .where(item => item.productId)
                .toArray();

        this.inventoryInputDomainService.setPrice(input.id, lines);
    }

    _getProductAndLastPriceCreatedForThisInvoice(invoice) {

        if (Utility.String.isNullOrEmpty(invoice.ofInvoiceId))
            throw new ValidationException(['ofInvoiceId is empty']);

        const outputsByInvoice = this.inventoryRepository
            .findByInvoiceId(invoice.ofInvoiceId, 'output');

        if (!(outputsByInvoice && outputsByInvoice.length > 0))
            throw new ValidationException(['حواله ای برای این فاکتور وجود ندارد']);

        return outputsByInvoice.asEnumerable()

        /*
            if we have more than one price recent price should be write
        */
            .orderByDescending(item => item.createdAt)

            .selectMany(item => item.inventoryLines)
            .groupBy(
                item => item.productId,
                item => item.unitPrice || 0,
                (key, items) => ({productId: key, price: items.first()}))
            .toArray();
    }
}
