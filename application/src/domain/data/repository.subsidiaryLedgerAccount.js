import aw from "asyncawait/await";
import {BaseRepository} from "./repository.base";
import {injectable} from "inversify";

@injectable()
export class SubsidiaryLedgerAccountRepository extends BaseRepository {

    findById(id) {
        return aw(this.knex.table('subsidiaryLedgerAccounts')
            .modify(this.modify, this.branchId)
            .where('id', id)
            .first());
    }

    findByCode(code, generalLedgerAccountId, notEqualId) {
        let query = this.knex.table('subsidiaryLedgerAccounts')
            .where('branchId', this.branchId)
            .andWhere('code', code);

        if(generalLedgerAccountId)
            query.andWhere('generalLedgerAccountId', generalLedgerAccountId);

        if (notEqualId)
            query.andWhere('id', '!=', notEqualId);

        return aw(query.first());
    }

    create(entity) {

        if (Array.isArray(entity))
            entity.forEach(e => super.create(e));
        else
            super.create(entity);

        aw(this.knex('subsidiaryLedgerAccounts').insert(entity));
    }

    update(id,entity) {
        return aw(this.knex('subsidiaryLedgerAccounts')
            .modify(this.modify, this.branchId)
            .where('id', id)
            .update(entity));
    }

    remove(id) {
        return aw(this.knex('subsidiaryLedgerAccounts')
            .modify(this.modify, this.branchId)
            .where('id', id)
            .del());
    }

    isUsedOnJournalLines(id){
        return aw(this.knex.from('journalLines')
            .modify(this.modify, this.branchId)
            .where('subsidiaryLedgerAccountId', id)
            .first());
    }
}


