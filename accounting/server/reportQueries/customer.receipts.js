"use strict";

const  BaseQuery = require('../queries/query.base'),
    await = require('asyncawait/await'),
    translate = require('../services/translateService');

class CustomerReceipts extends BaseQuery{
    constructor(branchId) {
        super(branchId);
    }

    getCustomerReceipt(invoiceId) {
        let knex = this.knex,
            branchId = this.branchId,

            result =await(knex.select(knex.raw(`
            DISTINCT invoices."id" as "invoiceId",invoices."number", "detailAccounts".title as customer, 
            CONCAT('${translate('For invoice with number')}',' ',invoices."number" ,', ','${translate('In date')}' ,' ',invoices."date") AS invoiceFor,
	        payment.amount, payment."paymentDescription", payment."paymentTypeText"
        `))
                .from('invoices')
                .innerJoin('detailAccounts', 'detailAccounts.id', 'invoices.detailAccountId')
                .leftJoin('payments', 'payments.invoiceId', 'invoices.id')
                .innerJoin(knex.raw(`(SELECT payments."paymentType", payments."number", payments.amount,payments."date", payments."invoiceId",
                            "detailAccounts".title,
                            CASE WHEN payments."paymentType" = 'receipt' THEN '${translate('New Receipt receive')}'
                                    WHEN payments."paymentType" = 'cheque' THEN '${translate('Cheque')}'
                                    WHEN payments."paymentType" = 'cash' THEN '${translate('Cash')}'
                                    WHEN payments."paymentType" = 'person' THEN '${translate('By person')}'
                                 END as "paymentTypeText",
                    
                            CASE WHEN payments."paymentType" = 'receipt' THEN 
                                            CONCAT('${translate('Bank')}',' ',"detailAccounts".title, ' , ' ,'${translate('In number')}',' ',payments."number")
                                    WHEN payments."paymentType" = 'cheque' THEN 
                                            CONCAT('${translate('cheque to number')}',' ' ,payments."number",' ، ' ,
                                            '${translate('Bank')}',' ',"detailAccounts".title ,' ، ' ,'${translate('cheque date')}' ,' ',payments."date")
                                    WHEN payments."paymentType" = 'cash' THEN 
                                            '${translate('New Cash receive')}'
                                    WHEN payments."paymentType" = 'person' THEN
                                            CONCAT('${translate('Receive from')}' ,' ',"detailAccounts".title)
                                END as "paymentDescription"
                        FROM payments
                        LEFT JOIN "journalLines" ON "journalLines"."id" = payments."journalLineId"
                        LEFT JOIN "detailAccounts" ON "detailAccounts"."id" = "journalLines"."detailAccountId"
                        WHERE payments."branchId" = '${branchId}') as payment`),
                    'payment.invoiceId', 'invoices.id')
                .where('invoices.branchId', branchId)
                .where('invoices.id', invoiceId));

        return result;
    }
}

module.exports = CustomerReceipts;