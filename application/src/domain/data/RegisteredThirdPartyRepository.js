import {injectable, inject} from "inversify";
import toResult from "asyncawait/await";
import {BaseRepository} from "./repository.base";

@injectable()
export class RegisteredThirdPartyRepository extends BaseRepository {

    tableName = 'branchThirdParty';

    get(key) {
        return toResult(this.knex.from(this.tableName)
            .modify(this.modify, this.branchId)
            .where({key})
            .first()
        );
    }

    create(entity) {
        entity.branchId = this.branchId;

        toResult(this.knex(this.tableName).insert(entity));
    }

    remove(key) {
        toResult(
            this.knex(this.tableName)
                .where({key})
                .modify(this.modify, this.branchId)
                .del()
        );
    }
}