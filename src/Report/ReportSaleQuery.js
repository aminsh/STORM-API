import {BaseQuery} from "../Infrastructure/BaseQuery";
import toResult from "asyncawait/await";
import {injectable, inject} from "inversify";

@injectable()
export class ReportSaleQuery extends BaseQuery {

    @inject("ReportConfig")
    /**@type{ReportConfig}*/ reportConfig = undefined;

    getAll(invoiceStatus) {
        let knex = this.knex,
            option = this.reportConfig.options,
            minNumber = option.filter.minNumber || option.filter.maxNumber,
            maxNumber = option.filter.maxNumber || option.filter.minNumber,
            minDate = option.filter.minDate || '1300/01/01',
            maxDate = option.filter.maxDate || '9999/12/31',
            branchId = this.branchId,
            userId = this.state.user.id,
            canView = this.canView.call(this),
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
                    knex.raw(`CASE WHEN "invoiceStatus" = 'confirmed' THEN 'تایید شده' 
                        WHEN "invoiceStatus" = 'fixed' THEN 'قطعی'
                        WHEN "invoiceStatus" = 'draft' THEN 'پیش نویس' END as "invoiceStatusText"`),
                    'description',
                    'title',
                    'journalId',
                    knex.raw(`sum(discount) as discount`),
                    knex.raw(`"sum"("totalPrice") + ${sumChargesQuery} - sum(DISTINCT coalesce(discount,0)) as "sumTotalPrice" `),
                    knex.raw(`sum(coalesce(amount,0)) as "sumPaidAmount"`),
                    knex.raw(`"sum"("totalPrice") + ${sumChargesQuery} - sum(DISTINCT coalesce(discount,0)) - sum(coalesce(amount,0)) as "sumRemainder"`))
                    .from(function () {
                        this.select('invoices.*',
                            'payment.amount',
                            knex.raw('"detailAccounts"."title" as "detailAccountDisplay"'),
                            knex.raw(`("invoiceLines"."unitPrice" * "invoiceLines".quantity - "invoiceLines".discount + "invoiceLines".vat) as "totalPrice"`))
                            .from('invoices')
                            .leftJoin('invoiceLines', 'invoices.id', 'invoiceLines.invoiceId')
                            .leftJoin('detailAccounts', 'invoices.detailAccountId', 'detailAccounts.id')
                            .leftJoin(knex.raw(`(
                                SELECT amount, "treasuryPurpose"."referenceId" as "invoiceId"                      																				
                                FROM treasury
                                LEFT JOIN "treasuryPurpose" ON treasury."id" = "treasuryPurpose"."treasuryId"
                                WHERE treasury."branchId" = '${branchId}'
                                ) as payment`),
                                'payment.invoiceId', 'invoices.id')
                            .modify(modify, branchId, userId, canView, 'invoices')
                            .where('invoiceType', 'sale')
                            .whereBetween('invoices.date', [minDate, maxDate])
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

        if (minNumber || maxNumber)
            query.andWhereBetween('number', [minNumber, maxNumber]);

        if (invoiceStatus === 'paid')
            query.andWhere('sumRemainder', 0);

        if (invoiceStatus === 'unpaid')
            query.andWhere('sumRemainder', '>', 0);

        if (option.filter.detailAccounts && option.filter.detailAccounts.length > 0)
            query.whereIn('detailAccountId', option.filter.detailAccounts);

        return toResult(query);
    }

    getDetail(invoiceStatus) {
        let knex = this.knex,
            option = this.reportConfig.options,
            minNumber = option.filter.minNumber || option.filter.maxNumber,
            maxNumber = option.filter.maxNumber || option.filter.minNumber,
            minDate = option.filter.minDate || '1300/01/01',
            maxDate = option.filter.maxDate || '9999/12/31',
            branchId = this.branchId,
            userId = this.state.user.id,
            canView = this.canView.call(this),
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
                    'productTitle',
                    'quantity',
                    'unitPrice',
                    knex.raw(`coalesce(vat,0) as vat`),
                    knex.raw(`coalesce(tax,0) as tax`),
                    'lineDiscount',
                    knex.raw(`CASE WHEN "invoiceStatus" = 'confirmed' THEN 'تایید شده' 
                        WHEN "invoiceStatus" = 'fixed' THEN 'قطعی'
                        WHEN "invoiceStatus" = 'draft' THEN 'پیش نویس' END as "invoiceStatusText"`),
                    'description',
                    'title',
                    'journalId',
                    knex.raw(`sum(discount) + sum("lineDiscount") as discount`),
                    knex.raw(`"sum"("totalPrice") + ${sumChargesQuery} - sum(DISTINCT coalesce(discount,0)) as "sumTotalPrice" `),
                    knex.raw(`sum(coalesce(amount,0)) as "sumPaidAmount"`),
                    knex.raw(`"sum"("totalPrice") + ${sumChargesQuery} - sum(DISTINCT coalesce(discount,0)) - sum(coalesce(amount,0)) as "sumRemainder"`)
                )
                    .from(function () {
                        this.select('invoices.*',
                            'payment.amount',
                            'invoiceLines.quantity',
                            'invoiceLines.unitPrice',
                            'invoiceLines.vat',
                            'invoiceLines.tax',
                            knex.raw('"invoiceLines".discount as "lineDiscount"'),
                            knex.raw('products.title as "productTitle"'),
                            knex.raw('"detailAccounts"."title" as "detailAccountDisplay"'),
                            knex.raw(`("invoiceLines"."unitPrice" * "invoiceLines".quantity - "invoiceLines".discount + "invoiceLines".vat) as "totalPrice"`))
                            .from('invoices')
                            .leftJoin('invoiceLines', 'invoices.id', 'invoiceLines.invoiceId')
                            .leftJoin('products', 'products.id', 'invoiceLines.productId')
                            .leftJoin('detailAccounts', 'invoices.detailAccountId', 'detailAccounts.id')
                            .leftJoin(knex.raw(`(
                                SELECT amount, "treasuryPurpose"."referenceId" as "invoiceId"                      																				
                                FROM treasury
                                LEFT JOIN "treasuryPurpose" ON treasury."id" = "treasuryPurpose"."treasuryId"
                                WHERE treasury."branchId" = '${branchId}'
                                ) as payment`),
                                'payment.invoiceId', 'invoices.id')
                            .modify(modify, branchId, userId, canView, 'invoices')
                            .where('invoiceType', 'sale')
                            .whereBetween('invoices.date', [minDate, maxDate])
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
                        'productTitle',
                        'quantity',
                        'unitPrice',
                        'vat',
                        'tax',
                        'lineDiscount',
                    )
                    .orderBy('number', 'desc')

            });

