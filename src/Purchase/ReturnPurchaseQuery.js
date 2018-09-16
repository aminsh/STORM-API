import {BaseQuery} from "../Infrastructure/BaseQuery";
import toResult from "asyncawait/await";
import {injectable, inject} from "inversify"

@injectable()
export class ReturnPurchaseQuery extends BaseQuery {

    @inject("Enums") enums = undefined;

    @inject("SettingsQuery")
    /** @type {SettingsQuery}*/ settingsQuery = undefined;

    @inject("TreasuryPurposeQuery")
    /** @type{TreasuryPurposeQuery}*/ treasuryPurposeQuery = undefined;

    @inject("FiscalPeriodQuery")
    /** @type{FiscalPeriodQuery}*/ fiscalPeriodQuery = undefined;

    @inject("InvoiceCompareService")
    /**@type{InvoiceCompareService}*/ invoiceCompareService = undefined;

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
                    knex.raw('"person"."title" as "detailAccountDisplay"')
                )
                .from('invoices')
                .leftJoin('detailAccounts as person', 'invoices.detailAccountId', 'person.id')
                .leftJoin('detailAccounts as marketer', 'invoices.marketerId', 'marketer.id')
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
                            knex.raw(`("invoiceLines"."unitPrice" * "invoiceLines".quantity - "invoiceLines".discount + "invoiceLines".vat + "invoiceLines".tax) as "totalPrice"`))
                            .from('invoices')
                            .leftJoin('invoiceLines', 'invoices.id', 'invoiceLines.invoiceId')
                            .leftJoin('detailAccounts as person', 'invoices.detailAccountId', 'person.id')
                            .modify(modify, branchId, userId, canView, 'invoices')
                            .andWhere('invoiceType', 'returnPurchase')
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

        return toResult(Utility.kendoQueryResolve(query, parameters, this._lineView.bind(this)));
    }

    maxNumber() {
        return toResult(
            this.knex.table('invoices')
                .where('branchId', this.branchId)
                .where('invoiceType', 'returnPurchase')
                .max('number')
                .first()
        );
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
                throw new ValidationException(['انبار مقدار ندارد']);

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

        let result = {input: [], output: []};


        compared.map(item => ({
            productId: item.productId,
            productDisplay: products.asEnumerable().single(p => p.id === item.productId).title,
            stockId: item.stockId,
            stockDisplay: stocks.asEnumerable().single(s => s.id === item.stockId).title,
            quantity: item.quantity
        }))
            .forEach(item => {

                if (item.quantity > 0)
                    result.input.push(item);
                else
                    result.output.push(Object.assign({}, item, {quantity: Math.abs(item.quantity)}));
            });

        return result;
    }


    _view(entity, settings) {

        const enums = this.enums,
            mapCostsAndCharges = this._mapCostsAndCharges;

        return Object.assign({}, {
            branchId: entity.branchId,
            id: entity.id,
            ofInvoiceId: entity.ofInvoiceId,
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
            tax: entity.tax,
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
