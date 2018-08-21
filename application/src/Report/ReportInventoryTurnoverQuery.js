import {BaseQuery} from "../core/BaseQuery";
import toResult from "asyncawait/await";
import {injectable, inject} from "inversify";

@injectable()
export class ReportInventoryTurnoverQuery extends BaseQuery {

    @inject("ReportConfig")
    /**@type{ReportConfig}*/ reportConfig = undefined;

    getInventoriesTurnover(ids) {

        let knex = this.knex,
            branchId = this.branchId,
            userId = this.state.user.id,
            canView = this.canView.call(this),
            modify = this.modify.bind(this),
            options = this.reportConfig.options;

        return toResult(
            knex.select(knex.raw(
                `CASE WHEN products."referenceId" ISNULL THEN products.title 
                ELSE products.title||' ${'کد'} ' ||products."referenceId" END AS product,
             inventories."inventoryType",
             CASE WHEN inventories."inventoryType" = 'output' THEN '${'حواله'}' 
                ELSE '${'رسید'}' END AS "inventoryTypeText",
            "inventoryLines".quantity, "inventoryLines"."unitPrice",
            "inventoryLines".quantity*"inventoryLines"."unitPrice" as "totalPrice",
            inventories.date, inventories.number, stocks.title as stock, stocks.id as "stockId"`),
                knex.raw('"inventoryIOTypes".title as "ioType"')
            )
                .from('stocks')
                .whereIn('stocks.id', ids)
                .innerJoin('inventories', 'inventories.stockId', 'stocks.id')
                .modify(modify, branchId, userId, canView, 'inventories')
                .innerJoin('inventoryIOTypes', 'inventoryIOTypes.id', 'inventories.ioType')
                .innerJoin('inventoryLines', 'inventoryLines.inventoryId', 'inventories.id')
                .innerJoin('products', 'products.id', 'inventoryLines.productId')
                .whereBetween('inventories.date', [options.fromMainDate, options.toDate])
                .as('inventoriesTurnover')
        );
    }
}