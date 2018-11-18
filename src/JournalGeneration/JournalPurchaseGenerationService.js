import {inject, injectable} from "inversify";

@injectable()
export class JournalPurchaseGenerationService {

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

        const journal = this.journalGenerationTemplateService.generate(invoice, 'purchase');

        journal.journalLines = journal.journalLines.asEnumerable()
            .orderByDescending(line => line.debtor)
            .toArray();

        if (invoice.journalId)
            this.journalService.update(invoice.journalId, journal);
        else {
            const journalId = this.journalService.create(journal);

            Utility.delay(1000);

            this.invoiceRepository.update(invoiceId, {journalId});
        }
    }
}