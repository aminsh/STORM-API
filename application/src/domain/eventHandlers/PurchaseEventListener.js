import {inject, injectable} from "inversify";

@injectable()
export class PurchaseEventListener {

    /**@type {SettingsRepository}*/
    @inject("SettingsRepository") settingsRepository = undefined;

    /**@type {InvoiceRepository}*/
    @inject("InvoiceRepository") invoiceRepository = undefined;

    /**@type {CommandBus}*/
    @inject("CommandBus") commandBus = undefined;

    onPurchaseCreated(invoiceId) {
        let invoice = this.invoiceRepository.findById(invoiceId),
            settings = this.settingsRepository.get();

        if (invoice.invoiceStatus === 'draft')
            return;

        if (!settings.canSaleGenerateAutomaticJournal)
            return;

        this.commandBus.send("journalGenerateForInvoicePurchase", [invoice.id]);
    }

    onPurchaseChanged(invoice) {
        this.onPurchaseCreated(invoice);
    }

    onPurchaseConfirmed(invoice) {
        this.onPurchaseCreated(invoice);
    }

    onPurchaseRemoved(invoice) {

    }
}
