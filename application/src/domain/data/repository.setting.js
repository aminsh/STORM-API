import toResult from "asyncawait/await";
import {BaseRepository} from "./repository.base";
import {injectable} from "inversify";

@injectable()
export class SettingsRepository extends BaseRepository {

    create(entity) {
        super.create(entity);

        return this.knex('settings').insert(entity);
    }

    update(entity) {
        return toResult(this.knex('settings')
            .modify(this.modify, this.branchId)
            .update(entity));
    }

    get() {
        return toResult(this.knex.table('settings')
            .modify(this.modify, this.branchId)
            .first());
    }

}
