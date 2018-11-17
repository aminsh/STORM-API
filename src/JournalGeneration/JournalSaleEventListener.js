import {inject, injectable} from "inversify";
import {EventHandler} from "../Infrastructure/@decorators";

@injectable()
export class JournalSaleEventListener {

    /**@type {SettingsRepository}*/
    @inject("SettingsRepository") settingsRepository = undefined;

    /**@type {InvoiceRepository}*/
    @inject("InvoiceRepository") invoiceRepository = undefined;

    /**@type {JournalSaleGenerationService}*/
    @inject("JournalSaleGenerationService") journalSaleGenerationService = undefined;

    @EventHandler("SaleCreated")
    onSaleCreated(invoiceId) {

        let invoice = this.invoiceRepository.findById(invoiceId),
            settings = this.settingsRepository.get();

        if (invoice.invoiceStatus === 'draft')
            return;

        if (!settings.canSaleGenerateAutomaticJournal)
            return;

        this.journalSaleGenerationService.generate(invoiceId);
    }

    @EventHandler("SaleChanged")
    onSaleChanged(invoiceId) {

        this.onSaleCreated(invoiceId);
    }

    @EventHandler("SaleRemoved")
    onInvoiceRemoved(invoice) {

    }

}
