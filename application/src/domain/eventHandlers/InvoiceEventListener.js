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

        let journalId = this.commandBus.send("journalGenerateForInvoice", [invoice.id]);

        this.commandBus.send("invoiceSetJournal", [invoice.id, journalId]);
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
