import { BaseQuery } from "../Infrastructure/BaseQuery";
import toResult from "asyncawait/await";
import { inject } from "inversify";
import { productInventory } from "./product_query_script"

export class ProductQuery extends BaseQuery {

    @inject("Enums") enums = undefined;

    getAll(parameters) {
        let knex = this.knex,
            branchId = this.branchId,
            fiscalPeriodId = this.state.fiscalPeriodId,

            query = this.knex.select()
                .from(function () {
                    this.select('products.*',
                        knex.raw(`(${productInventory(fiscalPeriodId, branchId, 'products.id')}) as "totalQuantity"`),
                        knex.raw('scales.title as "scaleDisplay"'),
                        knex.raw('"productCategories".title as "categoryDisplay"')
                    )
                        .from('products')
                        .leftJoin('scales', 'products.scaleId', 'scales.id')
                        .leftJoin('productCategories', 'productCategories.id', 'products.categoryId')
                        .where('products.branchId', branchId)
                        .as('base');
                });

        return toResult(Utility.kendoQueryResolve(query, parameters, this.view.bind(this)));
    }

    getAllGoods(parameters) {
        let knex = this.knex,
            branchId = this.branchId,
            query = this.knex.select()
                .from(function () {
                    this.select('products.*',
                        knex.raw('scales.title as "scaleDisplay"'),
                        knex.raw('"productCategories".title as "categoryDisplay"')
                    )
                        .from('products')
                        .leftJoin('scales', 'products.scaleId', 'scales.id')
                        .leftJoin('productCategories', 'productCategories.id', 'products.categoryId')
                        .where('products.branchId', branchId)
                        .where('productType', 'good')
                        .as('base');
                });
        return toResult(Utility.kendoQueryResolve(query, parameters, this.view.bind(this)));
    }

    getById(id) {
        const knex = this.knex,
            self = this;

        let result = toResult(knex.select(
            'products.*',
            knex.raw('scales.title as "scaleDisplay"'),
            knex.raw('"productCategories".title as "categoryDisplay"')
        )
            .from('products')
            .leftJoin('scales', 'products.scaleId', 'scales.id')
            .leftJoin('productCategories', 'productCategories.id', 'products.categoryId')
            .where('products.branchId', this.branchId)
            .andWhere('products.id', id)
            .first());


        result.inventory = toResult(
            knex.select('stockId', 'quantity', knex.raw('stocks.title as "stockDisplay"'))
                .from(function () {
                    this.select(
                        'stockId',
                        knex.raw(`SUM(CASE WHEN "inventoryType" = 'input' THEN quantity ELSE quantity * -1 END) as quantity`)
                    )
                        .from('inventories')
                        .leftJoin('inventoryLines', 'inventories.id', 'inventoryLines.inventoryId')
                        .where('inventories.branchId', self.branchId)
                        .where('fiscalPeriodId', self.state.fiscalPeriodId)
                        .where('productId', id)
                        .groupBy('stockId')
                        .as('base')
                })
                .leftJoin('stocks', 'base.stockId', 'stocks.id')
        );

        const stocks = toResult(this.knex
            .select('stockId', 'isDefault', knex.raw('stocks.title as "stockTitle"'))
            .from('products_stocks')
            .leftJoin('stocks', 'stocks.id', 'products_stocks.stockId')
            .where('products_stocks.branchId', this.branchId)
            .where('products_stocks.productId', id));

        result.stocks = stocks.map(s => ( {
            stock: { id: s.stockId, title: s.stockTitle },
            stockId: s.stockId,
            isDefault: s.isDefault
        } ));

        return this.view(result);
    }

    getManyByReferenceId(referenceIds) {
        if (!( referenceIds && referenceIds.length > 0 ))
            return;

        return toResult(
            this.knex.select('id', 'referenceId').from('products')
                .where('branchId', this.branchId)
                .whereIn('referenceId', referenceIds)
        );
    }

