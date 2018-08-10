import {BaseQuery} from "../core/BaseQuery";
import toResult from "asyncawait/await";
import {injectable, inject} from "inversify"

@injectable()
export class SaleQuery extends BaseQuery {

    @inject("Enums") enums = undefined;

    @inject("SettingsQuery")
    /** @type {SettingsQuery}*/ settingsQuery = undefined;

    /*@inject("TreasuryPurposeQuery")
    /!** @type{TreasuryPurposeQuery}*!/ treasuryPurposeQuery = undefined;*/

    @inject("FiscalPeriodQuery")
    /** @type{FiscalPeriodQuery}*/ fiscalPeriodQuery = undefined;

    getById(id) {
        let knex = this.knex,
            branchId = this.branchId,
            userId = this.userId,
            canView = this.canView(),
            modify = this.modify.bind(this),
            settings = this.settingsQuery.get(),
            treasuriesTotalAmount = 0,//treasuryPurposeQuery.getTreasuriesTotalAmount(id),

            invoice = toResult(knex
                .select(
                    'invoices.*',
                    knex.raw('"detailAccounts"."title" as "detailAccountDisplay"')
                )
                .from('invoices')
                .leftJoin('detailAccounts', 'invoices.detailAccountId', 'detailAccounts.id')
                .where('invoices.id', id)
                .modify(modify, branchId, userId, canView, 'invoices')
                .first()
            ),

            invoiceLines = toResult(knex
                .select('invoiceLines.*',
                    knex.raw('CAST("invoiceLines"."unitPrice" AS FLOAT)'),
                    knex.raw('scales.title as scale'),
                    knex.raw('stocks.title as "stockDisplay"'))
                .from('invoiceLines')
                .leftJoin('products', 'invoiceLines.productId', 'products.id')
                .leftJoin('scales', 'products.scaleId', 'scales.id')
                .leftJoin('stocks', 'invoiceLines.stockId', 'stocks.id')
                .modify(modify, branchId, userId, canView, 'invoiceLines')
                .where('invoiceId', id)
            ),
            sumCharges = invoice
                ? (invoice.charges || []).asEnumerable().sum(c => c.value)
                : 0,
            sumChargesVatIncluded = invoice
                ? (invoice.charges || []).asEnumerable().where(e => e.vatIncluded).sum(e => e.value)
                : 0,
            invoiceDiscount = invoice ? invoice.discount || 0 : 0;

        let lineHaveVat = invoiceLines.asEnumerable().firstOrDefault(e => e.vat !== 0),
            persistedVat = lineHaveVat
                ? (100 * lineHaveVat.vat / (((lineHaveVat.quantity * lineHaveVat.unitPrice) - lineHaveVat.discount)))
                : 0;

        if (invoice) {
            invoice.sumTotalPrice = invoiceLines.asEnumerable()
                    .sum(line => line.quantity * line.unitPrice - line.discount + line.vat)
                - invoiceDiscount +
                sumCharges + (sumChargesVatIncluded * persistedVat / 100);

            invoice.sumRemainder = invoice.sumTotalPrice - treasuriesTotalAmount;

            invoice.totalVat = invoiceLines.asEnumerable()
                .sum(line => line.vat) + (sumChargesVatIncluded * persistedVat / 100);

            invoice.chargesVat = sumChargesVatIncluded * persistedVat / 100;

            invoice.invoiceLines = invoiceLines.asEnumerable().select(this._lineView).toArray();
            invoice.branchId = branchId;
        }
        return invoice ? this._view(invoice, settings) : [];
    }