        if (minNumber || maxNumber)
            query.andWhereBetween('number', [minNumber, maxNumber]);

        if (invoiceStatus === 'paid')
            query.andWhere('sumRemainder', 0);

        if (invoiceStatus === 'unpaid')
            query.andWhere('sumRemainder', '>', 0);

        if (option.filter.detailAccounts && option.filter.detailAccounts.length > 0)
            query.whereIn('detailAccountId', option.filter.detailAccounts);

        return toResult(query);
    }

    peopleSaleInvoiceTurnover() {
        let knex = this.knex,
            branchId = this.branchId,
            baseQuery = `select coalesce(sum(value),0) from invoices as i left join json_to_recordset(i.charges) as x(key text, value int, "vatIncluded" boolean) on true where i.id = "base"."invoiceId"`,
            sumChargesQuery = `(${baseQuery}) + ((${baseQuery} and "vatIncluded" = true) *  
            coalesce((select (100 * line.vat) / ((line.quantity * line."unitPrice") - line.discount) from "invoiceLines" as line where "invoiceId" = "base"."invoiceId" and vat <> 0 limit 1), 0) /100)`;

            return toResult(
                knex.select().table(function () {
                    this.select(knex.raw(`
                         id, title, 
                         sum("invoiceCount") as "invoiceCount",
                         sum("sumQuantity") as "sumQuantity",
                         sum("sumPrice") as "sumPrice",
                         sum("sumInvoiceLinesDiscount") as "sumInvoiceLinesDiscount",
                         sum("sumVat") as "sumVat",
                         sum("invoiceDiscount") as "invoiceDiscount", 
                         sum("paymentAmount") as "paymentAmount", 
                         sum("totalAmount" + ${sumChargesQuery}) as "totalAmount",
                         sum(remainder + ${sumChargesQuery}) as remainder
                    `))
                        .from(function () {

                            this.select(knex.raw(` invoices."id" as "invoiceId",
                                "detailAccounts"."id", "detailAccounts".title, 
                                 COUNT(DISTINCT invoices."id") as "invoiceCount",
                                 SUM("invoiceLines".quantity) as "sumQuantity", SUM("invoiceLines"."unitPrice") as "sumPrice",
                                 SUM("invoiceLines".discount) as "sumInvoiceLinesDiscount", SUM("invoiceLines".vat) as "sumVat",
                                 SUM(COALESCE(invoices.discount,0)) as "invoiceDiscount", 
                                 SUM(COALESCE(payments.amount,0)) as "paymentAmount", 
                                 SUM(("invoiceLines".quantity * "invoiceLines"."unitPrice" -"invoiceLines".discount + "invoiceLines".vat)
                                        - COALESCE(invoices.discount,0)) as "totalAmount",
                                 SUM(("invoiceLines".quantity * "invoiceLines"."unitPrice" -"invoiceLines".discount + "invoiceLines".vat)
                                        - COALESCE(invoices.discount,0))
                                    - SUM(COALESCE(payments.amount,0)) as remainder
                            `))
                                .from('invoices')
                                .leftJoin('invoiceLines', 'invoices.id', 'invoiceLines.invoiceId')
                                .leftJoin('detailAccounts', 'detailAccounts.id', 'invoices.detailAccountId')
                                .leftJoin('payments', 'payments.invoiceId', 'invoices.id')
                                .where('invoices.branchId', branchId)
                                .where('invoices.invoiceType', 'sale')
                                .as('base')
                                .groupBy('detailAccounts.id', 'detailAccounts.title', 'invoices.id')
                        })
                        .as('result')
                        .groupBy('id', 'title')
                })
            );
    }

}
