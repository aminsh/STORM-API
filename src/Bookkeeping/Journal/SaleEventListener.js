import {inject, injectable} from "inversify";
import {EventHandler} from "../../Infrastructure/@decorators";

@injectable()
export class SaleEventListener {

    /**@type {SettingsRepository}*/
    @inject("SettingsRepository") settingsRepository = undefined;

    /**@type {InvoiceRepository}*/
    @inject("InvoiceRepository") invoiceRepository = undefined;

    /**@type {JournalInvoiceGenerationService}*/
    @inject("JournalInvoiceGenerationService") journalInvoiceGenerationService = undefined;

    @EventHandler("onInvoiceCreated")
    onInvoiceCreated(invoiceId) {

        let invoice = this.invoiceRepository.findById(invoiceId),
            settings = this.settingsRepository.get();

        if (invoice.invoiceStatus === 'draft')
            return;

        if (!settings.canSaleGenerateAutomaticJournal)
            return;

        this.journalInvoiceGenerationService.generate(invoiceId);
    }

    @EventHandler("onInvoiceChanged")
    onInvoiceChanged(invoice) {

        this.onInvoiceCreated(invoice);
    }

    @EventHandler("onInvoiceConfirmed")
    onInvoiceConfirmed(invoice) {
        this.onInvoiceCreated(invoice);
    }

    @EventHandler("onInvoiceRemoved")
    onInvoiceRemoved(invoice) {
    }

}
