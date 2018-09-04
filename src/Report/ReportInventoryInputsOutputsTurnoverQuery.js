import {BaseQuery} from "../Infrastructure/BaseQuery";
import toResult from "asyncawait/await";
import {injectable, inject} from "inversify";

@injectable()
export class ReportInventoryInputsOutputsTurnoverQuery extends BaseQuery {

    getInventories(ids, inventoryType) {
        let knex = this.knex,
            branchId = this.branchId,
            userId = this.userId,
            canView = this.canView.call(this),
            modify = this.modify.bind(this);

        return toResult(
            knex.select(knex.raw(
                `products.title as product,
            products."referenceId" as "productReferenceId",
            "inventoryLines".quantity, "inventoryLines"."unitPrice",
            "inventoryLines".quantity*"inventoryLines"."unitPrice" as "totalPrice",
            inventories.date, inventories.number, stocks.title as stock,
            "invoiceLines".description`
            ))
                .from('inventories')
                .modify(modify, branchId, userId, canView, 'inventories')
                .whereIn('inventories.id', ids)
                .where('inventoryType',inventoryType)
                .innerJoin('inventoryLines', 'inventoryLines.inventoryId', 'inventories.id')
                .innerJoin('products', 'products.id', 'inventoryLines.productId')
                .innerJoin('stocks', 'stocks.id', 'inventories.stockId')
                .leftJoin('invoices', 'invoices.id', 'inventories.invoiceId')
                .leftJoin('invoiceLines', 'invoiceLines.invoiceId', 'invoices.id')
                .as('inventory'))
    }
}