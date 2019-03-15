import { BaseQuery } from "../Infrastructure/BaseQuery";
import toResult from "asyncawait/await";
import { injectable, inject } from "inversify";
import { outputStatusQuery } from "./SalePartialQuery";

@injectable()
export class SaleQuery extends BaseQuery {

    @inject("Enums") enums = undefined;

    @inject("SettingsQuery")
    /** @type {SettingsQuery}*/ settingsQuery = undefined;

    @inject("TreasuryPurposeQuery")
    /** @type{TreasuryPurposeQuery}*/ treasuryPurposeQuery = undefined;

    @inject("FiscalPeriodQuery")
    /** @type{FiscalPeriodQuery}*/ fiscalPeriodQuery = undefined;

    @inject("InvoiceCompareService")
    /**@type{InvoiceCompareService}*/ invoiceCompareService = undefined;

    @inject("InventoryQuery")
    /**@type{InventoryQuery}*/ inventoryQuery = undefined;

    getById(id) {
        let knex = this.knex,
            branchId = this.branchId,
            userId = this.state.user.id,
            canView = this.canView.call(this),
            modify = this.modify.bind(this),
            settings = this.settingsQuery.get(),
            treasuriesTotalAmount = this.treasuryPurposeQuery.getTreasuriesTotalAmount(id),

            invoice = toResult(knex
                .select(
                    'invoices.*',
                    knex.raw('"person"."title" as "detailAccountDisplay"'),
                    knex.raw('"marketer"."title" as "marketerDisplay"'),
                    knex.raw(`(${outputStatusQuery('invoices')}) as delivered`),
                    knex.raw('"invoice_types"."title" as "typeDisplay"'),
                    knex.raw('journals."temporaryNumber" as journal_number'),
                    knex.raw('journals."temporaryDate" as journal_date'),
                    knex.raw('journals.description as journal_description')
                )
                .from('invoices')
                .leftJoin('detailAccounts as person', 'invoices.detailAccountId', 'person.id')
                .leftJoin('detailAccounts as marketer', 'invoices.marketerId', 'marketer.id')
                .leftJoin('invoice_types', 'invoices.typeId', 'invoice_types.id')
                .leftJoin('journals', 'journals.id', 'invoices.journalId')
                .where('invoices.id', id)
                .modify(modify, branchId, userId, canView, 'invoices')
                .first()
            ),

            invoiceLines = toResult(knex
                .select('invoiceLines.*',
                    knex.raw('CAST("invoiceLines"."unitPrice" AS FLOAT)'),
                    knex.raw('scales.title as scale'),
                    knex.raw('stocks.title as "stockDisplay"')
                )
                .from('invoiceLines')
                .leftJoin('products', 'invoiceLines.productId', 'products.id')
                .leftJoin('scales', 'products.scaleId', 'scales.id')
                .leftJoin('stocks', 'invoiceLines.stockId', 'stocks.id')
                .modify(modify, branchId, userId, canView, 'invoiceLines')
                .where('invoiceId', id)
            ),
            sumCharges = invoice
                ? ( invoice.charges || [] ).asEnumerable().sum(c => c.value)
                : 0,
            sumChargesVatIncluded = invoice
                ? ( invoice.charges || [] ).asEnumerable().where(e => e.vatIncluded).sum(e => e.value)
                : 0,
            invoiceDiscount = invoice ? invoice.discount || 0 : 0;

        let lineHaveVat = invoiceLines.asEnumerable().firstOrDefault(e => e.vat !== 0),
            persistedVat = lineHaveVat
                ? ( 100 * ( lineHaveVat.vat + lineHaveVat.tax ) / ( ( ( lineHaveVat.quantity * lineHaveVat.unitPrice ) - lineHaveVat.discount ) ) )
                : 0;

        if (invoice) {
            invoice.sumTotalPrice = invoiceLines.asEnumerable()
                    .sum(line => line.quantity * line.unitPrice - line.discount + line.vat + line.tax)
                - invoiceDiscount +
                sumCharges + ( sumChargesVatIncluded * persistedVat / 100 );

            invoice.sumRemainder = invoice.sumTotalPrice - treasuriesTotalAmount;

            invoice.totalVat = invoiceLines.asEnumerable()
                .sum(line => line.vat + line.tax) + ( sumChargesVatIncluded * persistedVat / 100 );

            invoice.chargesVat = sumChargesVatIncluded * persistedVat / 100;

            invoice.invoiceLines = invoiceLines.asEnumerable().select(this._lineView).toArray();
            invoice.branchId = branchId;

            invoice.outputs = this.inventoryQuery.getByInvoice(invoice.id);
        }

        invoice.referenceId = invoice.orderId;
        return invoice ? this._view(invoice, settings) : [];
    }

