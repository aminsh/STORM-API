import aw from "asyncawait/await";
import {BaseRepository} from "./repository.base";
import {injectable} from "inversify";

@injectable()
export class DetailAccountRepository extends BaseRepository {

    findById(id) {
        return aw(this.knex.table('detailAccounts')
            .modify(this.modify, this.branchId)
            .where('id', id)
            .first());
    }

    findByReferenceId(referenceId) {
        return aw(this.knex.table('detailAccounts')
            .modify(this.modify, this.branchId)
            .where('referenceId', referenceId)
            .first());
    }

    findByCode(code, notEqualId) {
        let query = this.knex.table('detailAccounts')
            .modify(this.modify, this.branchId)
            .where('code', code);

        if (notEqualId)
            query.andWhere('id', '!=', notEqualId);

        return aw(query.first());
    }

    findMaxCode(){
        let result = aw(this.knex.table('detailAccounts')
            .modify(this.modify, this.branchId)
            .max('code')
            .first());

        return result.max;
    }

    findBankAccountNumber(bankAccountNumber) {
        let query = this.knex.table('detailAccounts')
            .modify(this.modify, this.branchId)
            .where('detailAccountType', 'bank');

        if (bankAccountNumber)
            query.andWhere('bankAccountNumber', bankAccountNumber);
        else query.andWhere('thisIsDefaultBankAccount', true);

        return query.first();
    }

    findFund(fundCode) {
        let query = this.knex.table('detailAccounts')
            .modify(this.modify, this.branchId)
            .where('detailAccountType', 'bank');

        if (fundCode)
            query.andWhere('code', fundCode);
        else query.andWhere('thisIsDefaultFund', true);

        return query.first();
    }

    create(entity) {
        super.create(entity);

        aw(this.knex('detailAccounts').insert(entity));
    }

    update(entity) {
        return aw(this.knex('detailAccounts')
            .modify(this.modify, this.branchId)
            .where('id', entity.id)
            .update(entity));
    }

    remove(id) {
        return aw(this.knex('detailAccounts')
            .modify(this.modify, this.branchId)
            .where('id', id)
            .del());
    }
}