    getAll(parameters) {
        let knex = this.knex,
            branchId = this.branchId,
            userId = this.userId,
            canView = this.canView(),
            modify = this.modify.bind(this),
            baseQuery = `select coalesce(sum(value),0) from invoices as i left join json_to_recordset(i.charges) as x(key text, value int, "vatIncluded" boolean) on true where i.id = "base".id`,
            sumChargesQuery = `(${baseQuery}) + ((${baseQuery} and "vatIncluded" = true) *  
            coalesce((select (100 * line.vat) / ((line.quantity * line."unitPrice") - line.discount) from "invoiceLines" as line where "invoiceId" = "base".id and vat <> 0 limit 1), 0) /100)`,

            query = knex.select().table(function () {
                this.select(
                    'id',
                    'number',
                    'date',
                    'detailAccountId',
                    'detailAccountDisplay',
                    'invoiceStatus',
                    'description',
                    'title',
                    'journalId',
                    knex.raw(`sum(discount) as discount`),
                    knex.raw(`"sum"("totalPrice") + ${sumChargesQuery} - sum(DISTINCT coalesce(discount,0)) as "sumTotalPrice" `),
                    knex.raw(`("sum"("totalPrice") + ${sumChargesQuery}) - sum(DISTINCT coalesce(discount,0)) -
                                (select coalesce(sum(treasury.amount),0) as "treasuryAmount"
                                from treasury
                                inner join "treasuryPurpose" as tp on treasury.id = tp."treasuryId"
                                where "base"."id" = tp."referenceId") as "sumRemainder"`))
                    .from(function () {
                        this.select('invoices.*',
                            knex.raw('"detailAccounts"."title" as "detailAccountDisplay"'),
                            knex.raw(`("invoiceLines"."unitPrice" * "invoiceLines".quantity - "invoiceLines".discount + "invoiceLines".vat) as "totalPrice"`))
                            .from('invoices')
                            .leftJoin('invoiceLines', 'invoices.id', 'invoiceLines.invoiceId')
                            .leftJoin('detailAccounts', 'invoices.detailAccountId', 'detailAccounts.id')
                            .modify(modify, branchId, userId, canView, 'invoices')
                            .andWhere('invoiceType', 'sale')
                            .as('base');
                    }).as("group")
                    .groupBy(
                        'id',
                        'number',
                        'date',
                        'detailAccountId',
                        'detailAccountDisplay',
                        'invoiceStatus',
                        'description',
                        'title',
                        'journalId')
                    .orderBy('number', 'desc')

            });
        return toResult(Utility.kendoQueryResolve(query, parameters, this._view.bind(this)));
    }

    getAllLines(invoiceId, parameters) {
        let knex = this.knex,
            branchId = this.branchId,
            userId = this.userId,
            canView = this.canView(),
            modify = this.modify,

            query = knex.select().from(function () {
                this.select('*')
                    .from('invoiceLines')
                    .modify(modify, branchId, userId, canView)
                    .andWhere('invoiceId', invoiceId)
                    .as('invoiceLines')
            });

        return toResult(kendoQueryResolve(query, parameters, this._lineView.bind(this)));
    }

    getSummary(fiscalPeriodId, invoiceType) {
        let knex = this.knex,
            branchId = this.branchId,
            userId = this.userId,
            canView = this.canView(),
            modify = this.modify,
            fiscalPeriod = toResult(this.fiscalPeriodQuery.getById(fiscalPeriodId)),

            query = knex.select(
                knex.raw('"count"(*) as "total"'),
                knex.raw(`"sum"("totalPrice") - sum(DISTINCT coalesce(discount,0)) as "sumTotalPrice"`),
                knex.raw('"sum"("paidAmount") as "sumPaidAmount"'),
                knex.raw(`"sum"("totalPrice"-"paidAmount")  - sum(DISTINCT coalesce(discount,0)) as "sumRemainder"`)
            ).from(function () {
                this.select('invoices.*',
                    knex.raw(`(select coalesce(sum(treasury.amount),0) as "treasuryAmount"
                        from treasury
                        inner join "treasuryPurpose" on treasury.id = "treasuryPurpose"."treasuryId"
                        where "invoices"."id" = "treasuryPurpose"."referenceId") as "paidAmount"`),

                    knex.raw('"detailAccounts"."title" as "detailAccountDisplay"'),
                    knex.raw(`("invoiceLines"."unitPrice" * "invoiceLines".quantity - "invoiceLines".discount + "invoiceLines".vat) as "totalPrice"`))
                    .from('invoices')
                    .leftJoin('invoiceLines', 'invoices.id', 'invoiceLines.invoiceId')
                    .leftJoin('detailAccounts', 'invoices.detailAccountId', 'detailAccounts.id')
                    .modify(modify, branchId, userId, canView, 'invoices')
                    .andWhere('invoiceType', invoiceType)
                    .whereBetween('date', [fiscalPeriod.minDate, fiscalPeriod.maxDate])
                    .as('base');
            }).first();

        return toResult(query);
    }

