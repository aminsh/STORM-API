import {BaseQuery} from "../Infrastructure/BaseQuery";
import toResult from "asyncawait/await";
import {inject} from "inversify";

export class ProductQuery extends BaseQuery {

    @inject("Enums") enums = undefined;

    getAll(parameters) {
        let knex = this.knex,
            branchId = this.branchId,
            fiscalPeriodId = this.state.fiscalPeriodId,

            query = this.knex.select()
                .from(function () {
                    this.select('products.*',
                        knex.raw(`(select sum(quantity) from products_inventory where "branchId" = '${branchId}' and  "fiscalPeriodId" = '${fiscalPeriodId}' and "productId" = products.id) as "totalQuantity"`),
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
        const knex = this.knex;

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
            this.knex.select('quantity', 'stockId', knex.raw('stocks.title as "stockDisplay"'))
                .from('products_inventory')
                .leftJoin('stocks', 'products_inventory.stockId', 'stocks.id')
                .where('products_inventory.branchId', this.branchId)
                .where('products_inventory.fiscalPeriodId', this.state.fiscalPeriodId)
                .where('products_inventory.productId', result.id)
        );

        return this.view(result);
    }

    getManyByIds(ids) {
        let products = toResult(this.knex.select('*').from('products').whereIn('id', ids));
        return products.asEnumerable()
            .select(this.view.bind(this))
            .toArray();
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
            inventory: entity.inventory
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


