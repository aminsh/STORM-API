import {inject, injectable} from "inversify";
import {EventHandler} from "../../Infrastructure/@decorators";

@injectable()
export class JournalPurchaseEventListener {

    /**@type {SettingsRepository}*/
    @inject("SettingsRepository") settingsRepository = undefined;

    /**@type {InvoiceRepository}*/
    @inject("InvoiceRepository") invoiceRepository = undefined;

    /**@type {JournalService}*/
    @inject("JournalService") journalService = undefined;

    @EventHandler("PurchaseCreated")
    onPurchaseCreated(invoiceId) {
        let invoice = this.invoiceRepository.findById(invoiceId),
            settings = this.settingsRepository.get();

        if (invoice.invoiceStatus === 'draft')
            return;

        if (!settings.canInventoryGenerateAutomaticJournal)
            return;

        const journalId = this.journalService.generateForPurchase(invoiceId);
        this.invoiceRepository.update(invoiceId , {journalId});
    }

    @EventHandler("PurchaseChanged")
    onPurchaseChanged(invoice) {
        this.onPurchaseCreated(invoice);
    }

    @EventHandler("PurchaseRemoved")
    onPurchaseRemoved(invoice) {
        let settings = this.settingsRepository.get();

        if (!settings.canInventoryGenerateAutomaticJournal)
            return;

        if (invoice.journalId)
            this.journalService.remove(invoice.journalId);
    }

}
