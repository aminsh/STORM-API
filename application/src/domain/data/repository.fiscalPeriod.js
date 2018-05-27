import toResult from "asyncawait/await";
import {BaseRepository} from "./repository.base";
import {injectable} from "inversify";

@injectable()
export class FiscalPeriodRepository extends BaseRepository {

    findById(id) {
        return toResult(this.knex.table('fiscalPeriods')
            .modify(this.modify, this.branchId)
            .where('id', id)
            .first());
    }

    findFirstOpen(){
        return toResult(this.knex.select('*').from('fiscalPeriods')
            .modify(this.modify, this.branchId)
            .where({isClosed: false})
            .orderBy('createdAt', 'desc')
            .first()
        );
    }

    create(entity) {
        super.create(entity);
        toResult(this.knex('fiscalPeriods').insert(entity));
    }
}

