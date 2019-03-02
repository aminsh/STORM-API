import { injectable, inject } from "inversify";
import { EventHandler } from "../Infrastructure/@decorators";

@injectable()
export class SaleJournalEventListener {

    @inject("InvoiceRepository")
    /**@type{InvoiceRepository}*/ invoiceRepository = undefined;

    @EventHandler("JournalRemoved")
    onJournalRemoved(journal) {
        if (journal.issuer !== 'Sale')
            return;

        let invoices = this.invoiceRepository.findByJournal(journal.id, [ 'sale', 'returnSale' ]);

        invoices.forEach(item => this.invoiceRepository.update(item.id, { journalId: null }));

    }
}