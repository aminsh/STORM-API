import { BaseQuery } from "../Infrastructure/BaseQuery";
import toResult from "asyncawait/await";
import { injectable, inject } from "inversify";

@injectable()
export class InventoryReportQuery extends BaseQuery {
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

    productInventoryTotal(parameters) {
        const kenx = this.knex,
            self = this,
            filter = this.reportConfig.filter,
            productIds = parameters.productIds && Array.isArray(parameters.productIds) && parameters.productIds.length > 0
                ? parameters.productIds
                : null;

        const base = function () {
                let query = this.select(
                    "productId",
                    kenx.raw(`case when "inventoryType" = 'input' and "ioType" = 'inputFirst' then "quantity" else 0 end as "firstQuantity"`),
                    kenx.raw(`case when "inventoryType" = 'input' and "ioType" = 'inputFirst' then "unitPrice" else 0 end as "firstUnitPrice"`),
                    kenx.raw(`case when "inventoryType" = 'input' and "ioType" != 'inputFirst' then "quantity" else 0 end as "purchaseQuantity"`),
                    kenx.raw(`case when "inventoryType" = 'input' and "ioType" != 'inputFirst' then  "unitPrice" else 0 end as "purchaseUnitPrice"`),
                    kenx.raw(`case when "inventoryType" = 'output' then "quantity" else 0 end as "outputQuantity"`),
                    kenx.raw(`case when "inventoryType" = 'output' then  "unitPrice" else 0 end as "outputUnitPrice"`)
                )
                    .from('inventories')
                    .leftJoin('inventoryLines', 'inventoryLines.inventoryId', 'inventories.id')
                    .where('inventories.branchId', self.branchId)
                    .where('fiscalPeriodId', self.state.fiscalPeriodId)
                    .whereIn('productId', productIds);

                if (filter.minDate)
                    query.where('date', '>=', filter.minDate);
                if (filter.maxDate)
                    query.where('date', '<=', filter.maxDate);

                query.as('base');
            },
            group = function () {
                this.select(
                    "productId",
                    kenx.raw(`sum("firstQuantity") as  "firstQuantity" `),
                    kenx.raw(`case when sum("firstQuantity") = 0 then 0 else sum("firstQuantity" * "firstUnitPrice") / sum("firstQuantity") end as "firstUnitPrice"`),
                    kenx.raw(`sum("purchaseQuantity") as  "purchaseQuantity"`),
                    kenx.raw(`case when sum("purchaseQuantity") = 0 then 0 else sum("purchaseQuantity" * "purchaseUnitPrice") / sum("purchaseQuantity") end as "purchaseUnitPrice"`),
                    kenx.raw(`sum("outputQuantity") as  "outputQuantity"`),
                    kenx.raw(`case when sum("outputQuantity") = 0 then 0 else sum("outputQuantity" * "outputUnitPrice") / sum("outputQuantity") end as "outputUnitPrice"`)
                )
                    .from(base)
                    .groupBy('productId')
                    .as('group');
            },
            view = item => ( {
                productId: item.productId,
                productDisplay: item.productDisplay,
                firstQuantity: item.firstQuantity || 0,
                firstUnitPrice: item.firstUnitPrice || 0,
                purchaseQuantity: item.purchaseQuantity || 0,
                purchaseUnitPrice: item.purchaseUnitPrice || 0,
                outputQuantity: item.outputQuantity || 0,
                outputUnitPrice: item.outputUnitPrice || 0
            } );

        let query = kenx.from(function () {
            this.select('group.*', kenx.raw('products.title as "productDisplay"'))
                .from(group)
                .leftJoin('products', 'group.productId', 'products.id')
                .as('base');
        });

        let result = toResult(Utility.kendoQueryResolve(query, parameters, view));

        //let mapped = result.map(view);

        ( ( Array.isArray(result) ? result : result.data ) || [] ).forEach(item => {
            item.duringQuantity = item.firstQuantity + item.purchaseQuantity;
            item.duringUnitPrice = ( ( item.firstQuantity * item.firstUnitPrice ) + ( item.purchaseQuantity * item.purchaseUnitPrice ) ) / ( item.firstQuantity + item.purchaseQuantity );

            item.finalQuantity = item.duringQuantity - item.outputQuantity;
            item.finalUntiPrice = item.duringUnitPrice;
        });

        return result;
    }

