import {injectable, inject} from "inversify";

@injectable()
export class SettingService{

    /** @type {SettingsRepository}*/
    @inject("SettingsRepository") settingsRepository = undefined;

    create(){
        let entity = {
            vat: 3,
            tax: 6
        };
        this.settingsRepository.create(entity);
    }
    update(cmd){
        cmd.canCreateSaleOnNoEnoughInventory = cmd.canControlInventory
            ? cmd.canCreateSaleOnNoEnoughInventory
            : false;

        cmd.stockId = cmd.productOutputCreationMethod === 'defaultStock'
            ? cmd.stockId
            : null;

        let entity = {
            vat: cmd.vat,
            tax: cmd.tax,
            bankId: cmd.bankId,
            canControlInventory: cmd.canControlInventory,
            canCreateSaleOnNoEnoughInventory: cmd.canCreateSaleOnNoEnoughInventory,
            productOutputCreationMethod: cmd.productOutputCreationMethod,
            canSaleGenerateAutomaticJournal: cmd.canSaleGenerateAutomaticJournal,
            canSaleGenerateAutomaticOutput: cmd.canSaleGenerateAutomaticOutput,
            canInventoryGenerateAutomaticJournal: cmd.canInventoryGenerateAutomaticJournal,
            canRemoveJournalWhenSourceRemoved: cmd.canRemoveJournalWhenSourceRemoved,
            stakeholders: JSON.stringify(cmd.stakeholders),
            subsidiaryLedgerAccounts: JSON.stringify(cmd.subsidiaryLedgerAccounts),
            stockId: cmd.stockId,
            saleCosts: JSON.stringify(cmd.saleCosts),
            saleCharges: JSON.stringify(cmd.saleCharges),
            webhooks: JSON.stringify(cmd.webhooks),
            invoiceDescription: cmd.invoiceDescription,
            productAccountLevel: cmd.productAccountLevel,
            stockAccountLevel: cmd.stockAccountLevel
        };

        return this.settingsRepository.update(entity);
    }

}