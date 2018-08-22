import {inject, injectable} from "inversify";
import {eventHandler} from "../../Infrastructure/@decorators";

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

    @eventHandler("PurchaseRemoved")
    onPurchaseRemoved(invoice) {
        let settings = this.settingsRepository.get();

        if (!settings.canSaleGenerateAutomaticJournal)
            return;

        invoice.inventoryIds && invoice.inventoryIds
            .forEach(id => this.commandBus.send("inventoryInputRemove", [id]));

        if (invoice.journalId)
            this.commandBus.send("journalRemove", [invoice.journalId]);
    }

}
