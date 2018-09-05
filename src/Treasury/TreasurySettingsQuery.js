import {BaseQuery} from "../Infrastructure/BaseQuery";
import toResult from "asyncawait/await";
import {injectable} from "inversify";
import defaultTreasurySubsidiaryLedgerAccounts from "./json/treasurySubsidiaryLedgerAccounts.json";

@injectable()
export class TreasurySettingsQuery extends BaseQuery {

    get() {

        let result = toResult(this.knex.select(
            'subsidiaryLedgerAccounts',
            'journalGenerateAutomatic')
            .from('treasurySettings')
            .where('branchId', this.branchId)
            .first()
        );

        if(!result)
            return null;

        if (!result.subsidiaryLedgerAccounts)
            result.subsidiaryLedgerAccounts = defaultTreasurySubsidiaryLedgerAccounts;
        else {
            const accountNotExits = defaultTreasurySubsidiaryLedgerAccounts.asEnumerable()
                .where(item => !result.subsidiaryLedgerAccounts
                    .asEnumerable()
                    .any(p => p.key === item.key))
                .toArray();

            result.subsidiaryLedgerAccounts = result.subsidiaryLedgerAccounts.concat(accountNotExits);
        }

        return result;
    }
}