    getTotalByMonth(fiscalPeriodId, invoiceType) {
        let branchId = this.branchId,
            userId = this.userId,
            canView = this.canView(),
            modify = this.modify,
            knex = this.knex,
            fiscalPeriod = toResult(this.fiscalPeriodQuery.getById(fiscalPeriodId)),

            query = knex.select(
                'month',
                knex.raw('"count"(*) as "total"'),
                knex.raw('"sum"("totalPrice") - sum(DISTINCT coalesce(discount,0)) as "sumTotalPrice"'))
                .from(function () {
                    this.select('invoices.*',
                        knex.raw('cast(substring("invoices"."date" from 6 for 2) as INTEGER) as "month"'),
                        knex.raw(`("invoiceLines"."unitPrice" * "invoiceLines".quantity - "invoiceLines".discount + "invoiceLines".vat) as "totalPrice"`))
                        .from('invoices')
                        .leftJoin('invoiceLines', 'invoices.id', 'invoiceLines.invoiceId')
                        .modify(modify, branchId, userId, canView, 'invoices')
                        .andWhere('invoiceType', invoiceType)
                        .whereBetween('date', [fiscalPeriod.minDate, fiscalPeriod.maxDate])
                        .as('base');
                })
                .groupBy('month')
                .orderBy('month')
                .map(item => ({
                    total: item.total,
                    totalPrice: item.sumTotalPrice,
                    month: item.month,
                    monthName: this.enums.getMonth().getDisplay(item.month),
                }));


        return toResult(query);
    }

    getTotalByProduct(fiscalPeriodId, invoiceType) {
        let branchId = this.branchId,
            userId = this.userId,
            canView = this.canView(),
            modify = this.modify,
            knex = this.knex,
            fiscalPeriod = toResult(this.fiscalPeriodQuery.getById(fiscalPeriodId)),

            query = knex.select(
                'productId', 'productTitle', knex.raw('"sum"("quantity") as "total"'))
                .from(function () {
                    this.select(
                        'invoiceLines.productId',
                        'invoiceLines.quantity',
                        knex.raw('"products"."title" as "productTitle"'))
                        .from('invoices')
                        .leftJoin('invoiceLines', 'invoices.id', 'invoiceLines.invoiceId')
                        .leftJoin('products', 'invoiceLines.productId', 'products.id')
                        .modify(modify, branchId, userId, canView, 'invoices')
                        .andWhere('invoiceType', invoiceType)
                        .whereBetween('date', [fiscalPeriod.minDate, fiscalPeriod.maxDate])
                        .as('base');
                })
                .groupBy('productId', 'productTitle')
                .orderByRaw('"count"(*) desc')
                .limit(5)
                .map(item => ({
                    productId: item.productId,
                    productTitle: item.productTitle,
                    total: item.total
                }));

        return toResult(query);
    }

    maxNumber() {
        return toResult(
            this.knex.table('invoices')
                .where('branchId', this.branchId)
                .where('invoiceType', 'sale')
                .max('number')
                .first()
        );
    }

    check(invoiceId) {
        return !!(toResult(this.knex('invoices').where("id", invoiceId).first()))
    }

