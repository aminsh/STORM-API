import toResult from "asyncawait/await";
import {BaseRepository} from "./repository.base";
import {injectable} from "inversify";

@injectable()
export class SubsidiaryLedgerAccountRepository extends BaseRepository {

    findById(id) {
        return toResult(this.knex.table('subsidiaryLedgerAccounts')
            .modify(this.modify, this.branchId)
            .where('id', id)
            .first());
    }

    findByCode(code, generalLedgerAccountId, notEqualId) {
        let query = this.knex.table('subsidiaryLedgerAccounts')
            .modify(this.modify, this.branchId)
            .andWhere('code', code);

        if(generalLedgerAccountId)
            query.andWhere('generalLedgerAccountId', generalLedgerAccountId);

        if (notEqualId)
            query.andWhere('id', '!=', notEqualId);

        return toResult(query.first());
    }

    create(entity) {

        if (Array.isArray(entity))
            entity.forEach(e => super.create(e));
        else
            super.create(entity);

        toResult(this.knex('subsidiaryLedgerAccounts')
            .transacting(this.transaction)
            .insert(entity));
    }

    update(id,entity) {
        return toResult(this.knex('subsidiaryLedgerAccounts')
            .modify(this.modify, this.branchId)
            .where('id', id)
            .update(entity));
    }

    remove(id) {
        return toResult(this.knex('subsidiaryLedgerAccounts')
            .modify(this.modify, this.branchId)
            .where('id', id)
            .del());
    }

    isUsedOnJournalLines(id){
        return toResult(this.knex.from('journalLines')
            .modify(this.modify, this.branchId)
            .where('subsidiaryLedgerAccountId', id)
            .first());
    }
}


