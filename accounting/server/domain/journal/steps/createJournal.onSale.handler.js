"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    translate = require('../../../services/translateService'),
    JournalRepository = require('../../../data/repository.journal'),
    JournalLineRepository = require('../../../data/repository.journalLine'),
    InvoiceRepository = require('../../../data/repository.invoice'),
    DetailAccountRepository = require('../../../data/repository.detailAccount'),
    SubLedger = require('../../subledger');

class CreateJournalOnSale{

    constructor(state, command){
        this.fiscalPeriodId = state.fiscalPeriodId;

        this.journalRepository = new JournalRepository(state.branchId);
        this.journalLineRepositroy = new JournalLineRepository(state.branchId);
        this.invoiceRepository = new InvoiceRepository(state.branchId);
        this.detailAccountRepository = new DetailAccountRepository(state.branchId);
        this.subLedger = new SubLedger(state.branchId);

        this.command = command;
    }

    run(){
        let cmd = this.command,
            journal = await(this.getJournal(
            cmd.date,
            translate('For Cash sale invoice number ...').format(cmd.number))),

            invoiceLines = cmd.invoiceLines,
            sumAmount = invoiceLines.asEnumerable().sum(line => line.unitPrice * line.quantity),
            sumDiscount = invoiceLines.asEnumerable().sum(line => line.discount),
            sumVat = invoiceLines.asEnumerable().sum(line => line.vat),

            receivableAccount = await(this.subLedger.receivableAccount()),
            saleAccount = await(this.subLedger.saleAccount()),

            journalLines = [
                {
                    generalLedgerAccountId: receivableAccount.generalLedgerAccountId,
                    subsidiaryLedgerAccountId: receivableAccount.id,
                    detailAccountId: sale.detailAccountId,
                    debtor: sumAmount - sumDiscount + sumVat,
                    creditor: 0,
                    article: journal.description,
                    row: 1
                }, {
                    generalLedgerAccountId: saleAccount.generalLedgerAccountId,
                    subsidiaryLedgerAccountId: saleAccount.id,
                    debtor: 0,
                    creditor: sumAmount,
                    article: journal.description,
                    row: 3
                }];

        if (sumDiscount > 0) {
            let discountAccount = await(this.subLedger.saleDiscountAccount());

            journalLines.push({
                generalLedgerAccountId: discountAccount.generalLedgerAccountId,
                subsidiaryLedgerAccountId: discountAccount.id,
                debtor: sumDiscount,
                creditor: 0,
                article: journal.description,
                row: 2
            });
        }


        if (sumVat > 0) {
            let vatAccount = await(this.subLedger.saleVatAccount());

            journalLines.push({
                generalLedgerAccountId: vatAccount.generalLedgerAccountId,
                subsidiaryLedgerAccountId: vatAccount.id,
                debtor: 0,
                creditor: sumVat,
                article: journal.description,
                row: 4
            });
        }

        journalLines = journalLines.asEnumerable().orderBy(e => e.row).toArray();
        journalLines.forEach((e, i) => e.row = i + 1);

        await(this.journalRepository.batchCreate(journalLines, journal));
    }

    getJournal(date, description) {
        let maxNumber = await(this.journalRepository.maxTemporaryNumber(this.fiscalPeriodId)).max || 0;

        return {
            periodId: this.fiscalPeriodId,
            journalStatus: 'Fixed',
            temporaryNumber: ++maxNumber,
            temporaryDate: date,
            description: description,
            isInComplete: false
        };
    }
}

module.exports = CreateJournalOnSale;