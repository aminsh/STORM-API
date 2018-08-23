import {inject, injectable} from "inversify";
import {eventHandler} from "../../Infrastructure/@decorators";

@injectable()
export class SaleEventListener {

    /**@type {SettingsRepository}*/
    @inject("SettingsRepository") settingsRepository = undefined;

    /**@type {InvoiceRepository}*/
    @inject("InvoiceRepository") invoiceRepository = undefined;

    /**@type {JournalInvoiceGenerationService}*/
    @inject("JournalInvoiceGenerationService") journalInvoiceGenerationService = undefined;

    @eventHandler("onInvoiceCreated")
    onInvoiceCreated(invoiceId) {

        let invoice = this.invoiceRepository.findById(invoiceId),
            settings = this.settingsRepository.get();

        if (invoice.invoiceStatus === 'draft')
            return;

        if (!settings.canSaleGenerateAutomaticJournal)
            return;

        this.journalInvoiceGenerationService.generate(invoiceId);
    }

    @eventHandler("onInvoiceChanged")
    onInvoiceChanged(invoice) {

        this.onInvoiceCreated(invoice);
    }

    @eventHandler("onInvoiceConfirmed")
    onInvoiceConfirmed(invoice) {
        this.onInvoiceCreated(invoice);
    }

    @eventHandler("onInvoiceRemoved")
    onInvoiceRemoved(invoice) {
    }

}
