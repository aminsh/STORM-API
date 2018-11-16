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

    getAll(parameters) {
        const branchId = this.branchId,
            userId = this.userId,
            canView = this.canView.call(this),
            modify = this.modify.bind(this),
            addFilter = this.addFilter,
            fiscalPeriodId = this.state.fiscalPeriodId,
            knex = this.knex,

            query = knex.from(function () {
                let query = this.select(
                    'inventories.*',
                    knex.raw('stocks.title as "stockDisplay"'),
                    knex.raw('"inventoryIOTypes".title as "ioTypeDisplay"'),
                    knex.raw('invoices.number as invoice_number'),
                    knex.raw('invoices.date as invoice_date'),
                    knex.raw('invoices."invoiceType" as invoice_type'),
                )
                    .from('inventories')
                    .leftJoin('inventoryIOTypes', 'inventoryIOTypes.id', 'inventories.ioType')
                    .leftJoin('stocks', 'stocks.id', 'inventories.stockId')
                    .leftJoin('invoices', 'invoices.id', 'inventories.invoiceId')
                    .modify(modify, branchId, userId, canView, 'inventories')
                    .where('fiscalPeriodId', fiscalPeriodId)
                    .whereNotNull('priceStatus')
                    .as('base');

                if (parameters.extra)
                    addFilter(query, parameters.extra);
            });

        return toResult(Utility.kendoQueryResolve(query, parameters, this._view.bind(this)));
    }

    getById(id) {
        let knex = this.knex,
            branchId = this.branchId,
            userId = this.userId,
            canView = this.canView.call(this),
            modify = this.modify.bind(this),

            inventory = toResult(knex
                .select(
                    'inventories.*',
                    knex.raw('stocks.title as "stockDisplay"'),
                    knex.raw('"inventoryIOTypes".title as "ioTypeDisplay"')
                )
                .from('inventories')
                .leftJoin('stocks', 'inventories.stockId', 'stocks.id')
                .leftJoin('inventoryIOTypes', 'inventoryIOTypes.id', 'inventories.ioType')
                .modify(modify, branchId, userId, canView, 'inventories')
                .where('inventories.id', id)
                .whereNotNull('priceStatus')
                .first()),
            inventoryLines = inventory
                ? toResult(
                    knex.select('inventoryLines.*', knex.raw('products.title as "productDisplay"'))
                        .from('inventoryLines')
                        .leftJoin('products', 'inventoryLines.productId', 'products.id')
                        .modify(modify, branchId, userId, canView, 'inventoryLines')
                        .where('inventoryId', inventory.id))
                : [];

        if (!inventory)
            throw new NotFoundException();

        inventory = inventory ? this._view.call(this, inventory) : [];
        inventory.inventoryLines = inventoryLines.asEnumerable().select(this._viewLine).toArray();

        return inventory;
    }

    getDetailById(id, parameters) {
        let knex = this.knex,
            branchId = this.branchId,
            userId = this.userId,
            canView = this.canView.call(this),
            modify = this.modify.bind(this),

            inventory = toResult(knex.select('priceStatus')
                .from(this.tableName)
                .where({inventoryId: id, branchId})
                .whereNotNull('priceStatus')
                .first());

        if (!inventory)
            throw new NotFoundException();

        let query = knex.from(function () {
                this.select('inventoryLines.*', knex.raw('products.title as "productDisplay"'))
                    .from('inventoryLines')
                    .leftJoin('products', 'inventoryLines.productId', 'products.id')
                    .modify(modify, branchId, userId, canView, 'inventoryLines')
                    .where('inventoryId', id)
                    .as('base');
            }),

            result = toResult(Utility.kendoQueryResolve(query, parameters, this._viewLine)),

            sumTotalPrice = toResult(knex
                .select(knex.raw('SUM(CAST("unitPrice" * quantity as FLOAT)) as "sumTotalPrice"'))
                .from('inventoryLines')
                .modify(modify, branchId, userId, canView, 'inventoryLines')
                .where('inventoryId', id)
                .first())
                .sumTotalPrice,
            aggregates = {sumTotalPrice};

        result.aggregates = aggregates;

        return result;

    }


    getTinyTurnoverByProduct(productId, parameters) {

        const knex = this.knex,
            tableName = this.tableName,
            tableLineName = this.tableLineName,
            branchId = this.state.branchId,
            fiscalPeriodId = this.state.fiscalPeriodId;

        const with_inventories = knex.with('with_inventories', db => {
            db.select(
                knex.raw('ROW_NUMBER () OVER ( ORDER BY inventories."createdAt" ) AS row'),
                "number",
                "date",
                "inventoryType",
                "ioType",
                knex.raw('"inventoryIOTypes".title AS "ioTypeDisplay"'),
                "stockId",
                knex.raw('stocks.title AS "stockDisplay"'),
                "quantity",
                knex.raw(`CASE WHEN "inventoryType" = 'input' THEN
                            quantity
                          ELSE
                            quantity * -1
                          END as "signQuantity"`),
                "unitPrice"
            )
                .from(this.tableName)
                .leftJoin(this.tableLineName, `${this.tableLineName}.inventoryId`, `${this.tableName}.id`)
                .leftJoin('stocks', 'stocks.id', `${this.tableName}.stockId`)
                .leftJoin('inventoryIOTypes', 'inventoryIOTypes.id', `${this.tableName}.ioType`)
                .where('productId', productId)
                .where('fiscalPeriodId', fiscalPeriodId)
                .where(`${this.tableName}.branchId`, branchId)
                .whereNotNull('priceStatus')
        });

        const query = with_inventories.from(function () {
                this.select(
                    '*',
                    knex.raw('(select sum("signQuantity") from with_inventories where row <= self.row) as quantity_remainder'),
                    knex.raw(`(select sum("quantity" * "unitPrice")/ sum(quantity) from with_inventories where row <= self.row and "inventoryType" = 'input') as price_remainder`)
                )
                    .from(knex.raw('with_inventories as self'))
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
                    quantity: item.quantity_remainder,
                    unitPrice: item.price_remainder || 0
                }
            });

        return toResult(Utility.kendoQueryResolve(query, parameters, view));
    }

    _view(item) {
        const enums = this.enums;

        return {
            createdAt: item.createdAt,
            id: item.id,
            number: item.number,
            date: item.date,
            display: item.display,
            description: item.description,
            inventoryType: item.inventoryType,
            inventoryTypeDisplay: item.inventoryType ? enums.InventoryType().getDisplay(item.inventoryType) : null,
            ioType: item.ioType,
            ioTypeDisplay: item.ioTypeDisplay,
            stockId: item.stockId,
            stockDisplay: item.stockDisplay,
            journalId: item.journalId,
            inputId: item.inputId,
            outputId: item.outputId,
            invoiceId: item.invoiceId,
            invoice: item.invoiceId
                ? {number: item["invoice_number"], date: item["invoice_date"], type: item["invoice_type"]}
                : undefined
        };
    }

    _viewLine(item) {
        return {
            id: item.id,
            productId: item.productId,
            productDisplay: item.productDisplay,
            quantity: item.quantity,
            unitPrice: item.unitPrice
        };
    }
}