"use strict";

const BaseQuery = require('./query.base'),
    enums = require('../constants/enums');

module.exports = class ReportQueryAccounts extends BaseQuery {
    constructor(branchId) {
        super(branchId);
    }

    getGeneralLedgerAccounts() {
        return this.knex.select('code', 'title', 'description')
            .from('generalLedgerAccounts');
    }

    getSubsidiaryLedgerAccounts() {
        let knex = this.knex;
        let selectValue = '"subsidiaryLedgerAccounts".code as "subsidiaryCode",'+'"generalLedgerAccounts".code as "generalCode",'+
        '"subsidiaryLedgerAccounts".title as "subsidiaryTitle",'+'"generalLedgerAccounts".title as "generalTitle",'+
        '"subsidiaryLedgerAccounts"."detailAccountAssignmentStatus" as "detailAcc",'+'"subsidiaryLedgerAccounts"."dimension1AssignmentStatus" as "dim1",'+
        '"subsidiaryLedgerAccounts"."dimension2AssignmentStatus" as "dim2",'+'"subsidiaryLedgerAccounts"."dimension3AssignmentStatus" as "dim3"';
        return knex.select().from(function () {
            this.select(knex.raw(selectValue))
                .from('subsidiaryLedgerAccounts')
                .innerJoin('generalLedgerAccounts', 'generalLedgerAccounts.id', 'subsidiaryLedgerAccounts.generalLedgerAccountId')
                .as('glAcc');
        });
    }

    getdetailAccounts(){
        return this.knex.select('code', 'title')
        .from('detailAccounts')
    }

}