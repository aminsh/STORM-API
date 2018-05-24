import toResult from "asyncawait/await";
import {BaseRepository} from "./repository.base";
import {injectable} from "inversify";

@injectable()
export class VerificationRepository extends BaseRepository {

    tableName = 'verification';

    findByCode(code) {
        return toResult(this.knex.from(this.tableName).where({code}).first());
    }

    create(entity) {

        entity.id = Utility.Guid.new();

        toResult(this.knex(this.tableName).insert(entity));
    }


    remove(id) {
        return toResult(this.knex(this.tableName).where({id}).del());
    }

}
