import {inject, injectable} from "inversify";
import {EventHandler} from "../../Infrastructure/@decorators";

@injectable()
export class ReturnPurchaseEventListener {

    /**@type {SettingsRepository}*/
    @inject("SettingsRepository") settingsRepository = undefined;

    /**@type {InvoiceRepository}*/
    @inject("InvoiceRepository") invoiceRepository = undefined;

    /**@type {CommandBus}*/
    @inject("CommandBus") commandBus = undefined;

    @EventHandler("onReturnPurchaseCreated")
    onReturnPurchaseCreated(invoiceId) {
        let invoice = this.invoiceRepository.findById(invoiceId),
            settings = this.settingsRepository.get();

        if (invoice.invoiceStatus === 'draft')
            return;

        if (!settings.canSaleGenerateAutomaticJournal)
            return;

        let journalId = this.commandBus.send("journalGenerateForReturnPurchase", [invoice.id]);
        this.commandBus.send("returnPurchaseSetJournal", [invoice.id, journalId]);
    }

    @EventHandler("onReturnPurchaseChanged")
    onReturnPurchaseChanged(invoice) {
        this.onReturnPurchaseCreated(invoice);
    }

    @EventHandler("onReturnPurchaseConfirmed")
    onReturnPurchaseConfirmed(invoice) {
        this.onReturnPurchaseCreated(invoice);
    }

    onReturnPurchaseRemoved(invoice) {

    }
}
