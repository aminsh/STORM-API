import {BaseRepository} from "../Infrastructure/BaseRepository";
import {injectable} from "inversify";
import toResult from "asyncawait/await";

@injectable()
export class PriceListRepository extends BaseRepository {

    tableName = "product_price_list";

    tableLineName = "product_price_list_lines";

    findById(id) {

        return toResult(this.knex.select('*')
            .form(this.tableName).where({branchId: this.branchId, id}).first());
    }

    findProduct(id, productId) {
        return toResult(this.knex.select('*')
            .form(this.tableLineName).where({branchId: this.branchId, priceListId: id, productId}).first());
    }

    create(entity) {

        super.create(entity);

        toResult(this.knex(this.tableName).insert(entity));
    }

    update(id, entity) {

        toResult(this.knex(this.tableName).where({branchId: this.branchId, id}).update(entity));
    }

    remove(id) {

        toResult(this.knex(this.tableName).where({branchId: this.branchId, id}).del());
    }

    createProduct(id, entity) {

        entity.priceListId = id;

        toResult(this.knex(this.tableLineName).insert(entity));
    }

    updateProduct(lineId, entity) {

        toResult(this.knex(this.tableLineName).where({branchId: this.branchId, id: lineId}).update(entity));
    }
}