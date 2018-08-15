import toResult from "asyncawait/await";
import {BaseRepository} from "../core/BaseRepository";
import {injectable} from "inversify";

@injectable()
export class VerificationRepository extends BaseRepository {

    tableName = 'verification';

    findByCode(code) {
        return toResult(this.knex.from(this.tableName).where({code}).first());
    }

    findByMobile(mobile){
        return toResult(this.knex.from(this.tableName).where({mobile}).first());
    }

    create(entity) {

        entity.id = Utility.Guid.new();

        toResult(this.knex(this.tableName).insert(entity));
    }


    remove(id) {
        return toResult(this.knex(this.tableName).where({id}).del());
    }

}
