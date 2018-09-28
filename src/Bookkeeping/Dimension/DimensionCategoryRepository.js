import toResult from "asyncawait/await";
import {BaseRepository} from "../../Infrastructure/BaseRepository";
import {injectable} from "inversify";

@injectable()
export class DimensionCategoryRepository extends BaseRepository {

    findById(id) {
        return toResult(this.knex.table('dimensionCategories')
            .modify(this.modify, this.branchId)
            .where('id', id)
            .first());
    }

    create(entity) {
        super.create(entity);
        toResult(this.knex('dimensionCategories').insert(entity));
        return entity.id;
    }

    update(entity) {
        return toResult(this.knex('dimensionCategories')
            .modify(this.modify, this.branchId)
            .where('id', entity.id)
            .update(entity));
    }

    remove(id) {
        return toResult(this.knex('dimensionCategories')
            .modify(this.modify, this.branchId)
            .where('id', id)
            .del());
    }

    isExistDimensionCategoryInDimension(id){
        return toResult(this.knex.select('dimensionCategories.title','dimensions.code')
            .from('dimensionCategories')
            .leftJoin('dimensions','dimensions.createdById','dimensionCategories.id')
            .where('dimensionCategories.id',id)
            .first());
    }
}
