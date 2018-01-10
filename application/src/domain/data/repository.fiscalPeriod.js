import aw from "asyncawait/await";
import {BaseRepository} from "./repository.base";
import {injectable} from "inversify";

@injectable()
export class FiscalPeriodRepository extends BaseRepository {

    findById(id) {
        return aw(this.knex.table('fiscalPeriods')
            .modify(this.modify, this.branchId)
            .where('id', id)
            .first());
    }

    create(entity) {
        super.create(entity);
        aw(this.knex('fiscalPeriods').insert(entity));
    }
}

