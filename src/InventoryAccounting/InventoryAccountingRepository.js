import toResult from "asyncawait/await";
import {BaseRepository} from "../Infrastructure/BaseRepository";
import {injectable} from "inversify";

@injectable()
export class InventoryAccountingRepository extends BaseRepository {

    tableName = "inventories";

    inventoryLineTableName = "inventoryLines";

    findById(id) {
        let inventory = toResult(this.knex.table(this.tableName).where('id', id).first());

        if (!inventory) return null;

        inventory.inventoryLines = toResult(this.knex.table(this.inventoryLineTableName).where('inventoryId', id));

        return inventory;
    }

    get _basePricingQuery() {

        const knex = this.knex,
            self = this;

        return knex.from(function () {
            this.select(
                knex.raw(`ROW_NUMBER () OVER (ORDER BY ${self.tableName}."createdAt") as row`),
                `${self.inventoryLineTableName}.productId`,
                `${self.inventoryLineTableName}.quantity`,
                `${self.inventoryLineTableName}.unitPrice`,
                knex.raw(`"${self.inventoryLineTableName}".id as "lineId"`),
                `${self.tableName}.id`,
                `${self.tableName}.ioType`,
                `${self.tableName}.priceManuallyEntered`,
                `${self.tableName}.priceStatus`,
                knex.raw(`${self.tableName}."inventoryType" as type`)
            )
                .from(self.tableName)
                .leftJoin(self.inventoryLineTableName, `${self.inventoryLineTableName}.inventoryId`, `${self.tableName}.id`)
                .where(`${self.tableName}.branchId`, self.branchId)
                .where(`${self.tableName}.fiscalPeriodId`, self.state.fiscalPeriodId)
                .as('base')
        });
    }

    findAll() {

        return toResult(this._basePricingQuery);
    }

    getAveragePrice(lineId) {

        const zeroBefore = toResult(this.findBeforeHasZero(lineId));

        if(zeroBefore && zeroBefore.length > 0)
            return 0;

        const item = toResult(this._basePricingQuery.select('row', 'productId').where({lineId}).first()),
            knex = this.knex;

        const result = toResult(
            this._basePricingQuery.select(knex.raw('sum(quantity * "unitPrice") / sum(quantity) as price'))
                .where('row', '<', item.row)
                .where('productId', item.productId)
                .where('type', 'input')
                .whereIn('ioType', ['firstInput', 'inputPurchase'])
                .first()
        );

        return result.price;
    }

    findBeforeHasZero(lineId) {

        const item = toResult(this._basePricingQuery.select('row', 'productId').where({lineId}).first());

        return toResult(
            this._basePricingQuery.select('id')
                .where('row', '<', item.row)
                .where('type', 'input')
                .where('productId', item.productId)
                .where('unitPrice', '=', 0)
        );
    }

    getZeroPriceOnInputs(date) {
        return toResult(
            this.knex.select(`${this.tableName}.id`)
                .from(this.inventoryLineTableName)
                .leftJoin(this.tableName, `${this.inventoryLineTableName}.inventoryId`, `${this.tableName}.id`)
                .where(`${this.tableName}.branchId`, this.branchId)
                .where(`${this.tableName}.inventoryType`, 'input')
                .where(`${this.tableName}.fiscalPeriodId`, this.state.fiscalPeriodId)
                .whereIn(`${this.tableName}.ioType`, ['inputFirst', 'inputPurchase'])
                .where('unitPrice', 0)
                .where('date', '<=', date)
        );
    }

    findAllNotFixed() {
        const knex = this.knex;

        return toResult(
            this.knex.select(
                `${this.inventoryLineTableName}.productId`,
                `${this.inventoryLineTableName}.quantity`,
                `${this.inventoryLineTableName}.unitPrice`,
                knex.raw(`"${this.inventoryLineTableName}".id as "lineId"`),
                `${this.tableName}.id`,
                `${this.tableName}.ioType`,
                `${this.tableName}.priceManuallyEntered`,
                knex.raw(`${this.tableName}."inventoryType" as type`))
                .from(this.inventoryLineTableName)
                .leftJoin(this.tableName, `${this.inventoryLineTableName}.inventoryId`, `${this.tableName}.id`)
                .where(`${this.tableName}.branchId`, this.branchId)
                //.where(`${this.tableName}.fixedAmount`, false)
                .orderBy(`${this.tableName}.createdAt`)
        );
    }

    totalQuantityAndPriceOnFixedInputsByProduct() {

        const knex = this.knex, self = this;

        return toResult(
            knex.select(
                'productId',
                knex.raw('sum(quantity) as quantity'),
                knex.raw('sum(quantity * "unitPrice")/sum(quantity) as "unitPrice"')
            ).from(function () {
                this.select('productId', 'quantity', 'unitPrice')
                    .from(self.tableName)
                    .leftJoin(self.inventoryLineTableName, `${self.inventoryLineTableName}.inventoryId`, `${self.tableName}.id`)
                    .where(`${self.tableName}.branchId`, self.branchId)
                    .where(`${self.tableName}.fiscalPeriodId`, self.state.fiscalPeriodId)
                    .where(`${self.tableName}.inventoryType`, 'input')
                    //.where(`${self.tableName}.fixedAmount`, true)
                    .as('base')
            })
                .groupBy('productId')
        );
    }

    update(id, data) {

        toResult(this.knex(this.tableName)
            .where({id, branchId: this.branchId}).update(data));
    }

    updateLine(lineId, data) {

        toResult(this.knex(this.inventoryLineTableName)
            .where({id: lineId, branchId: this.branchId}).update(data));
    }


}