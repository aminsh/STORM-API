import toResult from "asyncawait/await";
import {BaseRepository} from "../../Infrastructure/BaseRepository";
import {injectable} from "inversify";

@injectable()
export class DetailAccountRepository extends BaseRepository {

    findById(id) {
        return toResult(this.knex.table('detailAccounts')
            .modify(this.modify, this.branchId)
            .where('id', id)
            .first());
    }

    findByReferenceId(referenceId) {
        return toResult(this.knex.table('detailAccounts')
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

        return toResult(query.first());
    }

    findMaxCode(){
        let result = toResult(this.knex.table('detailAccounts')
            .modify(this.modify, this.branchId)
            .where(this.knex.raw(`code ~ '^[0-9\\.]+$'`))
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

        return toResult(query.first());
    }

    findFund(fundCode) {
        let query = this.knex.table('detailAccounts')
            .modify(this.modify, this.branchId)
            .where('detailAccountType', 'bank');

        if (fundCode)
            query.andWhere('code', fundCode);
        else query.andWhere('thisIsDefaultFund', true);

        return toResult(query.first());
    }

    create(entity) {
        super.create(entity);

        toResult(this.knex('detailAccounts').insert(entity));
    }

    update(entity) {
        return toResult(this.knex('detailAccounts')
            .modify(this.modify, this.branchId)
            .where('id', entity.id)
            .update(entity));
    }

    remove(id) {
        return toResult(this.knex('detailAccounts')
            .modify(this.modify, this.branchId)
            .where('id', id)
            .del());
    }
}

