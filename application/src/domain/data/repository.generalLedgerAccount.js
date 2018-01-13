import toResult from "asyncawait/await";
import {BaseRepository} from "./repository.base";
import {injectable} from "inversify";

@injectable()
export class GeneralLedgerAccountRepository extends BaseRepository {

    findById(id) {
        let generalLedgerAccount = toResult(
            this.knex.table('generalLedgerAccounts')
                .modify(this.modify, this.branchId)
                .where('id', id)
                .first()),
            subsidiaryLedgerAccounts = toResult(
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

        return toResult(query.first());
    }

    create(entity) {
        if (Array.isArray(entity))
            entity.forEach(e => super.create(e));
        else
            super.create(entity);

        toResult(this.knex('generalLedgerAccounts').insert(entity));
    }

    update(entity) {
        return toResult(this.knex('generalLedgerAccounts')
            .modify(this.modify, this.branchId)
            .where('id', entity.id)
            .update(entity));
    }

    remove(id) {
        return toResult(this.knex('generalLedgerAccounts')
            .modify(this.modify, this.branchId)
            .where('id', id)
            .del());
    }
}
