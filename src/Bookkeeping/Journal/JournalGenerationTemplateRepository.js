import toResult from "asyncawait/await";
import {BaseRepository} from "../../Infrastructure/BaseRepository";
import {injectable} from "inversify";

@injectable()
export class JournalGenerationTemplateRepository extends BaseRepository {

    tableName = 'journalGenerationTemplates';

    findById(id) {
        return toResult(this.knex.select('*')
            .from(this.tableName)
            .modify(this.modify, this.branchId)
            .where('id', id)
            .first());
    }

    create(entity) {
        super.create(entity);

        toResult(this.knex(this.tableName).insert(entity));

        return entity.id;
    }

    update(id, entity) {
        toResult(this.knex(this.tableName)
            .modify(this.modify, this.branchId)
            .where('id', id).update(entity));
    }

    remove(id) {
        toResult(this.knex(this.tableName)
            .modify(this.modify, this.branchId)
            .where('id', id).del());
    }
}
