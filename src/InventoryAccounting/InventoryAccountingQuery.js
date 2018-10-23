import toResult from "asyncawait/await";
import {injectable, inject} from "inversify";
import {BaseQuery} from "../Infrastructure/BaseQuery";

@injectable()
export class InventoryAccountingQuery extends BaseQuery {

    @inject("State")
    /** @type{IState}*/ state = undefined;

    @inject("Enums") enums = undefined;

    tableName = "inventories";

    tableLineName = "inventoryLines";

    getTinyTurnoverByProduct(productId, parameters){

        const knex = this.knex,
            tableName = this.tableName,
            tableLineName = this.tableLineName,
            branchId = this.state.branchId,
            fiscalPeriodId = this.state.fiscalPeriodId;

        const subqueryQuantity = `SELECT SUM(CASE WHEN "inventoryType" = 'input' THEN quantity ELSE quantity * -1 END)
         FROM ${tableName} AS i LEFT JOIN "${tableLineName}" AS l ON i.id = l."inventoryId"
         WHERE i."fiscalPeriodId" = '${fiscalPeriodId}' AND
              i."branchId" = '${branchId}' AND
              l."productId" = '${productId}' AND
              i."createdAt" < "${tableName}"."createdAt"`,

            subqueryPrice = `SELECT SUM(quantity * "unitPrice")/SUM(quantity)
         FROM ${tableName} AS i LEFT JOIN "${tableLineName}" AS l ON i.id = l."inventoryId"
         WHERE i."fiscalPeriodId" = '${fiscalPeriodId}' AND
              i."branchId" = '${branchId}' AND
              l."productId" = '${productId}' AND
              i."inventoryType" = 'input' AND
              i."createdAt" < "${tableName}"."createdAt"`;


        const query = this.knex.from(function () {

            this.select(
                'number',
                'date',
                'inventoryType',
                'ioType',
                knex.raw('"inventoryIOTypes".title as "ioTypeDisplay"'),
                'stockId',
                knex.raw('stocks.title as "stockDisplay"'),
                'quantity',
                'unitPrice',
                knex.raw(`(${subqueryQuantity}) as "remainderQuantity"`),
                knex.raw(`(${subqueryPrice}) as "remainderPrice"`)
            )
                .from(tableName)
                .leftJoin(tableLineName, `${tableLineName}.inventoryId`, `${tableName}.id`)
                .leftJoin('stocks', `${tableName}.stockId`, `stocks.id`)
                .leftJoin('inventoryIOTypes', `${tableName}.ioType`, `inventoryIOTypes.id`)
                .where('productId', productId)
                .where(`${tableName}.fiscalPeriodId`, fiscalPeriodId)
                .where(`${tableName}.branchId`, branchId)
                .as('base')
        }),

            view = item => ({
                number: item.number,
                date: item.date,
                inventoryType: item.inventoryType,
                ioType: item.ioType,
                ioTypeDisplay: item.ioTypeDisplay,
                stockId: item.stockId,
                stockDisplay: item.stockDisplay,
                quantity: item.quantity,
                unitPrice: item.unitPrice || 0,
                remainder: {
                    quantity: item.remainderQuantity,
                    unitPrice: item.remainderPrice || 0
                }
            });

        return toResult(Utility.kendoQueryResolve(query, parameters, view));
    }
}