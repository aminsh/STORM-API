import {inject, injectable} from "inversify";
import {EventHandler} from "../../Infrastructure/@decorators";

@injectable()
export class PurchaseEventListener {

    /**@type {SettingsRepository}*/
    @inject("SettingsRepository") settingsRepository = undefined;

    /**@type {InvoiceRepository}*/
    @inject("InvoiceRepository") invoiceRepository = undefined;

    /**@type {JournalService}*/
    @inject("JournalService") journalService = undefined;

    @EventHandler("onPurchaseCreated")
    onPurchaseCreated(invoiceId) {
        let invoice = this.invoiceRepository.findById(invoiceId),
            settings = this.settingsRepository.get();

        if (invoice.invoiceStatus === 'draft')
            return;

        if (!settings.canSaleGenerateAutomaticJournal)
            return;

        const journalId = this.journalService.generateForPurchase(invoiceId);
        this.invoiceRepository.update(invoiceId , {journalId});
    }

    @EventHandler("onPurchaseChanged")
    onPurchaseChanged(invoice) {
        this.onPurchaseCreated(invoice);
    }

    @EventHandler("onPurchaseConfirmed")
    onPurchaseConfirmed(invoice) {
        this.onPurchaseCreated(invoice);
    }

    @EventHandler("PurchaseRemoved")
    onPurchaseRemoved(invoice) {
        let settings = this.settingsRepository.get();

        if (!settings.canSaleGenerateAutomaticJournal)
            return;

        if (invoice.journalId)
            this.journalService.remove(invoice.journalId);
    }

}
