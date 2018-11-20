import {inject, injectable} from "inversify";

@injectable()
export class PurchaseMapper {

    /**@type {SettingsRepository}*/
    @inject("SettingsRepository") settingsRepository = undefined;

    /**@type {ProductRepository}*/
    @inject("ProductRepository") productRepository = undefined;

    /**@type {StockRepository}*/
    @inject("StockRepository") stockRepository = undefined;

    map(invoice) {

        const settings = this.settingsRepository.get();

        const charge = (settings.saleCharges || []).asEnumerable()
            .select(e => ({
                key: e.key,
                value: (invoice.charges.asEnumerable().firstOrDefault(p => p.key === e.key) || {value: 0}).value
            }))
            .toObject(item => `charge_${item.key}`, item => item.value);

        const model = Object.assign({
                number: invoice.number,
                date: invoice.date,
                title: invoice.title,
                amount: invoice.invoiceLines.asEnumerable().sum(line => line.unitPrice * line.quantity),
                discount: invoice.invoiceLines.asEnumerable().sum(line => line.discount) + invoice.discount,
                vat: invoice.invoiceLines.asEnumerable().sum(line => line.vat),
                tax: invoice.invoiceLines.asEnumerable().sum(line => line.tax),
                vendor: invoice.detailAccountId,
                vendorCode: invoice.detailAccount.code,
                vendorTitle: invoice.detailAccount.title,
                products: invoice.invoiceLines.map(line => ({
                    id: (this.productRepository.findById(line.productId) || {}).accountId,
                    amount: line.unitPrice * line.quantity
                })),
                productGroupByStock: invoice.invoiceLines.asEnumerable()
                    .groupBy(
                        line => line.stockId,
                        line => line,
                        (stockId, lines) => ({
                            id: stockId ? (this.stockRepository.findById(stockId) || {}).accountId : null,
                            amount: lines.sum(item => item.quantity * item.unitPrice)
                        })
                    )
                    .toArray()
            }, charge);

        return model;
    }
}