    getByOrderId(orderId) {
        const invoice = toResult(this.knex.select('id').from('invoices').where({ orderId }).first());

        if (!invoice)
            return null;

        return this.getById(invoice.id);
    }

    getByOrderIds(orderIds) {
        if (!( orderIds && orderIds.length > 0 ))
            return [];

        return toResult(this.knex.select('id', 'orderId', 'number').from('invoices')
            .where('branchId', this.branchId)
            .whereIn('orderId', orderIds));
    }

    getAll(parameters) {
        let knex = this.knex,
            branchId = this.branchId,
            userId = this.userId,
            canView = this.canView(),
            modify = this.modify.bind(this),
            baseQuery = `select coalesce(sum(value),0) from invoices as i left join json_to_recordset(i.charges) as x(key text, value int, "vatIncluded" boolean) on true where i.id = "base".id`,
            sumChargesQuery = `(${baseQuery}) + ((${baseQuery} and "vatIncluded" = true) *  
            coalesce((select (100 * (line.vat + line.tax)) / ((line.quantity * line."unitPrice") - line.discount) from "invoiceLines" as line where "invoiceId" = "base".id and vat <> 0 limit 1), 0) /100)`,

            query = knex.select().table(function () {
                this.select(
                    'createdAt',
                    'id',
                    knex.raw('"orderId" as "referenceId"'),
                    'number',
                    'display',
                    'date',
                    'detailAccountId',
                    'detailAccountDisplay',
                    'invoiceStatus',
                    'description',
                    'title',
                    'journalId',
                    'journal_number',
                    'journal_date',
                    'marketerId',
                    'marketerDisplay',
                    'typeId',
                    'typeDisplay',
                    knex.raw(`sum(discount) as discount`),
                    knex.raw(`"sum"("totalPrice") + ${sumChargesQuery} - sum(DISTINCT coalesce(discount,0)) as "sumTotalPrice" `),
                    knex.raw(`("sum"("totalPrice") + ${sumChargesQuery}) - sum(DISTINCT coalesce(discount,0)) -
                                (select coalesce(sum(treasury.amount),0) as "treasuryAmount"
                                from treasury
                                inner join "treasuryPurpose" as tp on treasury.id = tp."treasuryId"
                                where "base"."id" = tp."referenceId") as "sumRemainder"`),
                    knex.raw(`(${outputStatusQuery('base')}) as delivered`))
                    .from(function () {
                        this.select('invoices.*',
                            knex.raw('"person"."title" as "detailAccountDisplay"'),
                            knex.raw(`invoices.number || ' - ' || invoices.date || ' - ' || "person".title as display`),
                            knex.raw('"marketer"."title" as "marketerDisplay"'),
                            knex.raw('"invoice_types"."title" as "typeDisplay"'),
                            knex.raw(`("invoiceLines"."unitPrice" * "invoiceLines".quantity - "invoiceLines".discount + "invoiceLines".vat + "invoiceLines".tax) as "totalPrice"`),
                            knex.raw('journals."temporaryNumber" as journal_number'),
                            knex.raw('journals."temporaryDate" as journal_date')
                        )
                            .from('invoices')
                            .leftJoin('invoiceLines', 'invoices.id', 'invoiceLines.invoiceId')
                            .leftJoin('detailAccounts as person', 'invoices.detailAccountId', 'person.id')
                            .leftJoin('detailAccounts as marketer', 'invoices.marketerId', 'marketer.id')
                            .leftJoin('invoice_types', 'invoices.typeId', 'invoice_types.id')
                            .leftJoin('journals', 'journals.id', 'invoices.journalId')
                            .modify(modify, branchId, userId, canView, 'invoices')
                            .andWhere('invoices.invoiceType', 'sale')
                            .as('base');
                    }).as("group")
                    .groupBy(
                        'createdAt',
                        'id',
                        'orderId',
                        'number',
                        'display',
                        'date',
                        'detailAccountId',
                        'detailAccountDisplay',
                        'invoiceStatus',
                        'description',
                        'title',
                        'journalId',
                        'journal_number',
                        'journal_date',
                        'marketerId',
                        'marketerDisplay',
                        'typeId',
                        'typeDisplay')
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

    getSummary() {
        let knex = this.knex,
            fiscalPeriodId = this.state.fiscalPeriodId,
            branchId = this.branchId,
            userId = this.state.user.id,
            canView = this.canView.call(this),
            modify = this.modify.bind(this),
            fiscalPeriod = this.fiscalPeriodQuery.getById(fiscalPeriodId),

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
                    knex.raw(`("invoiceLines"."unitPrice" * "invoiceLines".quantity - "invoiceLines".discount + "invoiceLines".vat + "invoiceLines".tax) as "totalPrice"`))
                    .from('invoices')
                    .leftJoin('invoiceLines', 'invoices.id', 'invoiceLines.invoiceId')
                    .leftJoin('detailAccounts', 'invoices.detailAccountId', 'detailAccounts.id')
                    .modify(modify, branchId, userId, canView, 'invoices')
                    .andWhere('invoiceType', 'sale')
                    .whereBetween('date', [ fiscalPeriod.minDate, fiscalPeriod.maxDate ])
                    .as('base');
            }).first();

        return toResult(query);
    }

