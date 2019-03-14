import {inject, injectable} from "inversify";
import {EventHandler} from "../Infrastructure/@decorators";

@injectable()
export class JournalPurchaseEventListener {

    /**@type {SettingsRepository}*/
    @inject("SettingsRepository") settingsRepository = undefined;

    /**@type {InvoiceRepository}*/
    @inject("InvoiceRepository") invoiceRepository = undefined;

    /**@type {PurchaseService}*/
    @inject("PurchaseService") purchaseService = undefined;

    /**@type {JournalService}*/
    @inject("JournalService") journalService = undefined;

    @EventHandler("PurchaseCreated")
    onPurchaseCreated(purchaseId) {
        let invoice = this.invoiceRepository.findById(purchaseId),
            settings = this.settingsRepository.get();

        if (invoice.invoiceStatus === 'draft')
            return;

        if (!settings.canInventoryGenerateAutomaticJournal)
            return;

        this.purchaseService.generateJournal(purchaseId)
    }

    @EventHandler("PurchaseChanged")
    onPurchaseChanged(purchaseId) {
        this.onPurchaseCreated(purchaseId);
    }
}