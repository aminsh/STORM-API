"use strict";

const BaseQuery = require('./query.base'),
    enums = require('../constants/enums');

module.exports = class ReportQueryAccounts extends BaseQuery {
    constructor(branchId) {
        super(branchId);
    }

    getGeneralLedgerAccounts() {
        let knex = this.knex;
        return knex.select(knex.raw(`code, 
        title, 
        description,
        CASE WHEN code ISNULL THEN title ELSE title||' کد ' ||code END AS display`))
            .from('generalLedgerAccounts');
    };

    getSubsidiaryLedgerAccounts(generalCode) {
        let knex = this.knex;

        let subsidiaryLedgerAccountsValues = `"subsidiaryLedgerAccounts".code as "subsidiaryCode",
            "subsidiaryLedgerAccounts".title as "subsidiaryTitle",
            CASE WHEN "subsidiaryLedgerAccounts".code ISNULL THEN "subsidiaryLedgerAccounts".title 
                ELSE "subsidiaryLedgerAccounts".title||' کد ' ||"subsidiaryLedgerAccounts".code END AS subsidiaryDisplay,
            "generalLedgerAccounts".code as "generalCode",
            "generalLedgerAccounts".title as "generalTitle",
             CASE WHEN "generalLedgerAccounts".code ISNULL THEN "generalLedgerAccounts".title 
                ELSE "generalLedgerAccounts".title||' کد ' ||"generalLedgerAccounts".code END AS generalDisplay,
            "subsidiaryLedgerAccounts"."detailAccountAssignmentStatus" as "detailAccount",
            "subsidiaryLedgerAccounts"."dimension1AssignmentStatus" as "dimension1",
            "subsidiaryLedgerAccounts"."dimension2AssignmentStatus" as "dimension2",
            "subsidiaryLedgerAccounts"."dimension3AssignmentStatus" as "dimension3"
            `;

        return knex.select().from(function () {
            this.select(knex.raw(subsidiaryLedgerAccountsValues))
                .from('subsidiaryLedgerAccounts')
                .innerJoin('generalLedgerAccounts', 'generalLedgerAccounts.id', 'subsidiaryLedgerAccounts.generalLedgerAccountId')
                .as('generalLedgerAccount')
                .where('subsidiaryLedgerAccounts.generalLedgerAccountId', generalCode);
        });
    };

    getDetailAccounts() {
        let knex = this.knex;
        return knex.select(knex.raw(`code, 
        title, 
        description,
        CASE WHEN code ISNULL THEN title ELSE title||' کد ' ||code END AS display`))
            .from('detailAccounts');
    };

}