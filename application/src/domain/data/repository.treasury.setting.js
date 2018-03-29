import toResult from "asyncawait/await";
import {BaseRepository} from "./repository.base";
import {injectable, postConstruct} from "inversify";

@injectable()
export class TreasurySettingRepository extends BaseRepository {

    defaultAccounts = undefined;

    @postConstruct()
    init() {
        const settings = this.settings = this.treasurySettingRepository.get();

        this.defaultAccounts = (settings.subsidiaryLedgerAccounts || [])
            .asEnumerable()
            .toObject(item => item.key, item => item.id);
    }

    get debtors() {
        return this.subsidiaryLedgerAccountRepository.findById(this.defaultAccounts['debtors']);
    }

    get creditors() {
        return this.subsidiaryLedgerAccountRepository.findById(this.defaultAccounts['creditors']);
    }

    get receiveBusinessNotesInFund() {
        return this.subsidiaryLedgerAccountRepository.findById(this.defaultAccounts['receiveBusinessNotesInFund']);
    }

    get receiveBusinessNotesInProcess() {
        return this.subsidiaryLedgerAccountRepository.findById(this.defaultAccounts['receiveBusinessNotesInProcess']);
    }

    get receiveBusinessNotesRevocation() {
        return this.subsidiaryLedgerAccountRepository.findById(this.defaultAccounts['receiveBusinessNotesRevocation']);
    }

    get receiveBusinessNotesMissing() {
        return this.subsidiaryLedgerAccountRepository.findById(this.defaultAccounts['receiveBusinessNotesMissing']);
    }

    get receiveBusinessNotesSpend() {
        return this.subsidiaryLedgerAccountRepository.findById(this.defaultAccounts['receiveBusinessNotesSpend']);
    }

    get receiveBusinessNotesReturned() {
        return this.subsidiaryLedgerAccountRepository.findById(this.defaultAccounts['receiveBusinessNotesReturned']);
    }

    get fundAccount() {
        return this.subsidiaryLedgerAccountRepository.findById(this.defaultAccounts['fund']);
    }

    get bankAccount() {
        return this.subsidiaryLedgerAccountRepository.findById(this.defaultAccounts['bank']);
    }

    get paymentNotes() {
        return this.subsidiaryLedgerAccountRepository.findById(this.defaultAccounts['paymentNotes']);
    }


    create(entity) {
        super.create(entity);

        return this.knex('treasurySettings').insert(entity);
    }

    update(entity) {
        return toResult(this.knex('treasurySettings')
            .modify(this.modify, this.branchId)
            .update(entity));
    }

    get() {
        return toResult(this.knex.table('treasurySettings')
            .modify(this.modify, this.branchId)
            .first());
    }

}
