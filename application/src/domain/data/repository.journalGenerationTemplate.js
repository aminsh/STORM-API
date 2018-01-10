import aw from "asyncawait/await";
import {BaseRepository} from "./repository.base";
import {injectable} from "inversify";

@injectable()
export class JournalGenerationTemplateRepository extends BaseRepository {

    tableName = 'journalGenerationTemplates';

    findBySourceType(sourceType) {
        return aw(this.knex.select('*')
            .from(this.tableName)
            .where('branchId', this.branchId)
            .where('sourceType', sourceType)
            .first());
    }

    create(sourceType, entity) {
        super.create(entity);

        entity.sourceType = sourceType;

        return this.knex(this.tableName).insert(entity);
    }

    update(sourceType, entity) {
        entity.sourceType = sourceType;

        return this.knex(this.tableName)
            .where('branchId', this.branchId)
            .where('sourceType', sourceType).update(entity);
    }

    remove(id) {
        return this.knex(this.tableName).where('id', id).del();
    }
}
