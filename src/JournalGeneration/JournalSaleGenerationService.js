import { inject, injectable } from "inversify";

@injectable()
export class JournalSaleGenerationService {

    /**@type {JournalService}*/
    @inject("JournalService") journalService = undefined;

    /**@type {SettingsRepository}*/
    @inject("SettingsRepository") settingsRepository = undefined;

    /**@type {InvoiceTypeRepository}*/
    @inject("InvoiceTypeRepository") invoiceTypeRepository = undefined;

    /** @type {InvoiceRepository}*/
    @inject("InvoiceRepository") invoiceRepository = undefined;

    /**@type {JournalGenerationTemplateService}*/
    @inject("JournalGenerationTemplateService") journalGenerationTemplateService = undefined;

    @inject("SaleMapper")
    /**@type{SaleMapper}*/ saleMapper = undefined;

    generate( invoiceId ) {

        const invoice = this.invoiceRepository.findById(invoiceId);

        if (!invoice)
            throw new ValidationException([ 'فاکتور وجود ندارد' ]);

        if (invoice.journalId)
            throw new ValidationException([ 'برای فاکتور جاری قبلا سند صادر شده ، ابتدا سند را حذف کنید' ]);

        const type = invoice.typeId
            ? this.invoiceTypeRepository.findById(invoice.typeId)
            : null;

        if (!type)
            throw new ValidationException([ 'نوع فروش وجود ندارد' ]);

        if (!type.journalGenerationTemplateId)
            throw new ValidationException([ 'نوع فروش الگوی ساخت سند ندارد' ]);

        const data = this.saleMapper.map(invoice);

        const journal = this.journalGenerationTemplateService.generate(type.journalGenerationTemplateId, data);

        let journalId = this.journalService.create(journal);

        Utility.delay(1000);

        this.invoiceRepository.update(invoiceId, { journalId });
    }
}