    getProductTurnovers(parameters) {
        const knex = this.knex,
            fiscalPeriodId = this.state.fiscalPeriodId,
            branchId = this.branchId,
            productIds = parameters.productIds && Array.isArray(parameters.productIds) && parameters.productIds.length > 0
                ? parameters.productIds
                : null,
            stockIds = parameters.stockIds && Array.isArray(parameters.stockIds) && parameters.stockIds.length > 0
                ? parameters.stockIds
                : null,
            dateRange = parameters.minDate && parameters.maxDate
                ? [ parameters.minDate, parameters.maxDate ]
                : null,
            userId = this.state.user.id,
            canView = this.canView.call(this),
            modify = this.modify.bind(this);

        let baseQuery = knex.with('with_inventories', db => {
            db.select(
                knex.raw(`ROW_NUMBER () OVER (ORDER BY inventories.date , (inventories.time AT time zone 'Iran')::time , CASE WHEN inventories."inventoryType" = 'input' THEN 1 ELSE 2 END , inventories.number) as row`),
                'inventories.id',
                'inventories.inventoryType',
                'inventories.ioType',
                'inventories.number',
                'inventories.stockId',
                'inventories.date',
                'inventoryLines.productId',
                'inventoryLines.quantity',
                'inventoryLines.unitPrice',
                knex.raw(`CASE WHEN "inventoryType" = 'input' THEN
                            quantity
                          ELSE
                            quantity * -1
                          END as "signQuantity"`)
            )
                .from('inventories')
                .leftJoin('inventoryLines', 'inventories.id', 'inventoryLines.inventoryId')
                .modify(modify, branchId, userId, canView, 'inventories')
                .where('inventories.branchId', branchId)
                .where('fiscalPeriodId', fiscalPeriodId);

            if (productIds)
                db.whereIn('productId', productIds);

            if (stockIds)
                db.whereIn('stockId', stockIds);

            if (dateRange)
                db.whereBetween('date', dateRange);

        });

        let query = baseQuery.from(function () {
            this.select(
                'base.*',
                knex.raw('quantity * "unitPrice" as "totalPrice"'),
                knex.raw('"quantityRemainder" * "unitPriceRemainder" as "totalPriceRemainder"'),
                knex.raw('"inventoryIOTypes".title as "ioTypeText"'),
                knex.raw('stocks.title as stock'),
                knex.raw('products.title as product'),
                knex.raw('scales.title as "scaleTitle"'),
            )
                .from(function () {
                    this.select('*',
                        knex.raw('(select sum("signQuantity") from with_inventories where row <= self.row and "productId" = self."productId") as "quantityRemainder"'),
                        knex.raw(`(select sum("quantity" * "unitPrice")/ sum(quantity) from with_inventories where row <= self.row and "productId" = self."productId" and "inventoryType" = 'input') as "unitPriceRemainder"`)
                    )
                        .from('with_inventories as self')
                        .as('base')
                })
                .leftJoin('stocks', 'base.stockId', 'stocks.id')
                .leftJoin('products', 'base.productId', 'products.id')
                .leftJoin('scales', 'products.scaleId', 'scales.id')
                .leftJoin('inventoryIOTypes', 'inventoryIOTypes.id', 'base.ioType')
                .as('base')
        });

        let view = item => ( {
            number: item.number,
            date: item.date,
            inventoryType: item.inventoryType,
            inventoryTypeTitle: item.inventoryType
                ? this.enums.InventoryType().getDisplay(item.inventoryType)
                : null,
            ioType: item.ioType,
            ioTypeText: item.ioTypeText,
            productId: item.productId,
            product: item.product,
            quantity: item.quantity,
            scaleTitle: item.scaleTitle,
            stockId: item.stockId,
            stock: item.stock,
            unitPrice: item.unitPrice,
            totalPrice: item.totalPrice,
            quantityRemainder: item.quantityRemainder,
            unitPriceRemainder: item.unitPriceRemainder,
            totalPriceRemainder: item.totalPriceRemainder
        } );

        return toResult(Utility.kendoQueryResolve(query, parameters, view));

    }


    getTinyTurnoverByProduct(parameters) {

        const knex = this.knex,
            tableName = 'inventories',
            tableLineName = 'inventoryLines',
            branchId = this.branchId,
            productId = parameters.productId,
            fiscalPeriodId = this.state.fiscalPeriodId;

        const with_inventories = knex.with('with_inventories', db => {
            db.select(
                knex.raw(`ROW_NUMBER () OVER (ORDER BY inventories.date , (inventories.time AT time zone 'Iran')::time , CASE WHEN inventories."inventoryType" = 'input' THEN 1 ELSE 2 END , inventories.number) as row`),
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
                .from(tableName)
                .leftJoin(tableLineName, `${tableLineName}.inventoryId`, `${tableName}.id`)
                .leftJoin('stocks', 'stocks.id', `${tableName}.stockId`)
                .leftJoin('inventoryIOTypes', 'inventoryIOTypes.id', `${tableName}.ioType`)
                .where('productId', productId)
                .where('fiscalPeriodId', fiscalPeriodId)
                .where(`${tableName}.branchId`, branchId)
        });

        const query = with_inventories.from(function () {
                this.select(
                    '*',
                    knex.raw('(select sum("signQuantity") from with_inventories where row <= self.row) as "quantityRemainder"'),
                    knex.raw(`(select sum("quantity" * "unitPrice")/ sum(quantity) from with_inventories where row <= self.row and "inventoryType" = 'input') as "unitPriceRemainder"`)
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
                quantityRemainder: item.quantityRemainder,
                unitPriceRemainder: item.unitPriceRemainder
            });

        return toResult(Utility.kendoQueryResolve(query, parameters, view));
    }
}
