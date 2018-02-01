import {inject, injectable} from "inversify";

@injectable()
export class InvoiceEventListener {

    /**@type {SettingsRepository}*/
    @inject("SettingsRepository") settingsRepository = undefined;

    /**@type {InvoiceRepository}*/
    @inject("InvoiceRepository") invoiceRepository = undefined;

    /**@type {CommandBus}*/
    @inject("CommandBus") commandBus = undefined;

    onInvoiceCreated(invoiceId) {
        let invoice = this.invoiceRepository.findById(invoiceId),
            settings = this.settingsRepository.get();

        if (invoice.invoiceStatus === 'draft')
            return;

        if (!settings.canSaleGenerateAutomaticJournal)
            return;

        this.commandBus.send("journalGenerateForInvoice", [invoice.id]);
    }

    onInvoiceChanged(invoice) {
        this.onInvoiceCreated(invoice);
    }

    onInvoiceConfirmed(invoice) {
        this.onInvoiceCreated(invoice);
    }

    onInvoiceRemoved(invoice) {

    }
}
