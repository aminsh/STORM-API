import {BaseQuery} from "../Infrastructure/BaseQuery";
import toResult from "asyncawait/await";
import {injectable, inject} from "inversify";

@injectable()
export class ReportSeasonalQuery extends BaseQuery {

    @inject("ReportConfig")
    /**@type{ReportConfig}*/ reportConfig = undefined;

    getSeasonal() {
        let knex = this.knex,
            branchId = this.branchId,
            userId = this.state.user.id,
            canView = this.canView.call(this),
            modify = this.modify.bind(this),
            options = this.reportConfig.options,

            query = knex.from(function () {
                this.select(knex.raw(`
                ROW_NUMBER () OVER (ORDER BY invoices.date desc) as "rowNumber",
                invoices.date,
                invoices."invoiceType",
                invoices.id as "invoiceId",
                products.title as "productTitle",
                products.id as "productId",
                products.code as "iranCode",
                CASE WHEN "detailAccounts"."personType" = 'legal' THEN '${'حقوقی'}'
                    ELSE '${'حقیقی'}' END AS "personTypeText",
                CASE WHEN "invoiceLines".vat > 0 then 1 else 0 END as "haveVat",
                CASE WHEN "detailAccounts"."nationalCode" is NULL then 0 else 1 END as "haveNationalCode",
                "detailAccounts"."postalCode",
                "detailAccounts".phone,
                "detailAccounts".address,
                "detailAccounts".title as "personName",
                "detailAccounts"."economicCode",
                "detailAccounts"."nationalCode",
                "detailAccounts".city,
                "detailAccounts".province,
                COALESCE (("invoiceLines"."unitPrice" * "invoiceLines".quantity),0) AS "price",
                COALESCE ("invoiceLines".discount,0) as discount,
                "invoiceLines".vat as vat,
                "invoiceLines".tax as tax,
                ((("invoiceLines"."unitPrice" * "invoiceLines".quantity)-"invoiceLines".discount)+"invoiceLines".vat + "invoiceLines".tax) as "totalPrice",
                "returnInvoice"."ofInvoiceId",
                COALESCE("returnInvoice"."returnPrice",0) as "returnPrice",
                COALESCE("returnInvoice"."totalReturnPrice",0) as "totalReturnPrice",
                CAST(substring("invoices"."date" from 6 for 2) as INTEGER) as "month",
                CASE WHEN CAST(substring("invoices"."date" from 6 for 2) as INTEGER) BETWEEN 1 AND 3 THEN 1
                     WHEN CAST(substring("invoices"."date" from 6 for 2) as INTEGER) BETWEEN 4 AND 6 THEN 2 
                     WHEN CAST(substring("invoices"."date" from 6 for 2) as INTEGER) BETWEEN 7 AND 9 THEN 3 
                     WHEN CAST(substring("invoices"."date" from 6 for 2) as INTEGER) BETWEEN 10 AND 12 THEN 4 END as season
                `))
                    .from('invoiceLines')
                    .innerJoin('invoices', 'invoiceLines.invoiceId', 'invoices.id')
                    .innerJoin('products', 'products.id', 'invoiceLines.productId')
                    .innerJoin('detailAccounts', 'detailAccounts.id', 'invoices.detailAccountId')
                    .leftJoin(knex.raw(`(SELECT invoices."ofInvoiceId",
                        ("invoiceLines"."unitPrice" * "invoiceLines".quantity) - "invoiceLines".discount AS "returnPrice",
                        (("invoiceLines"."unitPrice" * "invoiceLines".quantity)-"invoiceLines".discount)+"invoiceLines".vat as "totalReturnPrice"
                      FROM "invoiceLines"
                      INNER JOIN invoices ON "invoiceLines"."invoiceId" = invoices."id"
                      WHERE "invoiceType" in ('returnSale','returnPurchase')) as "returnInvoice"`), 'returnInvoice.ofInvoiceId', '=', 'invoices.id')
                    .modify(modify, branchId, userId, canView, 'invoices')
                    .where('invoices.invoiceType', options.filter.invoiceType)
                    .where('invoices.invoiceStatus', '!=', 'draft')
                    .whereBetween('invoices.date', [options.fromMainDate, options.toDate])
                    .as('seasonal')
                    .orderBy('date', 'desc');

            });
        return query;
    }

