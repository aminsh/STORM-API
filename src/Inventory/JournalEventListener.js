import { injectable, inject } from "inversify";
import { EventHandler } from "../Infrastructure/@decorators";

@injectable()
export class JournalEventListener {

    @inject("InvoiceRepository")
    /**@type{InvoiceRepository}*/ invoiceRepository = undefined;

    @inject("InventoryRepository")
    /**@type{InventoryRepository}*/ inventoryRepository = undefined;

    @EventHandler("JournalRemoved")
    onJournalRemovedPurchase(journal) {
        if (journal.issuer !== 'Purchase')
            return;

        let invoices = this.invoiceRepository.findByJournal(journal.id, [ 'purchase', 'returnPurchase' ]);

        invoices.forEach(item => this.invoiceRepository.update(item.id, { journalId: null }));
    }

    @EventHandler("JournalRemoved")
    onJournalRemovedInventory(journal) {
        if (journal.issuer !== 'Inventory')
            return;

        let inventories = this.inventoryRepository.findByJournal(journal.id);

        inventories.forEach(item => this.inventoryRepository.update(item.id, { journalId: null }));
    }
}