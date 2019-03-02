import toResult from "asyncawait/await";
import { BaseRepository } from "../Infrastructure/BaseRepository";
import { injectable } from "inversify"

@injectable()
export class ProductRepository extends BaseRepository {

    get query() {
        return this.knex.select('*').from('products');
    }

    findOne(query) {
        query.where('branchId', this.branchId);
        query.first();

        let product = toResult(query);

        if (!product)
            return null;

        product.stocks = toResult(this.knex
            .select('stockId', 'isDefault')
            .from('products_stocks')
            .where({ branchId: this.branchId, productId: product.id }));

        return product;
    }

    findById(id) {
        const query = this.query;

        query.where('id', id);

        return this.findOne(query);
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
        let query = this.query;

        query.where('code', code);

        if (notEqualId)
            query.andWhere('id', '!=', notEqualId);

        return this.findOne(query);
    }

    isGood(id) {
        let query = this.query;
        query.where('id', id);
        query.where('productType', 'good');

        return !!this.findOne(query);
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
        const trx = this.transaction,
            branchId = this.branchId;

        try {
            let products_stocks = [];

            if (Array.isArray(entity))
                entity.forEach(item => {
                    super.create(item);
                    if (item.stocks) {
                        let stocks = item.stocks;
                        delete  item.stocks;

                        stocks.forEach(s => {
                            s.branchId = branchId;
                            s.productId = item.id;
                        });

                        products_stocks = products_stocks.concat(stocks);
                    }
                });
            else {
                super.create(entity);
                if (entity.stocks) {
                    entity.stocks.forEach(s => {
                        s.branchId = branchId;
                        s.productId = entity.id;
                    });

                    products_stocks = products_stocks.concat(entity.stocks);
                    delete entity.stocks;
                }
            }
            toResult(trx('products').insert(entity));
            toResult(trx('products_stocks').insert(products_stocks));
            trx.commit();

            return entity;
        }
        catch (e) {
            trx.rollback(e);
            throw new Error(e);
        }
    }

    update(id, entity) {
        const trx = this.transaction,
            branchId = this.branchId;

        try {
            let products_stocks = [];

            toResult(trx('products_stocks').where({ branchId, productId: id }).del());

            if (entity.stocks) {
                entity.stocks.forEach(s => {
                    s.branchId = branchId;
                    s.productId = id;
                });

                products_stocks = entity.stocks;
                delete entity.stocks;
            }

            toResult(trx('products_stocks').insert(products_stocks));
            toResult(this.knex('products')
                .modify(this.modify, this.branchId)
                .where('id', id).update(entity));

            trx.commit();
        }
        catch (e) {
            trx.rollback(e);
            throw new Error(e);
        }
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
