import {inject, injectable} from "inversify";
import {eventHandler} from "../../Infrastructure/@decorators";

@injectable()
export class PurchaseEventListener {

    /**@type {SettingsRepository}*/
    @inject("SettingsRepository") settingsRepository = undefined;

    /**@type {InvoiceRepository}*/
    @inject("InvoiceRepository") invoiceRepository = undefined;

    /**@type {JournalService}*/
    @inject("JournalService") journalService = undefined;

    @eventHandler("onPurchaseCreated")
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

    @eventHandler("onPurchaseChanged")
    onPurchaseChanged(invoice) {
        this.onPurchaseCreated(invoice);
    }

    @eventHandler("onPurchaseConfirmed")
    onPurchaseConfirmed(invoice) {
        this.onPurchaseCreated(invoice);
    }

    @eventHandler("PurchaseRemoved")
    onPurchaseRemoved(invoice) {
        let settings = this.settingsRepository.get();

        if (!settings.canSaleGenerateAutomaticJournal)
            return;

        if (invoice.journalId)
            this.journalService.remove(invoice.journalId);
    }

}
