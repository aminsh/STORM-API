"use strict";

const BaseQuery = require('./query.base'),
    enums = require('../constants/enums');

module.exports = class ReportQueryJournals extends BaseQuery {
    constructor(branchId) {
        super(branchId);
    }

getJournalsAccount() {
        let knex = this.knex;

        let journals = '"journals"."temporaryNumber" as "temporaryNumber",'+'"journals"."temporaryDate" as "temporaryDate",'+
        '"journals".number as "journalsNumber",'+'"journals".date as "journalsDate",'+'"journals".description as "journalsDescription"';

        let journalLines = '"journalLines".row as "journalLinesRow",'+'"journalLines".debtor as "debtor",'+ '"journalLines".creditor as "creditor",'+
        '"journalLines".article as "article"';

        let cheques = '"cheques".number as "chequesNumber"';

        let generalLedgerAccounts = '"generalLedgerAccounts".code as "generalLedgerAccountsCode",' + 
        '"generalLedgerAccounts".title as "generalLedgerAccountsTitle"';

        let subsidiaryLedgerAccounts = '"subsidiaryLedgerAccounts".code as "subsidiaryLedgerAccountsCode",' + 
        '"subsidiaryLedgerAccounts".title as "subsidiaryLedgerAccountsTitle",'+
        '"subsidiaryLedgerAccounts"."detailAccountAssignmentStatus" as "detailAccountAssignmentStatus",'+
        '"subsidiaryLedgerAccounts"."dimension1AssignmentStatus" as "dimension1AssignmentStatus",'+
        '"subsidiaryLedgerAccounts"."dimension2AssignmentStatus" as "dimension2AssignmentStatus",'+
        '"subsidiaryLedgerAccounts"."dimension3AssignmentStatus" as "dimension3AssignmentStatus"';

        let detailAccounts = '"detailAccounts".code as "detailAccountsCode",' + '"detailAccounts".title as "detailAccountsTitle"';

        return knex.select().from(function () {
            this.select(knex.raw(journals+','+journalLines+','+cheques+','+generalLedgerAccounts+','+
            subsidiaryLedgerAccounts+','+detailAccounts))
                .from('journals')
                .leftJoin('journalLines', 'journals.id', 'journalLines.journalId')
                .leftJoin('cheques','journalLines.id','cheques.journalLineId')
                .leftJoin('generalLedgerAccounts','journalLines.generalLedgerAccountId','generalLedgerAccounts.id')
                .leftJoin('subsidiaryLedgerAccounts','journalLines.subsidiaryLedgerAccountId','subsidiaryLedgerAccounts.id')
                .leftJoin('detailAccounts','journalLines.detailAccountId','detailAccounts.id')
                .as('journalsInfo');
        });
    }


}