    getTotalByMonth() {
        let branchId = this.branchId,
            userId = this.state.user.id,
            fiscalPeriodId = this.state.fiscalPeriodId,
            canView = this.canView.call(this),
            modify = this.modify.bind(this),
            knex = this.knex,
            fiscalPeriod = this.fiscalPeriodQuery.getById(fiscalPeriodId),

            query = knex.select(
                'month',
                knex.raw('"count"(*) as "total"'),
                knex.raw('"sum"("totalPrice") - sum(DISTINCT coalesce(discount,0)) as "sumTotalPrice"'))
                .from(function () {
                    this.select('invoices.*',
                        knex.raw('cast(substring("invoices"."date" from 6 for 2) as INTEGER) as "month"'),
                        knex.raw(`("invoiceLines"."unitPrice" * "invoiceLines".quantity - "invoiceLines".discount + "invoiceLines".vat + "invoiceLines".tax) as "totalPrice"`))
                        .from('invoices')
                        .leftJoin('invoiceLines', 'invoices.id', 'invoiceLines.invoiceId')
                        .modify(modify, branchId, userId, canView, 'invoices')
                        .andWhere('invoiceType', 'sale')
                        .whereBetween('date', [ fiscalPeriod.minDate, fiscalPeriod.maxDate ])
                        .as('base');
                })
                .groupBy('month')
                .orderBy('month')
                .map(item => ( {
                    total: item.total,
                    totalPrice: item.sumTotalPrice,
                    month: item.month,
                    monthName: this.enums.getMonth().getDisplay(item.month),
                } ));


        return toResult(query);
    }