    getSeasonalWithFilter(parameters) {
        let options = this.reportConfig.options,
            result = toResult(Utility.kendoQueryResolve(this.getSeasonal(), parameters, item => item)),
            vat = parseInt(options.filter.haveVat) === 1 ? [0, 1] :
                parseInt(options.filter.haveVat) === 2 ? [1] : [0],

            nationalCode = parseInt(options.filter.haveNationalCode) === 1 ? [0, 1] :
                parseInt(options.filter.haveNationalCode) === 2 ? [1] : [0];

        if (result)
            result.data = result.data.asEnumerable()
                .where(item => options.month.includes(item.month))
                .where(item => options.season.includes(item.season))
                .where(item => vat.includes(item.haveVat))
                .where(item => nationalCode.includes(item.haveNationalCode))
                .toArray();

        return result || [];
    }

    getTotalSeasonal() {
        let knex = this.knex,
            branchId = this.branchId,
            userId = this.state.user.id,
            canView = this.canView.call(this),
            modify = this.modify.bind(this),
            options = this.reportConfig.options,
            vat = parseInt(options.filter.haveVat) === 1 ? [0, 1] :
                parseInt(options.filter.haveVat) === 2 ? [1] : [0],

            nationalCode = parseInt(options.filter.haveNationalCode) === 1 ? [0, 1] :
                parseInt(options.filter.haveNationalCode) === 2 ? [1] : [0],

            query = toResult(knex.select(knex.raw(`
                "invoiceType", 
                CASE WHEN "invoiceLines".vat > 0 then 1 else 0 END as "haveVat",
                CASE WHEN "detailAccounts"."nationalCode" is NULL then 0 else 1 END as "haveNationalCode",
                CAST(substring("invoices"."date" from 6 for 2) as INTEGER) as "month",
                CASE WHEN CAST(substring("invoices"."date" from 6 for 2) as INTEGER) BETWEEN 1 AND 3 THEN 1
                     WHEN CAST(substring("invoices"."date" from 6 for 2) as INTEGER) BETWEEN 4 AND 6 THEN 2 
                     WHEN CAST(substring("invoices"."date" from 6 for 2) as INTEGER) BETWEEN 7 AND 9 THEN 3 
                     WHEN CAST(substring("invoices"."date" from 6 for 2) as INTEGER) BETWEEN 10 AND 12 THEN 4 END as season,
                COALESCE (("invoiceLines"."unitPrice" * "invoiceLines".quantity),0) AS "price",
                COALESCE ("invoiceLines".discount,0) as discount,
                "invoiceLines".vat as vat,
                "invoiceLines".tax as tax,
                ((("invoiceLines"."unitPrice" * "invoiceLines".quantity)-"invoiceLines".discount)+"invoiceLines".vat + "invoiceLines".tax) as "totalPrice"
                        `))
                .from('invoiceLines')
                .innerJoin('invoices', 'invoiceLines.invoiceId', 'invoices.id')
                .innerJoin('detailAccounts', 'detailAccounts.id', 'invoices.detailAccountId')
                .where('invoices.invoiceStatus', '!=', 'draft')
                .modify(modify, branchId, userId, canView, 'invoices')
                .whereBetween('invoices.date', [options.fromMainDate, options.toDate])
            ),

            resultWithFilter = query.asEnumerable()
                .where(item => options.month.includes(item.month))
                .where(item => options.season.includes(item.season))
                .where(item => vat.includes(item.haveVat))
                .where(item => nationalCode.includes(item.haveNationalCode))
                .toArray(),

            result = resultWithFilter.asEnumerable()
                .groupBy(
                    item => item.invoiceType,
                    item => item,
                    (key, items) => ({
                        key,
                        sumPrice: items.sum(e => e.price),
                        sumDiscount: items.sum(e => e.discount),
                        sumVat: items.sum(e => e.vat + e.tax),
                        totalPrice: items.sum(e => e.totalPrice)
                    }))
                .toObject(item => item.key, item => Object.assign({}, item, {key: undefined}));

        return result;
    }
}