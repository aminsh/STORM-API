import {inject, injectable} from "inversify";

@injectable()
export class ReturnPurchaseEventListener {

    /**@type {SettingsRepository}*/
    @inject("SettingsRepository") settingsRepository = undefined;

    /**@type {InvoiceRepository}*/
    @inject("InvoiceRepository") invoiceRepository = undefined;

    /**@type {CommandBus}*/
    @inject("CommandBus") commandBus = undefined;

    onReturnPurchaseCreated(invoiceId) {
        let invoice = this.invoiceRepository.findById(invoiceId),
            settings = this.settingsRepository.get();

        if (invoice.invoiceStatus === 'draft')
            return;

        if (!settings.canSaleGenerateAutomaticJournal)
            return;

        this.commandBus.send("journalGenerateForReturnPurchase", [invoice.id]);
    }

    onReturnPurchaseChanged(invoice) {
        this.onReturnPurchaseCreated(invoice);
    }

    onReturnPurchaseConfirmed(invoice) {
        this.onReturnPurchaseCreated(invoice);
    }

    onReturnPurchaseRemoved(invoice) {

    }
}
