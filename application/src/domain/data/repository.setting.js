import aw from "asyncawait/await";
import {BaseRepository} from "./repository.base";
import {injectable} from "inversify";

@injectable()
export class SettingsRepository extends BaseRepository {

    create(entity) {
        super.create(entity);

        return this.knex('settings').insert(entity);
    }

    update(entity) {
        return aw(this.knex('settings').where('branchId', this.branchId).update(entity));
    }

    get() {
        return aw(this.knex.table('settings')
            .where('branchId', this.branchId)
            .first());
    }

}
