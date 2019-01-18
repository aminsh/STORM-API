import {BaseQuery} from "../Infrastructure/BaseQuery";
import {injectable, inject} from "inversify";
import toResult from "asyncawait/await";

@injectable()
export class ReportInventory extends BaseQuery {
    @inject('Enums') enums = undefined;

    get(id) {
        const knex = this.knex;

        let query = knex.select(
            'inventories.id',
            'inventories.description',
            'inventories.number',
            'inventories.date',
            'inventories.inventoryType',
            'inventories.ioType',
            'inventories.stockId',
            knex.raw('stocks.title as "stockTitle"'),
            knex.raw('"inventoryIOTypes".title as "ioTypeDisplay"'),
            'inventoryLines.productId',
            knex.raw('products.title as "productTitle"'),
            knex.raw('products.code as "productCode"'),
            'inventoryLines.quantity',
            'inventoryLines.unitPrice',
            knex.raw('scales.title as "scaleTitle"'),
            'inventories.invoiceId',
            knex.raw('invoices.number as "invoiceNumber"'),
            knex.raw('invoices."invoiceType" as "invoiceType"')
        )
            .from('inventories')
            .leftJoin('inventoryLines', 'inventories.id', 'inventoryLines.inventoryId')
            .leftJoin('inventoryIOTypes', 'inventoryIOTypes.id', 'inventories.ioType')
            .leftJoin('products', 'inventoryLines.productId', 'products.id')
            .leftJoin('stocks', 'inventories.stockId', 'stocks.id')
            .leftJoin('scales', 'products.scaleId', 'scales.id')
            .leftJoin('invoices', 'inventories.invoiceId', 'invoices.id')
            .where('inventories.branchId', this.branchId)
            .where('inventories.id', id);

        let result = toResult(query);

        result.forEach(item => {
            item.inventoryTypeDisplay = item.inventoryType
                ? this.enums.InventoryType().getDisplay(item.inventoryType)
                : null;

            item.invoiceDisplay = item.invoiceId
                ? 'بابت فاکتور {0} شماره {1}'.format(
                    item.invoiceType ? this.enums.InvoiceType().getDisplay(item.invoiceType) : '-',
                    item.invoiceNumber
                )
                : null;
        });

        return result;
    }
}