import {inject, injectable} from "inversify";
import {eventHandler} from "../../Infrastructure/@decorators";

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

    @inject("TreasuryPurposeRepository")
    /** @type{TreasuryPurposeRepository}*/ treasuryPurposeRepository = undefined;

    @eventHandler("onInvoiceCreated")
    onInvoiceCreated(invoiceId) {

        if (this.userEventHandler.getHandler("onInvoiceCreated"))
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

    @eventHandler("invoicesPaymentChanged")
    onPaymentChanged(invoiceIds) {

        if (Array.isArray(invoiceIds)){
            invoiceIds.forEach(id => {
                this.paymentChanged(id);
            })
        }
        else this.paymentChanged(invoiceIds);

    }
    paymentChanged(invoiceId) {
        let invoice = this.invoiceRepository.findById(invoiceId);

        if (invoice.invoiceType === 'sale')
            return;

        let receives = this.treasuryPurposeRepository.findByReferenceId(invoiceId),

            sumCharges = (invoice.charges || []).asEnumerable()
                .sum(c => c.value),
            sumChargesVatIncluded = (invoice.charges || []).asEnumerable()
                .where(e => e.vatIncluded)
                .sum(e => e.value),
            invoiceDiscount = invoice.discount || 0,

            lineHaveVat = invoice.invoiceLines.asEnumerable().firstOrDefault(e => e.vat !== 0),
            persistedVat = lineHaveVat
                ? (100 * lineHaveVat.vat / (((lineHaveVat.quantity * lineHaveVat.unitPrice) - lineHaveVat.discount)))
                : 0,

            totalPrice = invoice.invoiceLines.asEnumerable()
                    .sum(line => line.quantity * line.unitPrice - line.discount + line.vat)
                - invoiceDiscount +
                sumCharges + (sumChargesVatIncluded * persistedVat / 100),

            sumRemainder = totalPrice - receives.asEnumerable().sum(item => item.amount);

        if(sumRemainder <= 0)
            this.invoiceRepository.update(invoiceId, {invoiceStatus: 'paid'});
    }
}
