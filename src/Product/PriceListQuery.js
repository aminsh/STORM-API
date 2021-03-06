import {BaseQuery} from "../Infrastructure/BaseQuery";
import toResult from "asyncawait/await";
import {inject, injectable} from "inversify";

@injectable()
export class PriceListQuery extends BaseQuery {

    tableName = "product_price_list";

    tableLineName = "product_price_list_lines";

    getAll(parameters) {

        const query = this.knex
            .from(this.tableName)
            .where('branchId', this.branchId);

        return toResult(Utility.kendoQueryResolve(query, parameters, this.view.bind(this)));
    }

    getById(id) {
        const result = toResult(
            this.knex.select()
                .from(this.tableName)
                .where({branchId: this.branchId, id})
                .first()
        );

        return this.view(result);
    }

    getLines(id, parameters) {

        if (id.toLowerCase() === 'default')
            id = (toResult(this.knex.select('id').from(this.tableName).where({isDefault: true}).first()) || {}).id;

        const self = this;

        const query = this.knex.from(function () {
            this.select(`${self.tableLineName}.*`, self.knex.raw('products.title as "productDisplay"'))
                .from(self.tableLineName)
                .leftJoin('products', `${self.tableLineName}.productId`, 'products.id')
                .where(`${self.tableLineName}.branchId`, self.branchId)
                .where('priceListId', id)
                .as('base');
        });

        return toResult(Utility.kendoQueryResolve(query, parameters, this.viewLine.bind(this)));
    }

    getByProduct(productId) {

        const query = this.knex.select(
            `${this.tableName}.id`,
            `${this.tableName}.title`,
            `${this.tableLineName}.productId`,
            `${this.tableLineName}.price`
        )
            .from(this.tableName)
            .leftJoin(this.tableLineName, `${this.tableName}.id`, `${this.tableLineName}.priceListId`)
            .where({branchId: this.branchId, productId});

        return toResult(query);
    }

    getPrice(id, productId) {
        const result = toResult(this.knex.select('price')
            .from(this.tableLineName)
            .where({priceListId: id, productId, branchId: this.state.branchId})
            .first());

        if (!result)
            throw new NotFoundException();

        return result.price;
    }

    view(item) {

        return {
            id: item.id,
            title: item.title,
            isDefault: item.isDefault
        }
    }

    viewLine(item) {

        return {
            productId: item.productId,
            productDisplay: item.productDisplay,
            price: item.price
        }
    }

}
