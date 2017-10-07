"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    Guid = instanceOf('utility').Guid,
    PersianDate = instanceOf('utility').PersianDate,
    JournalRepository = require('../../../data/repository.journal'),
    JournalLineRepository = require('../../../data/repository.journalLine'),
    InvoiceRepository = require('../../../data/repository.invoice'),
    DetailAccountRepository = require('../../../data/repository.detailAccount'),
    SubLedger = require('../../subledger');

class CreateJournalOnSale {

    constructor(state, command) {
        
        this.fiscalPeriodId = state.fiscalPeriodId;

        this.journalRepository = new JournalRepository(state.branchId);
        this.journalLineRepositroy = new JournalLineRepository(state.branchId);
        this.invoiceRepository = new InvoiceRepository(state.branchId);
        this.detailAccountRepository = new DetailAccountRepository(state.branchId);
        this.subLedger = new SubLedger(state.branchId);

        this.command = command;
    }

    run() {
        let invoiceId = this.command.invoiceId,
            payments = this.command.payments;

        let invoice,
            subLedger = this.subLedger;

        if (invoiceId)
            invoice = await(this.invoiceRepository.findById(invoiceId));

        let description = invoice
            ? `دریافت بابت فاکتور فروش شماره ${invoice.number}`
            : 'دریافت وجه',

            journal = await(this.getJournal(PersianDate.current(), description)),

            receivableAccount = await(this.subLedger.receivableAccount()),
            journalLines = [];

        payments.forEach(p => {
            let article = getArticle(p);

            /* معین حسابهای دریافتنی بستانکار میشود */
            journalLines.push({
                generalLedgerAccountId: receivableAccount.generalLedgerAccountId,
                subsidiaryLedgerAccountId: receivableAccount.id,
                detailAccountId: invoice.detailAccountId,
                article,
                debtor: 0,
                creditor: p.amount
            });

            let debtorSubLedger = await(getSubLedgerForDebtor(p)),
                id = Guid.new();

            journalLines.push({
                id,
                generalLedgerAccountId: debtorSubLedger.generalLedgerAccountId,
                subsidiaryLedgerAccountId: debtorSubLedger.id,
                detailAccountId: getDetailAccountForDebtor(p),
                article,
                debtor: p.amount,
                creditor: 0
            });

            p.journalLineId = id;
        });

        return {journalLines, journal, payments};

        function getArticle(p) {
            if (p.paymentType == 'cash')
                return 'دریافت نقدی بابت فاکتور شماره {0}'.format(invoice.number);

            if (p.paymentType == 'receipt')
                return 'دریافت طی فیش / رسید {0} بابت فاکتور شماره {1}'
                    .format(p.number, invoice.number);

            if (p.paymentType == 'cheque')
                return 'دریافت چک به شماره {0} سررسید {1} بانک {2} شعبه {3} بابت فاکتور شماره {4}'
                    .format(p.number, p.date, p.bankName, p.bankBranch, invoice.number);
        }

        function getSubLedgerForDebtor(p) {
            if (p.paymentType == 'cash')
                return subLedger.fundAccount();

            if (p.paymentType == 'receipt')
                return subLedger.bankAccount();

            if (p.paymentType == 'cheque')
                return subLedger.receivableDocument();
        }

        function getDetailAccountForDebtor(p) {
            if (p.paymentType == 'cash')
                return p.fundId;

            if (p.paymentType == 'receipt')
                return p.bankId;

            if (p.paymentType == 'cheque')
                return invoice.detailAccountId;
        }

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