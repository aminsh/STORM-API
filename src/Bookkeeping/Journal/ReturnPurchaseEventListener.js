import {inject, injectable} from "inversify";
import {EventHandler} from "../../Infrastructure/@decorators";

@injectable()
export class ReturnPurchaseEventListener {

    /**@type {SettingsRepository}*/
    @inject("SettingsRepository") settingsRepository = undefined;

    /**@type {InvoiceRepository}*/
    @inject("InvoiceRepository") invoiceRepository = undefined;

    /**@type {JournalService}*/
    @inject("JournalService") journalService = undefined;

    @EventHandler("ReturnPurchaseCreated")
    onReturnPurchaseCreated(invoiceId) {
        let invoice = this.invoiceRepository.findById(invoiceId),
            settings = this.settingsRepository.get();

        if (invoice.invoiceStatus === 'draft')
            return;

        if (!settings.canInventoryGenerateAutomaticJournal)
            return;

        const journalId = this.journalService.generateForReturnPurchase(invoiceId);
        this.invoiceRepository.update(invoiceId, {journalId});
    }

    @EventHandler("onReturnPurchaseChanged")
    onReturnPurchaseChanged(invoice) {
        this.onReturnPurchaseCreated(invoice);
    }
}
