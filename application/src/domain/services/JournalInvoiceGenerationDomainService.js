import {inject, injectable} from "inversify";

@injectable()
export class JournalInvoiceGenerationDomainService {

    /**@type {JournalDomainService}*/
    @inject("JournalDomainService") journalDomainService = undefined;

    /**@type {SettingsRepository}*/
    @inject("SettingsRepository") settingsRepository = undefined;

    /** @type {InvoiceRepository}*/
    @inject("InvoiceRepository") invoiceRepository = undefined;

    /**@type {JournalGenerationTemplateDomainService}*/
    @inject("JournalGenerationTemplateDomainService") journalGenerationTemplateDomainService = undefined;


    generate(invoiceId) {
        const settings = this.settingsRepository.get(),
            invoice = this.invoiceRepository.findById(invoiceId);

        if (!invoice)
            throw new ValidationException(['فاکتور وجود ندارد']);

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

        let lineHaveVat = invoice.invoiceLines.asEnumerable().firstOrDefault(e => e.vat !== 0),
            persistedVat = lineHaveVat
                ? (100 * lineHaveVat.vat) / ((lineHaveVat.quantity * lineHaveVat.unitPrice) - lineHaveVat.discount)
                : 0,

            model = Object.assign({
                number: invoice.number,
                date: invoice.date,
                title: invoice.title,
                amount: invoice.invoiceLines.asEnumerable().sum(line => line.unitPrice * line.quantity),
                discount: invoice.invoiceLines.asEnumerable().sum(line => line.discount) + invoice.discount,
                vat: invoice.invoiceLines.asEnumerable().sum(line => line.vat) + (invoice.charges.asEnumerable().sum(e => e.value) * persistedVat / 100),
                customer: invoice.detailAccountId,
                customerCode: invoice.detailAccount.code,
                customerTitle: invoice.detailAccount.title,
                bankReceiptNumber: invoice.bankReceiptNumber || ''
            }, cost, charge),

            journal = this.journalGenerationTemplateDomainService.generate(model, 'sale');

        journal.journalLines = journal.journalLines.asEnumerable()
            .orderByDescending(line => line.debtor)
            .toArray();

        if (invoice.journalId)
            this.journalDomainService.update(invoice.journalId, journal);
        else {
            let journalId = this.journalDomainService.create(journal);
            this.invoiceRepository.update(invoiceId, {journalId});
        }
    }
}