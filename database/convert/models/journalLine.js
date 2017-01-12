"use strict";

const Base = require('./base');

class JournalLine extends Base {
    constructor(model, journalId, account) {
        if (!(journalId && account))
            new Error('journalId or account is undefined ');

        super();

        this.id = model.NC;
        this.row = model.row;
        this.journalId = journalId;
        this.debtor = model.Bed;
        this.creditor = model.Bes;
        this.article = model.Article;
        this.generalLedgerAccountId = account.generalLedgerAccountId;
        this.subsidiaryLedgerAccountId = account.subsidiaryLedgerAccountId;
        this.dimension1Id = account.dimension1Id;
        this.dimension2Id = account.dimension2Id;
        this.dimension3Id = account.dimension3Id;
    }
}

module.exports = JournalLine;