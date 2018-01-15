import toResult from "asyncawait/await";
import {BaseRepository} from "./repository.base";
import {injectable} from "inversify";

@injectable()
export class JournalGenerationTemplateRepository extends BaseRepository {

    tableName = 'journalGenerationTemplates';

    findBySourceType(sourceType) {
        return toResult(this.knex.select('*')
            .from(this.tableName)
            .where('branchId', this.branchId)
            .where('sourceType', sourceType)
            .first());
    }

    create(sourceType, entity) {
        super.create(entity);

        entity.sourceType = sourceType;

        return toResult(this.knex(this.tableName).insert(entity));
    }

    update(sourceType, entity) {
        entity.sourceType = sourceType;

        toResult(this.knex(this.tableName)
            .where('branchId', this.branchId)
            .where('sourceType', sourceType).update(entity));
    }

    remove(id) {
        toResult(this.knex(this.tableName).where('id', id).del());
    }
}
