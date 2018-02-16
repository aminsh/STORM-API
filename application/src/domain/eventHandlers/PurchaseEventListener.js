import {inject, injectable} from "inversify";

@injectable()
export class PurchaseEventListener {

    /**@type {SettingsRepository}*/
    @inject("SettingsRepository") settingsRepository = undefined;

    /**@type {InvoiceRepository}*/
    @inject("InvoiceRepository") invoiceRepository = undefined;

    /**@type {ApplicationServiceRunner}*/
    @inject("ApplicationServiceRunner") serviceRunner;

    onPurchaseCreated(invoiceId) {
        let invoice = this.invoiceRepository.findById(invoiceId),
            settings = this.settingsRepository.get();

        if (invoice.invoiceStatus === 'draft')
            return;

        if (!settings.canSaleGenerateAutomaticJournal)
            return;

        this.serviceRunner.execute("journalGenerateForInvoicePurchase", [invoiceId]);
    }

    onPurchaseChanged(invoice) {
        this.onPurchaseChanged(invoice);
    }

    onPurchaseConfirmed(invoice) {
        this.onPurchaseChanged(invoice);
    }

    onPurchaseRemoved(invoice) {

    }
}
