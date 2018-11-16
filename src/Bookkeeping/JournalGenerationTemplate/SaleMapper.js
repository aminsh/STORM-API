import {inject, injectable} from "inversify";

@injectable()
export class SaleMapper {

    /**@type {SettingsRepository}*/
    @inject("SettingsRepository") settingsRepository = undefined;

    /**@type {ProductRepository}*/
    @inject("ProductRepository") productRepository = undefined;

    map(invoice) {

        const settings = this.settingsRepository.get();

        const cost = (settings.saleCosts || []).asEnumerable()
                .select(e => ({
                    key: e.key,
                    value: (invoice.costs.asEnumerable().firstOrDefault(p => p.key === e.key) || {value: 0}).value
                }))
                .toObject(item => `cost_${item.key}`, item => item.value),

            charge = (settings.saleCharges || []).asEnumerable()
                .select(e => ({
                    key: e.key,
                    value: (invoice.charges.asEnumerable().firstOrDefault(p => p.key === e.key) || {value: 0}).value
                }))
                .toObject(item => `charge_${item.key}`, item => item.value);

        let lineHaveVat = invoice.invoiceLines.asEnumerable().firstOrDefault(e => e.vat !== 0 && e.tax !== 0),
            persistedTax = lineHaveVat
                ? (100 * lineHaveVat.tax) / ((lineHaveVat.quantity * lineHaveVat.unitPrice) - lineHaveVat.discount)
                : 0,
            persistedVat = lineHaveVat
                ? (100 * lineHaveVat.vat) / ((lineHaveVat.quantity * lineHaveVat.unitPrice) - lineHaveVat.discount)
                : 0;

        const invoiceLines = invoice.invoiceLines.map(item => ({
            productId: (this.productRepository.findById(item.productId) || {accountId: null}).accountId,
            amount: item.quantity * item.unitPrice,
            discount: item.discount
        }));

        return {
            number: invoice.number,
            date: invoice.date,
            title: invoice.title,
            amount: invoice.invoiceLines.asEnumerable().sum(line => line.unitPrice * line.quantity),
            discount: invoice.invoiceLines.asEnumerable().sum(line => line.discount) + invoice.discount,

            tax: invoice.invoiceLines.asEnumerable().sum(function (line) {
                return line.tax;
            }) + invoice.charges.asEnumerable().sum(function (e) {
                if (e.vatIncluded)
                    return e.value;
                else
                    return 0;
            }) * persistedTax / 100,

            vat: invoice.invoiceLines.asEnumerable().sum(function (line) {
                return line.vat;
            }) + invoice.charges.asEnumerable().sum(function (e) {
                if (e.vatIncluded)
                    return e.value;
                else
                    return 0;
            }) * persistedVat / 100,
            customer: invoice.detailAccountId,
            customerCode: invoice.detailAccount.code,
            customerTitle: invoice.detailAccount.title,
            marketer: invoice.marketerId,
            bankReceiptNumber: invoice.bankReceiptNumber || '',
            products: invoiceLines,
            ...cost, ...charge
        };
    }
}