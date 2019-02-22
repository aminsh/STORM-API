import toResult from "asyncawait/await";
import { injectable, inject } from "inversify";
import { BaseQuery } from "../Infrastructure/BaseQuery";

@injectable()
export class InventoryPricingQuery extends BaseQuery {
    tableName = 'inventory_pricing';
    productsTableName = 'inventory_pricing_products';
    stocksTableName = 'inventory_pricing_stocks';
    inventoriesTableName = 'inventory_pricing_inventories';

    @inject('Enums') enums = undefined;

    getAll(parameters) {
        const self = this;

        let query = this.knex.from(function () {
            this.select('*')
                .from(self.tableName)
                .where({ branchId: self.branchId, fiscalPeriodId: self.state.fiscalPeriodId })
                .as('base')
        });

        return toResult(
            Utility.kendoQueryResolve(query, parameters, this.view.bind(this))
        )

    }

    getById(id) {
        const entity = toResult(
            this.knex.select('*').from(this.tableName)
                .where({ branchId: self.branchId, fiscalPeriodId: self.state.fiscalPeriodId, id })
                .first()
        );

        return this.view(entity);
    }

    getProducts(id, parameters) {
        const self = this;

        let query = this.knex.from(function () {
            this.select(
                `${self.productsTableName}.*`,
                self.knex('products.title as product_title')
            )
                .from(self.tableName)
                .leftJoin(self.productsTableName, `${self.tableName}.id`, `${self.productsTableName}.inventoryPricingId`)
                .leftJoin('products', `${self.productsTableName}.productId`, `products.id`)
                .where(`${self.tableName}.branchId`, self.branchId)
                .where(`${self.tableName}.fiscalPeriodId`, self.state.fiscalPeriodId)
                .where({ inventoryPricingId: id })
                .as('base')
        });

        return toResult(
            Utility.kendoQueryResolve(query, parameters, this.viewProduct.bind(this))
        )
    }

    getInventories(id, parameters) {
        const self = this;

        let query = this.knex.from(function () {
            this.select(
                'inventories.*',
                self.knex('stocks.title as stock_title'),
                self.knex('inventoryIOTypes.title as iotype_title')
            )
                .from(self.tableName)
                .leftJoin(self.inventoriesTableName, `${self.tableName}.id`, `${self.inventoriesTableName}.inventoryPricingId`)
                .leftJoin('inventories', `${self.inventoriesTableName}.inventoryId`, `inventories.id`)
                .leftJoin('stocks', `stocks.id`, `inventories.stockId`)
                .leftJoin('inventoryIOTypes', 'inventories.ioType', 'inventoryIOTypes.id')
                .where(`${self.tableName}.branchId`, self.branchId)
                .where(`${self.tableName}.fiscalPeriodId`, self.state.fiscalPeriodId)
                .where({ inventoryPricingId: id })
                .as('base')
        });

        return toResult(
            Utility.kendoQueryResolve(query, parameters, this.viewInventory.bind(this))
        )
    }

    view(entity) {
        return {
            id: entity.id,
            fromDate: entity.fromDate,
            toDate: entity.toDate
        };
    }

    viewProduct(entity) {
        return {
            productId: entity.productId,
            productDisplay: entity.product_title,
            lastPrice: entity.lastPrice,
            lastQuantity: entity.lastQuantity
        };
    }

    viewInventory(entity) {
        return {
            number: entity.number,
            date: entity.date,
            time: entity.time,
            stock: { id: entity.stockId, title: entity.stock_title },
            ioType: { id: entity.ioType, title: entity.iotype_title },
            inventoryType: entity.inventoryType ? {
                key: entity.inventoryType,
                display: this.enums.InventoryType().getDisplay(entity.inventoryType)
            } : null
        };
    }
}