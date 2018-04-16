import {inject, injectable} from "inversify";
import {eventHandler} from "../../core/@decorators";

@injectable()
export class ReturnPurchaseEventListener {

    /**@type {SettingsRepository}*/
    @inject("SettingsRepository") settingsRepository = undefined;

    /**@type {InvoiceRepository}*/
    @inject("InvoiceRepository") invoiceRepository = undefined;

    /**@type {CommandBus}*/
    @inject("CommandBus") commandBus = undefined;

    @eventHandler("onReturnPurchaseCreated")
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

    @eventHandler("onReturnPurchaseChanged")
    onReturnPurchaseChanged(invoice) {
        this.onReturnPurchaseCreated(invoice);
    }

    @eventHandler("onReturnPurchaseConfirmed")
    onReturnPurchaseConfirmed(invoice) {
        this.onReturnPurchaseCreated(invoice);
    }

    onReturnPurchaseRemoved(invoice) {

    }
}
