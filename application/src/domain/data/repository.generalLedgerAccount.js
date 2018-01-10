import aw from "asyncawait/await";
import {BaseRepository} from "./repository.base";
import {injectable} from "inversify";

@injectable()
export class GeneralLedgerAccountRepository extends BaseRepository {

    findById(id) {
        let generalLedgerAccount = aw(
            this.knex.table('generalLedgerAccounts')
                .modify(this.modify, this.branchId)
                .where('id', id)
                .first()),
            subsidiaryLedgerAccounts = aw(
                this.knex.select().from('subsidiaryLedgerAccounts')
                    .modify(this.modify, this.branchId)
                    .where('generalLedgerAccountId', id));

        generalLedgerAccount.subsidiaryLedgerAccounts = subsidiaryLedgerAccounts;

        return generalLedgerAccount;
    }

    findByCode(code, notEqualId) {
        let query = this.knex.table('generalLedgerAccounts')
            .modify(this.modify, this.branchId)
            .where('code', code);

        if (notEqualId)
            query.andWhere('id', '!=', notEqualId);

        return aw(query.first());
    }

    create(entity) {
        if (Array.isArray(entity))
            entity.forEach(e => super.create(e));
        else
            super.create(entity);

        aw(this.knex('generalLedgerAccounts').insert(entity));
    }

    update(entity) {
        return aw(this.knex('generalLedgerAccounts')
            .modify(this.modify, this.branchId)
            .where('id', entity.id)
            .update(entity));
    }

    remove(id) {
        return aw(this.knex('generalLedgerAccounts')
            .modify(this.modify, this.branchId)
            .where('id', id)
            .del());
    }
}