    getManyByIds(ids) {
        let products = toResult(this.knex.select('*').from('products').whereIn('id', ids));
        return products.asEnumerable()
            .select(this.view.bind(this))
            .toArray();
    }

    getByBarcode(barcode) {
        const self = this,
            knex = this.knex,
            result = toResult(
                this.knex.select()
                    .from(function () {
                        this.select('products.*',
                            knex.raw(`(select sum(quantity) from products_inventory where "branchId" = '${self.branchId}' and  "fiscalPeriodId" = '${self.fiscalPeriodId}' and "productId" = products.id) as "totalQuantity"`),
                            knex.raw('scales.title as "scaleDisplay"'),
                            knex.raw('"productCategories".title as "categoryDisplay"')
                        )
                            .from('products')
                            .leftJoin('scales', 'products.scaleId', 'scales.id')
                            .leftJoin('productCategories', 'productCategories.id', 'products.categoryId')
                            .where('products.branchId', self.branchId)
                            .where('barcode', barcode)
                            .as('base');
                    })
            );

        return result.map(item => this.view(item));
    }

    view(entity) {

        return {
            id: entity.id,
            title: entity.title,
            productType: entity.productType,
            productTypeDisplay: this.enums.ProductType().getDisplay(entity.productType),
            reorderPoint: entity.reorderPoint,
            salePrice: entity.salePrice,
            categoryId: entity.categoryId,
            categoryDisplay: entity.categoryDisplay,
            scaleId: entity.scaleId,
            scaleDisplay: entity.scaleDisplay,
            referenceId: entity.referenceId,
            sumSalePrice: entity.sumSalePrice,
            sumDiscount: entity.sumDiscount,
            countOnSale: entity.countOnSale,
            sumQuantity: entity.sumQuantity,
            costOfGood: entity.costOfGood,
            barcode: entity.barcode,
            totalQuantity: entity.inventory && Array.isArray(entity.inventory) && entity.inventory.length > 0
                ? entity.inventory.asEnumerable().sum(item => item.quantity)
                : entity.totalQuantity,
            inventory: entity.inventory,
            stocks: entity.stocks
        }
    }

    /* getTotalPriceAndCountByMonth(id, fiscalPeriodId) {
         let branchId = this.branchId,
             userId = this.userId,
             canView = this.canView(),
             modify = this.modify,
             knex = this.knex,

             fiscalPeriodQuery = new FiscalPeriodQuery(this.branchId),
             fiscalPeriod = toResult(fiscalPeriodQuery.getById(fiscalPeriodId)),

             result = toResult(knex.select(
                 'month',
                 knex.raw('sum("quantity") as "sumQuantity"'),
                 knex.raw('sum("price") as "sumPrice"')
             )
                 .from(function () {
                     this.select(
                         knex.raw('cast(substring("invoices"."date" from 6 for 2) as INTEGER) as "month"'),
                         knex.raw('"invoiceLines"."quantity"'),
                         knex.raw('("invoiceLines"."quantity" * "invoiceLines"."unitPrice") - "invoiceLines"."discount" as "price"')
                     )
                         .from('invoices')
                         .leftJoin('invoiceLines', 'invoices.id', 'invoiceLines.invoiceId')
                         .modify(modify, branchId, userId, canView, 'invoices')
                         .andWhere('invoiceLines.productId', id)
                         .andWhere('invoices.invoiceType', 'sale')
                         .andWhereBetween('invoices.date', [fiscalPeriod.minDate, fiscalPeriod.maxDate])
                         .as('base');
                 })
                 .groupBy('month')
                 .orderBy('month'))
                 .map(item => ({
                     month: item.month,
                     monthDisplay: enums.getMonth().getDisplay(item.month),
                     sumQuantity: item.sumQuantity,
                     sumPrice: item.sumPrice
                 }));

         return result;
     }*/
}


