import toResult from "asyncawait/await";
import {BaseRepository} from "../Infrastructure/BaseRepository";
import {injectable} from "inversify"

@injectable()
export class ProductRepository extends BaseRepository {

    findById(id) {
        return toResult(this.knex.table('products')
            .modify(this.modify, this.branchId)
            .where('id', id)
            .first());
    }

    /*
    * @return products by id array list
    * @param ids
    */

    findByIds(ids) {
        return toResult(this.knex.table('products')
            .modify(this.modify, this.branchId)
            .whereIn('id', ids));
    }

    findByCode(code, notEqualId) {
        let query = this.knex.table('products')
            .modify(this.modify, this.branchId)
            .where('code', code);

        if (notEqualId)
            query.andWhere('id', '!=', notEqualId);

        return toResult(query.first());
    }

    isGood(id) {
        return toResult(this.knex.table('products')
            .modify(this.modify, this.branchId)
            .where('id', id)
            .andWhere('productType', 'good')
            .first());
    }

    findByReferenceId(referenceId, notEqualId) {
        let query = this.knex.table('products')
            .modify(this.modify, this.branchId)
            .where('referenceId', referenceId);

        if (notEqualId)
            query.where('id', '!=', notEqualId);

        return toResult(query.first());
    }

    create(entity) {

        if (Array.isArray(entity))
            entity.forEach(item => super.create(item));
        else
            super.create(entity);

        return toResult(this.knex('products')
            .insert(entity));
    }

    update(id, entity) {
        return toResult(this.knex('products')
            .modify(this.modify, this.branchId)
            .where('id', id).update(entity));
    }

    remove(id) {
        return toResult(this.knex('products')
            .modify(this.modify, this.branchId)
            .where('id', id).del());
    }

    isExistsCategory(categoryId) {
        return toResult(this.knex.select('id')
            .from('products')
            .modify(this.modify, this.branchId)
            .where('categoryId', categoryId)
            .first())
    }

    isExistsScale(scaleId) {
        return toResult(this.knex.select('id')
            .from('products')
            .modify(this.modify, this.branchId)
            .where('scaleId', scaleId)
            .first())
    }
}
