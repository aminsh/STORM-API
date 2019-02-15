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

    @inject("JournalGenerationTemplateRepository")
    /**@type{JournalGenerationTemplateRepository}*/ journalGenerationTemplateRepository = undefined;

    @inject("PurchaseMapper")
    /**@type{PurchaseMapper}*/ purchaseMapper = undefined;

    generate(invoiceId) {

        const invoice = this.invoiceRepository.findById(invoiceId);

        if (!invoice)
            throw new ValidationException(['فاکتور وجود ندارد']);

        if (invoice.journalId)
            throw new ValidationException([ 'برای فاکتور جاری قبلا سند صادر شده ، ابتدا سند را حذف کنید' ]);

        const journalGenerationTemplate = this.journalGenerationTemplateRepository.findByModel('Purchase');

        if(!journalGenerationTemplate)
            throw new ValidationException(['الگو ساخت سند اتوماتیک برای فاکتور خرید وجود ندارد ']);

        const data = this.purchaseMapper.map(invoice);

        const journal = this.journalGenerationTemplateService.generate(journalGenerationTemplate.id, data);

        const journalId = this.journalService.create(journal);

        Utility.delay(1000);

        this.invoiceRepository.update(invoiceId, {journalId});
    }
}