import { injectable, inject } from "inversify";
import { EventHandler } from "../Infrastructure/@decorators";

@injectable()
export class InventoryPurchaseEventListener {


    @inject("InventoryRepository")
    /**@type {InventoryRepository}*/ inventoryRepository = undefined;

    @inject('InventoryGeneratorService')
    /**@type {InventoryGeneratorService}*/ inventoryGeneratorService = undefined;

    @inject("SettingsRepository")
    /**@type {SettingsRepository}*/ settingsRepository = undefined;

    @inject("InvoiceRepository")
    /**@type{InvoiceRepository}*/ invoiceRepository = undefined;

    @EventHandler("PurchaseCreated")
    onPurchaseCreated(purchaseId) {
        const settings = this.settingsRepository.get();

        if (!settings.canPurchaseGenerateAutomaticInput)
            return;

        this.inventoryGeneratorService.createInputFromPurchase(purchaseId);
    }

    @EventHandler("PurchaseChanged")
    onPurchaseChanged(purchaseId) {
        this.onPurchaseCreated(purchaseId)
    }

    @EventHandler("PurchaseRemoved")
    onPurchaseRemoved(purchaseId) {
        const inventories = this.inventoryRepository.findByInvoiceId(purchaseId);
        inventories.forEach(item => this.inventoryRepository.update(item.id, { invoiceId: null }));
    }

    @EventHandler("PurchaseJournalCreated")
    onJournalCreated(purchaseId) {
        const purchase = this.invoiceRepository.findById(purchaseId);

        if (!purchase)
            return;

        const inputs = this.inventoryRepository.findByInvoiceId(purchaseId);

        inputs.forEach(input => this.inventoryRepository.update(input.id, { journalId: purchase.journalId }))
    }

    @EventHandler("PurchaseJournalRemoved")
    onJournalRemoved(purchaseId) {
        const purchase = this.invoiceRepository.findById(purchaseId);

        if (!purchase)
            return;

        const inputs = this.inventoryRepository.findByInvoiceId(purchaseId);

        inputs.forEach(input => this.inventoryRepository.update(input.id, { journalId: null }))
    }
}