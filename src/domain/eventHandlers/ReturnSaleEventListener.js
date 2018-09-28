import {inject, injectable} from "inversify";
import {EventHandler} from "../../Infrastructure/@decorators";

@injectable()
export class ReturnSaleEventListener {

    /**@type {SettingsRepository}*/
    @inject("SettingsRepository") settingsRepository = undefined;

    /**@type {InvoiceRepository}*/
    @inject("InvoiceRepository") invoiceRepository = undefined;

    /**@type {CommandBus}*/
    @inject("CommandBus") commandBus = undefined;

    @EventHandler("onReturnSaleCreated")
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

    @EventHandler("onReturnSaleChanged")
    changed(invoiceId){
        this.onReturnSaleCreated(invoiceId);
    }

    @EventHandler("onReturnSaleConfirmed")
    confirmed(invoiceId){
        this.onReturnSaleCreated(invoiceId);
    }
}