    getCompareInvoiceOnChange(id, lines) {
        let branchId = this.branchId,
            userId = this.userId,
            canView = this.canView(),
            modify = this.modify.bind(this),
            settings = this.settingsQuery.get(),
            goodLines = lines.asEnumerable().where(e =>
                e.productId &&
                toResult(this.knex.select('productType').from('products').where('id', e.productId).first()).productType === 'good'
            ).toArray();

        if (goodLines.length === 0)
            return;

        if (settings.productOutputCreationMethod === 'defaultStock')
            goodLines.forEach(e => e.stockId = settings.stockId);
        else {
            if (goodLines.asEnumerable().any(e => !e.stockId))
                throw new ValidationException(['StockId is empty']);
        }

        let inventoryLines = toResult(this.knex
                .select('productId', 'quantity', 'stockId', 'inventoryType')
                .from('inventories')
                .innerJoin('inventoryLines', 'inventories.id', 'inventoryLines.inventoryId')
                .modify(modify, branchId, userId, canView, 'inventories')
                .where('invoiceId', id)
            )
                .asEnumerable()
                .groupBy(
                    item => item.productId,
                    item => item,
                    (productId, items) => ({
                        productId,
                        quantity: items.sum(e => e.inventoryType === 'output' ? e.quantity : e.quantity * -1),
                        stockId: items.first().stockId
                    }))
                .toArray(),

            invoiceLines = goodLines,

            newLines = invoiceLines.asEnumerable().where(e => !inventoryLines.asEnumerable().any(p => p.productId === e.productId)).toArray(),
            compareEqualProduct = invoiceLines.asEnumerable()
                .join(inventoryLines, item => item.productId, item => item.productId, (invoice, inventory) => ({
                    productId: invoice.productId,
                    stockId: invoice.stockId,
                    quantity: invoice.quantity - inventory.quantity
                }))
                .toArray(),
            removedLines = inventoryLines.asEnumerable().where(e => !invoiceLines.asEnumerable().any(p => p.productId === e.productId)).toArray(),


            output = compareEqualProduct.asEnumerable().where(e => e.quantity > 0)
                .concat(newLines)
                .toArray(),

            input = compareEqualProduct.asEnumerable()
                .where(e => e.quantity < 0)
                .select(e => Object.assign({}, e, {quantity: Math.abs(e.quantity)}))
                .concat(removedLines)
                .toArray();

        let stocks = toResult(this.knex
                .select('id', 'title')
                .from('stocks')
                .whereIn('id', output.asEnumerable().concat(input).select(e => e.stockId).distinct().toArray())),
            products = toResult(this.knex
                .select('id', 'title')
                .from('products')
                .whereIn('id', output.asEnumerable().concat(input).select(e => e.productId).distinct().toArray()));

        function setDisplayForProductAndStock(items) {
            items.forEach(item => {
                item.stockDisplay = stocks.asEnumerable().singleOrDefault(p => p.id === item.stockId).title;
                item.productDisplay = products.asEnumerable().singleOrDefault(p => p.id === item.productId).title;
            });
        }

        setDisplayForProductAndStock(output);
        setDisplayForProductAndStock(input);

        return {input, output};
    }


    _view(entity, settings) {

        const enums = this.enums,
            mapCostsAndCharges = this._mapCostsAndCharges,
            printUrl = entity.invoiceType === 'sale' && entity.invoiceStatus !== 'draft'
                ? `${process.env.DASHBOARD_URL}/invoice/${entity.id}/?branchId=${entity.branchId}`
                : undefined;

        return Object.assign({}, {
            branchId: entity.branchId,
            id: entity.id,
            printUrl,
            number: entity.number,
            date: entity.date,
            description: entity.description,
            title: entity.title,
            journalId: entity.journalId,
            inventoryIds: entity.inventoryIds,
            detailAccountId: entity.detailAccountId,
            detailAccountDisplay: entity.detailAccountDisplay,
            customer: {id: entity.detailAccountId},
            customerId: entity.detailAccountId,
            customerDisplay: entity.detailAccountDisplay,
            status: entity.invoiceStatus,
            statusDisplay: enums.InvoiceStatus().getDisplay(entity.invoiceStatus),
            invoiceLines: entity.invoiceLines,
            sumTotalPrice: entity.sumTotalPrice,
            sumPaidAmount: entity.sumPaidAmount,
            sumRemainder: entity.sumRemainder,
            costs: mapCostsAndCharges(entity.costs, settings.saleCosts),
            charges: mapCostsAndCharges(entity.charges, settings.saleCharges),
            discount: entity.discount || 0,
            totalVat: entity.totalVat || 0,
            chargesVat: entity.chargesVat || 0
        }, entity.custom);
    }

    _lineView(entity) {
        return {
            id: entity.id,
            productId: entity.productId,
            description: entity.description,
            quantity: entity.quantity,
            unitPrice: entity.unitPrice,
            vat: entity.vat,
            discount: entity.discount,
            scale: entity.scale,
            stockId: entity.stockId,
            stockDisplay: entity.stockDisplay,
        };
    }

    _mapCostsAndCharges(items, itemsInSettings) {

        if (!(items && items.length > 0))
            return undefined;

        return (items || []).asEnumerable()
            .select(e => ({
                key: e.key,
                value: e.value,
                vatIncluded: e.vatIncluded,
                display: (itemsInSettings.asEnumerable().singleOrDefault(c => c.key === e.key) || {}).display
            }))
            .toArray();
    }
}
