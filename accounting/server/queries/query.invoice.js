"use strict";

const BaseQuery = require('./query.base'),
    async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    view = require('../viewModel.assemblers/view.invoice'),
    lineView = require('../viewModel.assemblers/view.invoiceLine'),
    FiscalPeriodQuery = require('./query.fiscalPeriod'),
    SettingsQuery = require('./query.settings'),
    kendoQueryResolve = require('../services/kendoQueryResolve'),
    enums = require('../../../shared/enums'),
    TreasuryPurposeQuery = require('./query.treasury.purpose');


class InvoiceQuery extends BaseQuery {
    constructor(branchId, userId) {
        super(branchId, userId);
        this.check = async(this.check);
    }

    getById(id) {
        let knex = this.knex,
            branchId = this.branchId,
            userId = this.userId,
            canView = this.canView(),
            modify = this.modify,
            settings = new SettingsQuery(this.branchId).get(),
            treasuryPurpose = new TreasuryPurposeQuery(this.branchId),
            treasuriesTotalAmount = treasuryPurpose.getTreasuriesTotalAmount(id),

            invoice = await(knex
                .select(
                    'invoices.*',
                    knex.raw('"person"."title" as "detailAccountDisplay"'),
                    knex.raw('"marketer"."title" as "marketerDisplay"')
                )
                .from('invoices')
                .leftJoin('detailAccounts as person', 'invoices.detailAccountId', 'person.id')
                .leftJoin('detailAccounts as marketer', 'invoices.marketerId', 'marketer.id')
                .where('invoices.id', id)
                .modify(modify, branchId, userId, canView, 'invoices')
                .first()
            ),

            invoiceLines = await(knex
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
                ? (100 * (lineHaveVat.vat + lineHaveVat.tax) / (((lineHaveVat.quantity * lineHaveVat.unitPrice) - lineHaveVat.discount)))
                : 0;

        if (invoice) {
            invoice.sumTotalPrice = invoiceLines.asEnumerable()
                    .sum(line => line.quantity * line.unitPrice - line.discount + line.vat + line.tax)
                - invoiceDiscount +
                sumCharges + (sumChargesVatIncluded * persistedVat / 100);

            invoice.sumRemainder = invoice.sumTotalPrice - treasuriesTotalAmount;

            invoice.totalVat = invoiceLines.asEnumerable()
                .sum(line => line.vat + line.tax) + (sumChargesVatIncluded * persistedVat / 100);

            invoice.chargesVat = sumChargesVatIncluded * persistedVat / 100;

            invoice.invoiceLines = invoiceLines.asEnumerable().select(lineView).toArray();
            invoice.branchId = branchId;
        }
        return invoice ? view(invoice, settings) : [];
    }

    getAll(parameters, invoiceType) {
        let knex = this.knex,
            branchId = this.branchId,
            userId = this.userId,
            canView = this.canView(),
            modify = this.modify,
            baseQuery = `select coalesce(sum(value),0) from invoices as i left join json_to_recordset(i.charges) as x(key text, value int, "vatIncluded" boolean) on true where i.id = "base".id`,
            sumChargesQuery = `(${baseQuery}) + ((${baseQuery} and "vatIncluded" = true) *  
            coalesce((select (100 * (line.vat + line.tax)) / ((line.quantity * line."unitPrice") - line.discount) from "invoiceLines" as line where "invoiceId" = "base".id and vat <> 0 limit 1), 0) /100)`,

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
                    'marketerId',
                    'marketerDisplay',
                    knex.raw(`sum(discount) as discount`),
                    knex.raw(`"sum"("totalPrice") + ${sumChargesQuery} - sum(DISTINCT coalesce(discount,0)) as "sumTotalPrice" `),
                    knex.raw(`("sum"("totalPrice") + ${sumChargesQuery}) - sum(DISTINCT coalesce(discount,0)) -
                                (select coalesce(sum(treasury.amount),0) as "treasuryAmount"
                                from treasury
                                inner join "treasuryPurpose" as tp on treasury.id = tp."treasuryId"
                                where "base"."id" = tp."referenceId") as "sumRemainder"`))
                    .from(function () {
                        this.select('invoices.*',
                            knex.raw('"person"."title" as "detailAccountDisplay"'),
                            knex.raw('"marketer"."title" as "marketerDisplay"'),
                            knex.raw(`("invoiceLines"."unitPrice" * "invoiceLines".quantity - "invoiceLines".discount + "invoiceLines".vat + "invoiceLines".tax) as "totalPrice"`))
                            .from('invoices')
                            .leftJoin('invoiceLines', 'invoices.id', 'invoiceLines.invoiceId')
                            .leftJoin('detailAccounts as person', 'invoices.detailAccountId', 'person.id')
                            .leftJoin('detailAccounts as marketer', 'invoices.marketerId', 'marketer.id')
                            .modify(modify, branchId, userId, canView, 'invoices')
                            .andWhere('invoiceType', invoiceType)
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
                        'journalId',
                        'marketerId',
                        'marketerDisplay')
                    .orderBy('number', 'desc')

            });
        return kendoQueryResolve(query, parameters, view);
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

