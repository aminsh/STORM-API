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

    getZeroPriceOnInputs(date){
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
                knex.raw(`${this.tableName}."inventoryType" as type`))
                .from(this.inventoryLineTableName)
                .leftJoin(this.tableName, `${this.inventoryLineTableName}.inventoryId`, `${this.tableName}.id`)
                .where(`${this.tableName}.branchId`, this.branchId)
                .where(`${this.tableName}.fixedAmount`, false)
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
                    .where(`${self.tableName}.fixedAmount`, true)
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