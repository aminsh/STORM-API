"use strict";

const BaseQuery = require('./query.base'),
    enums = require('../../../shared/enums'),
    translate = require('../services/translateService');

module.exports = class ReportQueryAccounts extends BaseQuery {
    constructor(branchId) {
        super(branchId);
    }

    getGeneralLedgerAccounts() {
        let knex = this.knex;
        return knex.select(knex.raw(`code, 
        title, 
        description,
        "groupingType",
        CASE WHEN code ISNULL THEN title ELSE title||' ${translate('Code')} ' ||code END AS display`))
            .from('generalLedgerAccounts')
            .where('branchId', this.branchId);
    };

    getSubsidiaryLedgerAccounts() {
        let knex = this.knex,
            branchId = this.branchId;

        let subsidiaryLedgerAccountsValues = `"subsidiaryLedgerAccounts".code as "subsidiaryCode",
            "subsidiaryLedgerAccounts".title as "subsidiaryTitle",
            CASE WHEN "subsidiaryLedgerAccounts".code ISNULL THEN "subsidiaryLedgerAccounts".title 
                ELSE "subsidiaryLedgerAccounts".title||' ${translate('Code')} ' ||"subsidiaryLedgerAccounts".code END AS subsidiaryDisplay,
            "generalLedgerAccounts".code as "generalCode",
            "generalLedgerAccounts".title as "generalTitle",
             CASE WHEN "generalLedgerAccounts".code ISNULL THEN "generalLedgerAccounts".title 
                ELSE "generalLedgerAccounts".title||' ${translate('Code')} ' ||"generalLedgerAccounts".code END AS generalDisplay,
                
             CASE WHEN "subsidiaryLedgerAccounts"."hasDetailAccount" ='f' THEN '${translate('Do not Have')}' 
                ELSE '${translate('Have')}' END AS "hasDetailAccount", 
             CASE WHEN "subsidiaryLedgerAccounts"."hasDimension1" ='f' THEN '${translate('Do not Have')}' 
                ELSE '${translate('Have')}' END AS "hasDimension1", 
             CASE WHEN "subsidiaryLedgerAccounts"."hasDimension2" ='f' THEN '${translate('Do not Have')}' 
                ELSE '${translate('Have')}' END AS "hasDimension2", 
             CASE WHEN "subsidiaryLedgerAccounts"."hasDimension3" ='f' THEN '${translate('Do not Have')}' 
                ELSE '${translate('Have')}' END AS "hasDimension3"
            `;

        return knex.select().from(function () {
            this.select(knex.raw(subsidiaryLedgerAccountsValues))
                .from('subsidiaryLedgerAccounts')
                .where('subsidiaryLedgerAccounts.branchId', branchId)
                .innerJoin('generalLedgerAccounts', 'generalLedgerAccounts.id', 'subsidiaryLedgerAccounts.generalLedgerAccountId')
                .as('generalLedgerAccount')
        });
    };

    getDetailAccounts() {
        let knex = this.knex;
        return knex.select(knex.raw(`code, 
        title, 
        description,
        CASE WHEN code ISNULL THEN title ELSE title||' ${translate('Code')} ' ||code END AS display`))
            .from('detailAccounts')
            .where('branchId', this.branchId);
    };

}