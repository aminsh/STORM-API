import {injectable, inject} from "inversify";


@injectable()
export class TreasurySettingsService{

    /** @type {TreasurySettingRepository}*/
    @inject("TreasurySettingRepository") treasurySettingRepository = undefined;

    create(cmd){

        let entity = {
            subsidiaryLedgerAccounts: JSON.stringify(cmd.subsidiaryLedgerAccounts || []),
            journalGenerateAutomatic: cmd.journalGenerateAutomatic
        };

        this.treasurySettingRepository.create(entity);

        return entity.id;
    }

    update(cmd){
        let entity = {
            subsidiaryLedgerAccounts: JSON.stringify(cmd.subsidiaryLedgerAccounts || []),
            journalGenerateAutomatic: cmd.journalGenerateAutomatic
        };

        return this.treasurySettingRepository.update(entity);
    }

}