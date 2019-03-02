import toResult from "asyncawait/await";
import { BaseRepository } from "../Infrastructure/BaseRepository";
import { injectable } from "inversify";

@injectable()
export class InventoryPricingRepository extends BaseRepository {
    tableName = 'inventory_pricing';
    productsTableName = 'inventory_pricing_products';
    stocksTableName = 'inventory_pricing_stocks';
    inventoriesTableName = 'inventory_pricing_inventories';

    findById(id) {
        let base = toResult(this.knex.select('*').from(this.tableName).where('id', id).first());

        if (!base)
            return;

        base.products = toResult(this.knex.select('*')
            .from(this.productsTableName)
            .where({ branchId: this.branchId, inventoryPricingId: id }));
        base.stocks = toResult(this.knex.select('*')
            .from(this.stocksTableName)
            .where({ branchId: this.branchId, inventoryPricingId: id }));
        base.inventories = toResult(this.knex.select('*')
            .from(this.inventoriesTableName)
            .where({ branchId: this.branchId, inventoryPricingId: id }));

        return base;
    }

    findLast() {
        const result = toResult(this.knex.select('id')
            .from(this.tableName)
            .where('branchId', this.branchId)
            .orderBy('createdAt', 'desc').first());

        if (!result)
            return;

        return this.findById(result.id);
    }

    findLastInventories() {
        return toResult(
            this.knex.select(`${this.inventoriesTableName}.*`)
                .from(this.tableName)
                .leftJoin(this.inventoriesTableName, `${this.tableName}.id`, `${this.inventoriesTableName}.inventoryPricingId`)
                .where(`${this.tableName}.branchId`, this.branchId)
                .where(`${this.tableName}.fiscalPeriodId`, this.state.fiscalPeriodId)
        );
    }

    isInventoryExist(inventoryId) {
        return !!toResult(
            this.knex.select('id').from(this.inventoriesTableName)
                .where({ branchId: this.branchId, inventoryId })
                .first()
        );
    }

    create(data, products, stocks, inventories) {
        const branchId = this.branchId;

        super.create(data);

        data.fiscalPeriodId = this.state.fiscalPeriodId;

        const setCreation = item => {
            item.inventoryPricingId = data.id;
            item.branchId = branchId;
            item.createdById = this.state.user.id
        };

        if (products && products.length > 0)
            products.forEach(setCreation);

        if (stocks && stocks.length > 0)
            stocks.forEach(setCreation);

        if (inventories && inventories.length > 0)
            inventories.forEach(setCreation);

        const trx = this.transaction;

        try {
            toResult(trx(this.tableName).insert(data));
            toResult(trx(this.productsTableName).insert(products));
            toResult(trx(this.stocksTableName).insert(stocks));
            toResult(trx(this.inventoriesTableName).insert(inventories));

            trx.commit();
        }
        catch (e) {
            trx.rollback(e);
            throw new Error(e);
        }
    }

    remove(id) {
        const trx = this.transaction;

        try {
            const filter = { branchId: this.branchId, inventoryPricingId: id };
            toResult(trx(this.productsTableName).where(filter).del());
            toResult(trx(this.stocksTableName).where(filter).del());
            toResult(trx(this.inventoriesTableName).where(filter).del());
            toResult(trx(this.tableName).where({ branchId: this.branchId, id }).del());

            trx.commit();
        }
        catch (e) {
            trx.rollback(e);
            throw new Error(e);
        }
    }
}