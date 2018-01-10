import aw from "asyncawait/await";
import {BaseRepository} from "./repository.base";
import {injectable} from "inversify";

@injectable()
export class ProductRepository extends BaseRepository {

    findById(id) {
        return aw(this.knex.table('products')
            .modify(this.modify, this.branchId)
            .where('id', id)
            .first());
    }

    /*
    * @return products by id array list
    * @param ids
    */

    findByIds(ids) {
        return aw(this.knex.table('products')
            .modify(this.modify, this.branchId)
            .whereIn('id', ids));
    }

    findByCode(code, notEqualId) {
        let query = this.knex.table('products')
            .modify(this.modify, this.branchId)
            .where('code', code);

        if (notEqualId)
            query.andWhere('id', '!=', notEqualId);

        return aw(query.first());
    }

    isGood(id) {
        return aw(this.knex.table('products')
            .modify(this.modify, this.branchId)
            .where('id', id)
            .andWhere('productType', 'good')
            .first());
    }

    findByReferenceId(referenceId , notEqualId) {
        let query = this.knex.table('products')
            .modify(this.modify, this.branchId)
            .where('referenceId', referenceId);

        if(notEqualId)
            query.where('id', '!=', notEqualId);

        return aw(query.first());
    }

    create(entity) {

        if (Array.isArray(entity))
            entity.forEach(item => super.create(item));
        else
            super.create(entity);

        return aw(this.knex('products').insert(entity));
    }

    update(id, entity) {
        return aw(this.knex('products')
            .modify(this.modify, this.branchId)
            .where('id', id).update(entity));
    }

    remove(id) {
        return aw(this.knex('products')
            .modify(this.modify, this.branchId)
            .where('id', id).del());
    }

    isExistsCategory(categoryId){
        return aw(this.knex.select('id')
            .from('products')
            .where('categoryId', categoryId)
            .first())
    }

    isExistsScale(scaleId){
        return aw(this.knex.select('id')
            .from('products')
            .where('scaleId', scaleId)
            .first())
    }
}
