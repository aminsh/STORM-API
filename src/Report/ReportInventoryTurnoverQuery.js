import { BaseQuery } from "../Infrastructure/BaseQuery";
import toResult from "asyncawait/await";
import { injectable, inject } from "inversify";

@injectable()
export class ReportInventoryTurnoverQuery extends BaseQuery {

    @inject("ReportConfig")
    /**@type{ReportConfig}*/ reportConfig = undefined;

    @inject("Enums") enums = undefined;

    getInventoriesTurnover(parameters) {

        let knex = this.knex,
            branchId = this.branchId,
            userId = this.state.user.id,
            canView = this.canView.call(this),
            modify = this.modify.bind(this),
            stockIds = parameters.stockIds && Array.isArray(parameters.stockIds) && parameters.stockIds.length > 0
                ? parameters.stockIds
                : null,
            dateRange = parameters.minDate && parameters.maxDate
                ? [ parameters.minDate, parameters.maxDate ]
                : null;

        let query = knex.from(function () {
            let q = this.select(
                'inventories.number',
                'inventories.date',
                'inventories.inventoryType',
                'inventories.ioType',
                'inventories.stockId',
                knex.raw('stocks.title as stock'),
                knex.raw('"inventoryIOTypes".title as "ioTypeText"'),
                'inventoryLines.productId',
                knex.raw('products.title as product'),
                'inventoryLines.quantity',
                'inventoryLines.unitPrice',
                knex.raw('"inventoryLines".quantity * "inventoryLines"."unitPrice" as "totalPrice"')
            )
                .from('stocks')
                .leftJoin('inventories', 'inventories.stockId', 'stocks.id')
                .leftJoin('inventoryIOTypes', 'inventoryIOTypes.id', 'inventories.ioType')
                .leftJoin('inventoryLines', 'inventoryLines.inventoryId', 'inventories.id')
                .leftJoin('products', 'products.id', 'inventoryLines.productId')
                .modify(modify, branchId, userId, canView, 'inventories');

            if (stockIds)
                q.whereIn('stockId', stockIds);

            if (dateRange)
                q.whereBetween('date', dateRange);

            q.as('base');

        });

        let view = item => ( {
            number: item.number,
            date: item.date,
            inventoryType: item.inventoryType,
            inventoryTypeText: item.inventoryType
                ? this.enums.InventoryType().getDisplay(item.inventoryType)
                : null,
            ioType: item.ioType,
            ioTypeText: item.ioTypeText,
            productId: item.productId,
            product: item.product,
            stockId: item.stockId,
            stock: item.stock,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.totalPrice
        } );

        return toResult(Utility.kendoQueryResolve(query, parameters, view.bind(this)));
    }
}