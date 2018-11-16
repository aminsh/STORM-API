import {inject, injectable} from "inversify";

@injectable()
export class JournalInvoiceGenerationService {

    /**@type {JournalService}*/
    @inject("JournalService") journalService = undefined;

    /**@type {SettingsRepository}*/
    @inject("SettingsRepository") settingsRepository = undefined;

    /** @type {InvoiceRepository}*/
    @inject("InvoiceRepository") invoiceRepository = undefined;

    /**@type {JournalGenerationTemplateService}*/
    @inject("JournalGenerationTemplateService") journalGenerationTemplateService = undefined;

    generate(invoiceId) {

        const invoice = this.invoiceRepository.findById(invoiceId);

        if (!invoice)
            throw new ValidationException(['فاکتور وجود ندارد']);

        const journal = this.journalGenerationTemplateService.generate(invoice, 'sale');

        journal.journalLines = journal.journalLines.asEnumerable()
            .orderByDescending(line => line.debtor)
            .toArray();

        if (invoice.journalId)
            this.journalService.update(invoice.journalId, journal);
        else {
            let journalId = this.journalService.create(journal);

            Utility.delay(1000);

            this.invoiceRepository.update(invoiceId, {journalId});
        }
    }
}