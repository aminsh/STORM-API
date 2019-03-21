import { BaseQuery } from "../Infrastructure/BaseQuery";
import toResult from "asyncawait/await";
import { injectable, inject } from "inversify";

@injectable()
export class ReportProductQuery extends BaseQuery {

    @inject("ReportConfig")
    /**@type{ReportConfig}*/ reportConfig = undefined;

    @inject("Enums") enums = undefined;

    getProductsInventoriesByIds(productIds, fixedType, stockId) {
        let knex = this.knex,
            branchId = this.branchId,
            userId = this.state.user.id,
            canView = this.canView.call(this),
            modify = this.modify.bind(this),
            options = this.reportConfig.options,

            query = this.knex.select(
                knex.raw(`products.title as product,
            inventories."createdAt",
            products.id as "productId",
            inventories."inventoryType",
            products."referenceId" as "productReferenceId",
            "inventoryLines".quantity, "inventoryLines"."unitPrice",
            "inventoryLines".quantity * "inventoryLines"."unitPrice" as "totalPrice",
            inventories.date, inventories.number, 
            stocks.title as stock, stocks.id as "stockId",
            scales.title as "scaleTitle",
            CASE WHEN inventories."inventoryType" = 'input' THEN '${'رسید'}'
             ELSE '${'حواله'}' END as "inventoryTypeTitle",
            inventories."ioType" as ioType`),
                knex.raw('"inventoryIOTypes".title as "ioTypeText"')
            )
                .from('products')
                .innerJoin('inventoryLines', 'inventoryLines.productId', 'products.id')
                .innerJoin('inventories', 'inventories.id', 'inventoryLines.inventoryId')
                .innerJoin('inventoryIOTypes', 'inventoryIOTypes.id', 'inventories.ioType')
                .leftJoin('scales', 'scales.id', 'products.scaleId')
                .innerJoin('stocks', 'stocks.id', 'inventories.stockId')
                .modify(modify, branchId, userId, canView, 'inventories')
                .whereBetween('inventories.date', [ options.fromMainDate, options.toDate ])
                .orderBy('inventories.createdAt');


        /*if (fixedType === 'fixedQuantity')
            query.where('fixedQuantity', true);

        if (fixedType === 'fixedAmount')
            query.where('fixedAmount', true);

        if (fixedType === 'fixedAmountAndQuantity')
            query
                .where('fixedQuantity', true)
                .where('fixedAmount', true);*/

        if (productIds)
            query.whereIn('products.id', productIds);

        if (stockId && !stockId.includes('all')) {
            query.whereIn('stocks.id', stockId);
        }


        return toResult(query);
    };

    getProductRemainders(inventories) {
        let haveZeroUnitPrice = inventories.asEnumerable().firstOrDefault(item => item.unitPrice === 0) ? 0 : 1;

        if (inventories.length === 1) {
            return inventories.asEnumerable().select(item =>
                Object.assign({}, item,
                    {
                        quantityRemainder: item.quantity,
                        haveZeroUnitPrice: haveZeroUnitPrice,
                        unitPriceRemainder: item.unitPrice,
                        totalPriceRemainder: item.totalPrice,
                        lastTotalPriceRemainder: item.totalPrice,
                        lastQuantityRemainder: item.quantity
                    })
            );

        }
        else {
            let options = this.reportConfig.options,
                query = inventories
                    .map(item => {
                        item.turnoverQuantity = item.quantity * ( item.inventoryType === 'input' ? 1 : -1 );
                        return item;
                    })
                    .reduce((memory, current) => {
                        if (Array.isArray(memory)) {
                            let last = memory[ memory.length - 1 ];
                            current.quantityRemainder = current.turnoverQuantity + last.quantityRemainder;
                            current.haveZeroUnitPrice = haveZeroUnitPrice;

                            if (current.inventoryType === 'input'
                                && ( current.unitPrice === 0 || last.unitPriceRemainder === 0 )
                                && current.productId === last.productId) {
                                current.unitPriceRemainder = 0;
                                current.totalPriceRemainder = 0;
                            }
                            else {
                                current.unitPriceRemainder = current.inventoryType === 'output'
                                    ? last.unitPriceRemainder
                                    : ( last.totalPriceRemainder + current.totalPrice ) / current.quantityRemainder;

                                current.totalPriceRemainder = current.unitPriceRemainder * current.quantityRemainder;
                            }
                            memory.push(current);
                            return memory;
                        }
                        else {
                            memory.quantityRemainder = memory.turnoverQuantity;
                            current.quantityRemainder = memory.quantityRemainder + current.turnoverQuantity;
                            memory.haveZeroUnitPrice = haveZeroUnitPrice;
                            current.haveZeroUnitPrice = haveZeroUnitPrice;

                            memory.unitPriceRemainder = memory.inventoryType === 'output'
                                ? memory.unitPriceRemainder
                                : ( memory.quantity * memory.unitPrice ) / memory.quantity;
                            memory.totalPriceRemainder = memory.unitPriceRemainder * memory.quantityRemainder;

                            if (current.inventoryType === 'input'
                                && ( current.unitPrice === 0 || memory.unitPrice === 0 )
                                && current.productId === memory.productId) {
                                current.unitPriceRemainder = 0;
                                current.totalPriceRemainder = 0;
                            }
                            else {
                                current.unitPriceRemainder = current.inventoryType === 'output'
                                    ? memory.unitPriceRemainder
                                    : ( memory.totalPriceRemainder + current.totalPrice ) / current.quantityRemainder;

                                current.totalPriceRemainder = current.quantityRemainder * current.unitPriceRemainder;
                            }

                            return [ memory, current ];
                        }
                    });

            return query.asEnumerable()
                .select(item => Object.assign(
                    {},
                    item,
                    {
                        lastTotalPriceRemainder: query.asEnumerable()
                            .where(q => q.date >= options.fromMainDate && q.date <= options.toDate)
                            .lastOrDefault().totalPriceRemainder
                        ,

                        lastQuantityRemainder: query.asEnumerable()
                            .where(q => q.date >= options.fromMainDate && q.date <= options.toDate)
                            .lastOrDefault().quantityRemainder
                    }
                ))
        }

    }

    productInventoryTotal(productIds, parameters) {
        const kenx = this.knex,
            self = this,
            filter = this.reportConfig.filter;

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

        /*let productsInventories = this.getProductsInventoriesByIds(productIds, fixedType, stockId),
            options = this.reportConfig.options,

            query = productsInventories.asEnumerable()
                .groupBy(
                    item => item.productId,
                    item => item,
                    (key, value) => ( {
                        productId: key,
                        items: this.getProductRemainders(value.toArray())
                            .asEnumerable()
                            .select(item => Object.assign(
                                {},
                                item,
                                { remainderToString: item.unitPriceRemainder ? item.unitPriceRemainder.toString() : item.unitPriceRemainder }
                                )
                            )
                    } ))
                .selectMany(item => item.items)
                .where(item => item.date >= options.fromMainDate && item.date <= options.toDate)
                .toArray();

        return query;*/
    }
}