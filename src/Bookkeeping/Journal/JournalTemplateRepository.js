import toResult from "asyncawait/await";
import {BaseRepository} from "../../Infrastructure/BaseRepository";
import {injectable} from "inversify";

export class JournalTemplateRepository extends BaseRepository {

    tableName= "journalTemplates";

    findById(id){

        return toResult(
            this.knex.select('*').from(this.tableName).where({branchId: this.branchId, id}).first()
        );
    }

    create(entity) {

        super.create(entity);

        toResult(this.knex(this.tableName).insert(entity));

        return entity.id;
    }

    update(id, entity){

        toResult(
            this.knex(this.tableName).where({branchId: this.branchId, id}).update(entity)
        );
    }

    remove(id){

        toResult(
            this.knex(this.tableName).where({branchId: this.branchId, id}).del()
        );
    }
}