import {inject, injectable} from "inversify";
import {eventHandler} from "../../core/@decorators";

@injectable()
export class InvoiceEventListener {

    /**@type {SettingsRepository}*/
    @inject("SettingsRepository") settingsRepository = undefined;

    /**@type {InvoiceRepository}*/
    @inject("InvoiceRepository") invoiceRepository = undefined;

    /**@type {CommandBus}*/
    @inject("CommandBus") commandBus = undefined;

    @inject("UserEventHandler")
    /** @type{UserEventHandler}*/userEventHandler = undefined;

    @eventHandler("onInvoiceCreated")
    onInvoiceCreated(invoiceId) {

        if(this.userEventHandler.getHandler("onInvoiceCreated"))
            return this.userEventHandler.run("onInvoiceCreated", invoiceId);

        let invoice = this.invoiceRepository.findById(invoiceId),
            settings = this.settingsRepository.get();

        if (invoice.invoiceStatus === 'draft')
            return;

        if (!settings.canSaleGenerateAutomaticJournal)
            return;

        this.commandBus.send("journalGenerateForInvoice", [invoice.id]);
    }

    @eventHandler("onInvoiceChanged")
    onInvoiceChanged(invoice) {

        this.onInvoiceCreated(invoice);
    }

    @eventHandler("onInvoiceConfirmed")
    onInvoiceConfirmed(invoice) {
        this.onInvoiceCreated(invoice);
    }

    @eventHandler("onInvoiceRemoved")
    onInvoiceRemoved(invoice) {

    }
}