        return kendoQueryResolve(query, parameters, lineView);
    }

    getSummary(fiscalPeriodId, invoiceType) {
        let knex = this.knex,
            branchId = this.branchId,
            userId = this.userId,
            canView = this.canView(),
            modify = this.modify,
            fiscalPeriodRepository = new FiscalPeriodQuery(this.branchId),
            fiscalPeriod = await(fiscalPeriodRepository.getById(fiscalPeriodId));

        return knex.select(
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
    }

    getTotalByMonth(fiscalPeriodId, invoiceType) {
        let branchId = this.branchId,
            userId = this.userId,
            canView = this.canView(),
            modify = this.modify,
            knex = this.knex,
            fiscalPeriodRepository = new FiscalPeriodQuery(this.branchId),
            fiscalPeriod = await(fiscalPeriodRepository.getById(fiscalPeriodId));

        return knex.select(
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
                monthName: enums.getMonth().getDisplay(item.month),
            }));
    }

    getTotalByProduct(fiscalPeriodId, invoiceType) {
        let branchId = this.branchId,
            userId = this.userId,
            canView = this.canView(),
            modify = this.modify,
            knex = this.knex,
            fiscalPeriodRepository = new FiscalPeriodQuery(this.branchId),
            fiscalPeriod = await(fiscalPeriodRepository.getById(fiscalPeriodId));

        return knex.select(
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
    }

    maxNumber(invoiceType) {
        return this.knex.table('invoices')
            .where('branchId', this.branchId)
            .where('invoiceType', invoiceType)
            .max('number')
            .first();
    }

    check(invoiceId) {
        return !!(await(this.knex('invoices').where("id", invoiceId).first()))
    }

    getCompareInvoiceOnChange(id, lines) {
        let branchId = this.branchId,
            userId = this.userId,
            canView = this.canView(),
            modify = this.modify,
            settings = await(new SettingsQuery(this.branchId).get()),
            goodLines = lines.asEnumerable().where(e =>
                e.productId &&
                await(this.knex.select('productType').from('products').where('id', e.productId).first()).productType === 'good'
            ).toArray();

        if (goodLines.length === 0)
            return;

        if (settings.productOutputCreationMethod === 'defaultStock')
            goodLines.forEach(e => e.stockId = settings.stockId);
        else {
            if (goodLines.asEnumerable().any(e => !e.stockId))
                throw new ValidationException(['StockId is empty']);
        }

        let inventoryLines = await(this.knex
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

        let stocks = await(this.knex
                .select('id', 'title')
                .from('stocks')
                .whereIn('id', output.asEnumerable().concat(input).select(e => e.stockId).distinct().toArray())),
            products = await(this.knex
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
}


module.exports = InvoiceQuery;