import {injectable, inject} from "inversify";
import {SettingsRepository} from "../data/repository.setting";


@injectable()
export class SettingDomainService{

    /** @type {SettingsRepository}*/
    @inject("SettingsRepository") settingsRepository = undefined;

    create(cmd){
        let entity = {
                vat: 9,
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
            bankId: cmd.bankId,
            canControlInventory: cmd.canControlInventory,
            canCreateSaleOnNoEnoughInventory: cmd.canCreateSaleOnNoEnoughInventory,
            productOutputCreationMethod: cmd.productOutputCreationMethod,
            canSaleGenerateAutomaticJournal: cmd.canSaleGenerateAutomaticJournal,
            stakeholders: JSON.stringify(cmd.stakeholders),
            subsidiaryLedgerAccounts: JSON.stringify(cmd.subsidiaryLedgerAccounts),
            stockId: cmd.stockId,
            saleCosts: JSON.stringify(cmd.saleCosts),
            saleCharges: JSON.stringify(cmd.saleCharges),
            webhooks: JSON.stringify(cmd.webhooks),
            invoiceDescription: cmd.invoiceDescription
        };

        return this.settingsRepository.update(entity);
    }

}