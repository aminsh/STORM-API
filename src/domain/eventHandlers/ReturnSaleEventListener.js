import {inject, injectable} from "inversify";
import {eventHandler} from "../../Infrastructure/@decorators";

@injectable()
export class ReturnSaleEventListener {

    /**@type {SettingsRepository}*/
    @inject("SettingsRepository") settingsRepository = undefined;

    /**@type {InvoiceRepository}*/
    @inject("InvoiceRepository") invoiceRepository = undefined;

    /**@type {CommandBus}*/
    @inject("CommandBus") commandBus = undefined;

    @eventHandler("onReturnSaleCreated")
    onReturnSaleCreated(invoiceId) {
        let invoice = this.invoiceRepository.findById(invoiceId),
            settings = this.settingsRepository.get();

        if (invoice.invoiceStatus === 'draft')
            return;

        if (!settings.canSaleGenerateAutomaticJournal)
            return;

        let journalId = this.commandBus.send("journalGenerateForReturnInvoice", [invoice.id]);
        this.commandBus.send("invoiceReturnSetJournal", [invoice.id, journalId]);

    }

    @eventHandler("onReturnSaleChanged")
    changed(invoiceId){
        this.onReturnSaleCreated(invoiceId);
    }

    @eventHandler("onReturnSaleConfirmed")
    confirmed(invoiceId){
        this.onReturnSaleCreated(invoiceId);
    }
}
