import {inject, injectable} from "inversify";
import {eventHandler} from "../../core/@decorators";

@injectable()
export class PurchaseEventListener {

    /**@type {SettingsRepository}*/
    @inject("SettingsRepository") settingsRepository = undefined;

    /**@type {InvoiceRepository}*/
    @inject("InvoiceRepository") invoiceRepository = undefined;

    /**@type {CommandBus}*/
    @inject("CommandBus") commandBus = undefined;

    @eventHandler("onPurchaseCreated")
    onPurchaseCreated(invoiceId) {
        let invoice = this.invoiceRepository.findById(invoiceId),
            settings = this.settingsRepository.get();

        if (invoice.invoiceStatus === 'draft')
            return;

        if (!settings.canSaleGenerateAutomaticJournal)
            return;

        let journalId = this.commandBus.send("journalGenerateForInvoicePurchase", [invoice.id]);
        this.commandBus.send("invoicePurchaseSetJournal", [invoice.id, journalId]);
    }

    @eventHandler("onPurchaseChanged")
    onPurchaseChanged(invoice) {
        this.onPurchaseCreated(invoice);
    }

    @eventHandler("onPurchaseConfirmed")
    onPurchaseConfirmed(invoice) {
        this.onPurchaseCreated(invoice);
    }

    onPurchaseRemoved(invoice) {

    }
}
