import toResult from "asyncawait/await";
import {BaseRepository} from "../Infrastructure/BaseRepository";
import {injectable} from "inversify";

@injectable()
export class FiscalPeriodRepository extends BaseRepository {

    findById(id) {
        return toResult(this.knex.table('fiscalPeriods')
            .modify(this.modify, this.branchId)
            .where('id', id)
            .first());
    }

    findFirstOpen() {
        return toResult(this.knex.select('*').from('fiscalPeriods')
            .modify(this.modify, this.branchId)
            .where({isClosed: false})
            .orderBy('createdAt', 'desc')
            .first()
        );
    }

    isUsed(id) {

        const isUsedOnJournal = toResult(this.knex.select('id').from('journals').where({
                branchId: this.branchId,
                periodId: id
            }).first()),

            isUsedOnInventory = toResult(this.knex.select('id').from('inventories').where({
                branchId: this.branchId,
                fiscalPeriodId: id
            }).first());

        return !!(isUsedOnJournal || isUsedOnInventory);
    }

    create(entity) {
        super.create(entity);

        toResult(this.knex('fiscalPeriods').insert(entity));
    }

    update(id, entity) {

        toResult(this.knex('fiscalPeriods').where({branchId: this.branchId, id}).update(entity));
    }

    remove(id) {

        toResult(this.knex('fiscalPeriods').where({branchId: this.branchId, id}).del());
    }
}

