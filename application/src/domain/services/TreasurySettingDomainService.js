import {injectable, inject} from "inversify";


@injectable()
export class TreasurySettingDomainService{

    /** @type {TreasurySettingRepository}*/
    @inject("TreasurySettingRepository") treasurySettingRepository = undefined;

    update(cmd){
        let entity = {
            subsidiaryLedgerAccounts: JSON.stringify(cmd.subsidiaryLedgerAccounts),
            journalGenerateAutomatic: cmd.journalGenerateAutomatic
        };

        return this.treasurySettingRepository.update(entity);
    }

}