    getTotalByProduct() {
        let branchId = this.branchId,
            userId = this.state.user.id,
            fiscalPeriodId = this.state.fiscalPeriodId,
            canView = this.canView.call(this),
            modify = this.modify.bind(this),
            knex = this.knex,
            fiscalPeriod = this.fiscalPeriodQuery.getById(fiscalPeriodId),

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
                        .andWhere('invoiceType', 'sale')
                        .whereBetween('date', [ fiscalPeriod.minDate, fiscalPeriod.maxDate ])
                        .as('base');
                })
                .groupBy('productId', 'productTitle')
                .orderByRaw('"count"(*) desc')
                .limit(5)
                .map(item => ( {
                    productId: item.productId,
                    productTitle: item.productTitle,
                    total: item.total
                } ));

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
        return !!( toResult(this.knex('invoices').where("id", invoiceId).first()) )
    }

    getCompareInvoiceOnChange(id, lines) {

        const settings = this.settingsQuery.get(),
            defaultStockId = settings.stockId,
            oldLines = toResult(this.knex.select('*').from('invoiceLines').where({
                branchId: this.branchId,
                invoiceId: id
            }));

        if (lines.asEnumerable().any(l => !l.stockId)) {

            if (!defaultStockId)
                throw new ValidationException([ 'انبار مقدار ندارد' ]);

            lines.forEach(item => item.stockId = item.stockId || defaultStockId);
        }

        const newLines = lines;

        const compared = this.invoiceCompareService.compare('output', oldLines, newLines);

        const products = toResult(this.knex.select('title', 'id').from('products')
                .where('branchId', this.branchId)
                .whereIn('id', compared.map(item => item.productId))
            ),
            stocks = toResult(this.knex.select('title', 'id').from('stocks')
                .where('branchId', this.branchId)
                .whereIn('id', compared.map(item => item.stockId))
            );

        let result = { input: [], output: [] };


        compared.map(item => ( {
            productId: item.productId,
            productDisplay: products.asEnumerable().single(p => p.id === item.productId).title,
            stockId: item.stockId,
            stockDisplay: stocks.asEnumerable().single(s => s.id === item.stockId).title,
            quantity: item.quantity
        } ))
            .forEach(item => {

                if (item.quantity > 0)
                    result.input.push(item);
                else
                    result.output.push(Object.assign({}, item, { quantity: Math.abs(item.quantity) }));
            });

        return result;
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
            referenceId: entity.referenceId,
            printUrl,
            number: entity.number,
            date: entity.date,
            display: entity.display,
            description: entity.description,
            title: entity.title,
            journalId: entity.journalId,
            journal: entity.journalId
                ? {
                    id: entity.journalId,
                    number: entity.journal_number,
                    date: entity.journal_date,
                    description: entity.journal_description
                }
                : null,
            inventoryIds: entity.inventoryIds,
            detailAccountId: entity.detailAccountId,
            detailAccountDisplay: entity.detailAccountDisplay,
            customer: { id: entity.detailAccountId },
            customerId: entity.detailAccountId,
            customerDisplay: entity.detailAccountDisplay,
            status: entity.invoiceStatus,
            statusDisplay: enums.InvoiceStatus().getDisplay(entity.invoiceStatus),
            typeId: entity.typeId,
            type: { id: entity.typeId, title: entity.typeDisplay },
            currencyId: entity.currencyId,
            invoiceLines: entity.invoiceLines,
            sumTotalPrice: entity.sumTotalPrice,
            sumPaidAmount: entity.sumPaidAmount,
            sumRemainder: entity.sumRemainder,
            costs: mapCostsAndCharges(entity.costs, settings.saleCosts),
            charges: mapCostsAndCharges(entity.charges, settings.saleCharges),
            discount: entity.discount || 0,
            totalVat: entity.totalVat || 0,
            chargesVat: entity.chargesVat || 0,
            marketerId: entity.marketerId,
            marketerDisplay: entity.marketerDisplay,
            delivered: entity.delivered,
            outputs: entity.outputs
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
            tax: entity.tax,
            discount: entity.discount,
            scale: entity.scale,
            stockId: entity.stockId,
            stockDisplay: entity.stockDisplay,
        };
    }

    _mapCostsAndCharges(items, itemsInSettings) {

        if (!( items && items.length > 0 ))
            return undefined;

        return ( items || [] ).asEnumerable()
            .select(e => ( {
                key: e.key,
                value: e.value,
                vatIncluded: e.vatIncluded,
                display: ( itemsInSettings.asEnumerable().singleOrDefault(c => c.key === e.key) || {} ).display
            } ))
            .toArray();
    }
}
