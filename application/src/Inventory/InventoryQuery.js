import toResult from "asyncawait/await";
import {injectable, inject} from "inversify";
import {BaseQuery} from "../core/BaseQuery";

@injectable()
export class InventoryQuery extends BaseQuery {

    @inject("State")
    /** @type{IState}*/ state = undefined;

    @inject("Enums") enums = undefined;

    getAllInventoryProducts(parameters) {
        let stockId = parameters.extra && parameters.extra.filter
            ? parameters.extra.filter.stockId
            : null,
            knex = this.knex,
            branchId = this.branchId,


            subquery = knex.select('productId')
                .from('inventoryLines')
                .innerJoin('inventories', 'inventories.id', 'inventoryLines.inventoryId')
                .where('inventoryLines.branchId', branchId);

        if (stockId)
            subquery.andWhere('inventories.stockId', stockId);

        let query = knex.select()
            .from(function () {
                this.select('products.*', knex.raw('scales.title as "scaleDisplay"'))
                    .from('products')
                    .leftJoin('scales', 'products.scaleId', 'scales.id')
                    .where('products.branchId', branchId)
                    .whereIn('products.id', subquery)
                    .as('base');
            });

        return toResult(Utility.kendoQueryResolve(query, parameters, this._productView.bind(this)));
    }

    getAll(inventoryType, parameters) {
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
                    knex.raw('"inventoryIOTypes".title as "ioTypeDisplay"')
                )
                    .from('inventories')
                    .leftJoin('inventoryIOTypes', 'inventoryIOTypes.id', 'inventories.ioType')
                    .leftJoin('stocks', 'stocks.id', 'inventories.stockId')
                    .modify(modify, branchId, userId, canView, 'inventories')
                    .where('inventoryType', inventoryType)
                    .where('fiscalPeriodId', fiscalPeriodId)
                    .as('base');

                if (parameters.extra)
                    addFilter(query, parameters.extra);
            });

        return toResult(Utility.kendoQueryResolve(query, parameters, this._view.bind(this)));
    }

    getAllByIds(ids) {
        let knex = this.knex,
            result = toResult(knex.select(
                'inventories.*',
                knex.raw('stocks.title as "stockDisplay"'),
                knex.raw('"inventoryIOTypes".title as "ioTypeDisplay"')
            )
                .from('inventories')
                .leftJoin('inventoryIOTypes', 'inventoryIOTypes.id', 'inventories.ioType')
                .leftJoin('stocks', 'stocks.id', 'inventories.stockId')
                .where('inventories.branchId', this.branchId)
                .whereIn('inventories.id', ids));

        return result.map(this._view.bind(this));
    }

    getAllWithoutInvoice(inventoryType, parameters) {
        const branchId = this.branchId,
            userId = this.userId,
            canView = this.canView.call(this),
            modify = this.modify.bind(this),
            knex = this.knex,

            query = knex.from(function () {
                this.select(
                    'inventories.*',
                    knex.raw(`inventories.number || ' - ' || inventories.date || ' - ' || stocks.title as display`),
                    knex.raw('stocks.title as "stockDisplay"'),
                    knex.raw('"inventoryIOTypes".title as "ioTypeDisplay"')
                )
                    .from('inventories')
                    .leftJoin('stocks', 'stocks.id', 'inventories.stockId')
                    .leftJoin('inventoryIOTypes', 'inventoryIOTypes.id', 'inventories.ioType')
                    .modify(modify, branchId, userId, canView, 'inventories')
                    .where('inventoryType', inventoryType)
                    .whereNull('invoiceId')
                    .whereNull('journalId')
                    .as('base');
            });

        return toResult(Utility.kendoQueryResolve(query, parameters, this._view.bind(this)));
    }

    getAllInputsWithIoType(ioType, parameters) {
        const branchId = this.branchId,
            userId = this.userId,
            canView = this.canView.call(this),
            modify = this.modify.bind(this),
            knex = this.knex,

            query = knex.from(function () {
                this.select(
                    'inventories.*',
                    knex.raw(`inventories.number || ' - ' || inventories.date || ' - ' || stocks.title as display`),
                    knex.raw('stocks.title as "stockDisplay"')
                )
                    .from('inventories')
                    .leftJoin('stocks', 'stocks.id', 'inventories.stockId')
                    .leftJoin('inventoryIOTypes', 'inventoryIOTypes.id', 'inventories.ioType')
                    .modify(modify, branchId, userId, canView, 'inventories')
                    .where('inventoryIOTypes.id', ioType)
                    .whereNull('invoiceId')
                    .whereNull('journalId')
                    .as('base');
            });

        return toResult(Utility.kendoQueryResolve(query, parameters, this._view.bind(this)));
    }

    addFilter(query, filter) {
        if (filter.stockId)
            query.where('stockId', filter.stockId);
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
                .first()),
            inventoryLines = inventory
                ? toResult(
                    knex.select('inventoryLines.*', knex.raw('products.title as "productDisplay"'))
                        .from('inventoryLines')
                        .leftJoin('products', 'inventoryLines.productId', 'products.id')
                        .modify(modify, branchId, userId, canView, 'inventoryLines')
                        .where('inventoryId', inventory.id))
                : [];

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

            query = knex.from(function () {
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

    getInventoriesByStock(productId) {
        const knex = this.knex,
            branchId = this.branchId,
            userId = this.userId,
            canView = this.canView.call(this),
            modify = this.modify.bind(this),
            fiscalPeriodId = this.state.fiscalPeriodId;

        return toResult(
            knex.select(
                'stockId',
                'stockDisplay',
                knex.raw('sum(quantity) as "sumQuantity"'))
                .from(function () {
                    this.select(knex.raw('case when "inventories"."inventoryType" = \'input\' then "quantity" else "quantity" * -1 end as "quantity"'),
                        'stockId',
                        knex.raw('stocks.title as "stockDisplay"')
                    )
                        .from('inventories')
                        .leftJoin('inventoryLines', 'inventoryLines.inventoryId', 'inventories.id')
                        .leftJoin('stocks', 'stocks.id', 'inventories.stockId')
                        .modify(modify, branchId, userId, canView, 'inventoryLines')
                        .where('fiscalPeriodId', fiscalPeriodId)
                        .where('productId', productId)
                        .as('base');
                })
                .groupBy('stockId', 'stockDisplay')
        );
    }

    getMaxNumber(inventoryType) {

        const maxNumber = toResult(this.knex.table('inventories')
            .where('branchId', this.branchId)
            .where('inventoryType', inventoryType)
            .andWhere('fiscalPeriodId', this.state.fiscalPeriodId)
            .max('number')
            .first());

        if (maxNumber)
            return maxNumber.max;

        return 1;
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
            fixedQuantity: item.fixedQuantity,
            fixedAmount: item.fixedAmount
        };
    }

    _productView(entity) {
        const enums = this.enums;

        return {
            id: entity.id,
            title: entity.title,
            productType: entity.productType,
            productTypeDisplay: enums.ProductType().getDisplay(entity.productType),
            reorderPoint: entity.reorderPoint,
            salePrice: entity.salePrice,
            categoryId: entity.categoryId,
            scaleId: entity.scaleId,
            scaleDisplay: entity.scaleDisplay,
            referenceId: entity.referenceId,
            sumSalePrice: entity.sumSalePrice,
            sumDiscount: entity.sumDiscount,
            countOnSale: entity.countOnSale,
            sumQuantity: entity.sumQuantity,
            costOfGood: entity.costOfGood,
            barcode: entity.barcode
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