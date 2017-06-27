"use strict";

const Guid = require('../services/shared').utility.Guid,
    async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    translate = require('../services/translateService'),
    persianDate = require('../services/persianDateService'),
    JournalRepository = require('../data/repository.journal'),
    JournalLineRepository = require('../data/repository.journalLine'),
    InvoiceRepository = require('../data/repository.invoice'),
    SubLedger = require('./subledger');

module.exports = class Journal {
    constructor(branchId, fiscalPeriodId) {
        this.fiscalPeriodId = fiscalPeriodId;

        this.journalRepository = new JournalRepository(branchId);
        this.journalLineRepositroy = new JournalLineRepository(branchId);
        this.invoiceRepository = new InvoiceRepository(branchId);
        this.subLedger = new SubLedger(branchId);
    }

    generateForSale(sale) {
        let journal = await(this.getJournal(
            sale.date,
            translate('For Cash sale invoice number ...').format(sale.number))),

            invoiceLines = sale.invoiceLines,
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

        return {journal, journalLines};
    }

    generateReceivablePayment(payments, invoiceId) {

        let invoice,
            subLedger = this.subLedger;

        if (invoiceId)
            invoice = await(this.invoiceRepository.findById(invoiceId));

        let description = invoice
                ? `دریافت بابت فاکتور شماره ${invoice.number}`
                : 'دریافت وجه',

            journal = await(this.getJournal(persianDate.current(), description)),

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

    generatePassReceivableCheque(payment, command) {
        let subLedger = this.subLedger,
            description = 'بابت وصول چک شماره {0} سررسید {1} بانک {2} شعبه {3}'
                .format(payment.number, payment.date, payment.bankName, payment.bankBranch),

            journal = await(this.getJournal(command.date || persianDate.current(), description)),
            paymentJournalLine = await(this.journalLineRepositroy.findById(payment.journalLineId)),
            journalLines = [],

            receivableDocument = await(subLedger.receivableDocument());

        journalLines.push({
            row: 2,
            generalLedgerAccountId: receivableDocument.generalLedgerAccountId,
            subsidiaryLedgerAccountId: receivableDocument.id,
            detailAccountId: paymentJournalLine.detailAccountId,
            article: description,
            debtor: 0,
            creditor: paymentJournalLine.debtor
        });

        let debtorSubLedger = await(getDebtorSubLedger());

        journalLines.push({
            row: 1,
            generalLedgerAccountId: debtorSubLedger.generalLedgerAccountId,
            subsidiaryLedgerAccountId: debtorSubLedger.id,
            detailAccountId: getDebtorDetailAccount(),
            article: description,
            debtor: paymentJournalLine.debtor,
            creditor: 0
        });

        journalLines = journalLines.asEnumerable().reverse().toArray();

        return {journalLines, journal};

        function getDebtorSubLedger() {
            if (command.paymentType == 'receipt')
                return subLedger.bankAccount();

            if (command.paymentType == 'cash')
                return subLedger.fundAccount();
        }

        function getDebtorDetailAccount() {
            if (command.paymentType == 'receipt')
                return command.bankId;

            if (command.paymentType == 'cash')
                return command.fundId;
        }
    }

    generateReturnReceivableCheque(payment, command) {
        let subLedger = this.subLedger,
            description = 'بابت عودت چک شماره {0} سررسید {1} بانک {2} شعبه {3}'
                .format(payment.number, payment.date, payment.bankName, payment.bankBranch),

            journal = await(this.getJournal(command.date || persianDate.current(), description)),
            paymentJournalLine = await(this.journalLineRepositroy.findById(payment.journalLineId)),
            journalLines = [],

            receivableAccount = await(subLedger.receivableAccount());

        journalLines.push({
            row: 1,
            generalLedgerAccountId: receivableAccount.generalLedgerAccountId,
            subsidiaryLedgerAccountId: receivableAccount.id,
            detailAccountId: paymentJournalLine.detailAccountId,
            article: description,
            debtor: paymentJournalLine.debtor,
            creditor: 0
        });

        let debtorSubLedger = await(subLedger.receivableDocument());

        journalLines.push({
            row: 2,
            generalLedgerAccountId: debtorSubLedger.generalLedgerAccountId,
            subsidiaryLedgerAccountId: debtorSubLedger.id,
            detailAccountId: paymentJournalLine.detailAccountId,
            article: description,
            debtor: 0,
            creditor: paymentJournalLine.debtor
        });

        return {journalLines, journal};
    }

    getJournal(date, description) {
        let maxNumber = await(this.journalRepository.maxTemporaryNumber(this.fiscalPeriodId)).max || 0;

        return {
            periodId: this.fiscalPeriodId,
            journalStatus: 'Temporary',
            temporaryNumber: ++maxNumber,
            temporaryDate: date,
            description: description,
            isInComplete: false
        };
    }
};