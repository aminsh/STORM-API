import toResult from "asyncawait/await";
import {BaseRepository} from "./repository.base";
import {injectable} from "inversify";

@injectable()
export class DimensionRepository extends BaseRepository {

    findById(id) {
        return toResult(this.knex.table('dimensions')
            .modify(this.modify, this.branchId)
            .where('id', id)
            .first());
    }

    findByCode(code, dimensionCategoryId, notEqualId) {
        let query = toResult(this.knex.table('dimensions')
            .modify(this.modify, this.branchId)
            .where('code', code)
            .andWhere('dimensionCategoryId', dimensionCategoryId));

        if (notEqualId)
            query.andWhere('id', '!=', notEqualId);

        return query.first();
    }

    create(entity) {
        super.create(entity);
        return toResult(this.knex('dimensions').insert(entity));
    }

    update(entity) {
        return toResult(this.knex('dimensions')
            .modify(this.modify, this.branchId)
            .where('id', entity.id)
            .update(entity));
    }

    remove(id) {
        return toResult(this.knex('dimensions')
            .modify(this.modify, this.branchId)
            .where('id', id)
            .del());
    }

    isExistDimensionInJournal(id) {
        return toResult(this.knex.select('journals.temporaryNumber')
            .from('journalLines')
            .leftJoin('journals','journals.id','journalLines.journalId')
            .where('journals.branchId', this.branchId)
            .where('dimension1Id', id)
            .orWhere('dimension2Id', id)
            .orWhere('dimension3Id', id)
            .first())
    }
}
