"use strict";

const Guid = require('../services/shared').utility.Guid,
    async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    translate = require('../services/translateService'),
    persianDate = require('../services/persianDateService'),
    JournalRepository = require('../data/repository.journal'),
    JournalLineRepository = require('../data/repository.journalLine'),
    InvoiceRepository = require('../data/repository.invoice'),
    InventoryRepository = require('../data/repository.inventory'),
    DetailAccountRepository = require('../data/repository.detailAccount'),
    SubLedger = require('./subledger'),
    JournalGenerationTemplateService = require('./journalGenerationTemplateService');

class Journal {
    constructor(branchId, fiscalPeriodId) {
        this.fiscalPeriodId = fiscalPeriodId;

        this.journalRepository = new JournalRepository(branchId);
        this.journalLineRepositroy = new JournalLineRepository(branchId);
        this.invoiceRepository = new InvoiceRepository(branchId);
        this.inventoryRepository = new InventoryRepository(branchId);
        this.detailAccountRepository = new DetailAccountRepository(branchId);
        this.subLedger = new SubLedger(branchId);
        this.journalGenerationTemplateService = new JournalGenerationTemplateService(branchId, fiscalPeriodId);
    }

    generateForSale(cmd) {

        let sale = await(this.invoiceRepository.findById(cmd.id)),

            model = {
                number: sale.number,
                date: sale.date,
                title: sale.title,
                amount: sale.invoiceLines.asEnumerable().sum(line => line.unitPrice * line.quantity),
                discount: sale.invoiceLines.asEnumerable().sum(line => line.discount),
                vat: sale.invoiceLines.asEnumerable().sum(line => line.vat),
                customer: sale.detailAccountId
            },

            journal = await(this.journalGenerationTemplateService.set(model, 'sale')),

            journalLines = journal.lines;

        delete  journal.lines;

        return {journal, journalLines};
    }

    generateOutputFromSale(outputId){

        const output = await(this.inventoryRepository.findById(outputId)),

            model = {
                number: output.number,
                date: output.date,
                amount: output.inventoryLines.asEnumerable().sum(line => line.unitPrice * line.quantity)
            },

            journal = await(this.journalGenerationTemplateService.set(model, 'inventoryOutputSale'));

        const journalLines = journal.lines;

        delete journal.lines;

        return {journal, journalLines};

    }

    generateReceivablePayment(payments, invoiceId) {

        let invoice,
            subLedger = this.subLedger;

        if (invoiceId)
            invoice = await(this.invoiceRepository.findById(invoiceId));

        let description = invoice
            ? `دریافت بابت فاکتور فروش شماره ${invoice.number}`
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

            if (p.paymentType === 'person')
                return 'دریافت توسط شخص بابت فاکتور شماره {0}'.format(invoice.number);
        }

        function getSubLedgerForDebtor(p) {
            if (p.paymentType == 'cash')
                return subLedger.fundAccount();

            if (p.paymentType == 'receipt')
                return subLedger.bankAccount();

            if (p.paymentType == 'cheque')
                return subLedger.receivableDocument();

            if(p.paymentType === 'person')
                return subLedger.receivableAccount();
        }

        function getDetailAccountForDebtor(p) {
            if (p.paymentType == 'cash')
                return p.fundId;

            if (p.paymentType == 'receipt')
                return p.bankId;

            if (p.paymentType == 'cheque')
                return invoice.detailAccountId;

            if(p.paymentType === 'person')
                return p.personId;
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

    generateForPurchase(purchase) {
        let journal = await(this.getJournal(
            purchase.date,
            translate('For Cash purchase invoice number ...').format(purchase.number))),

            invoiceLines = purchase.invoiceLines,
            sumAmount = invoiceLines.asEnumerable().sum(line => line.unitPrice * line.quantity),
            sumDiscount = invoiceLines.asEnumerable().sum(line => line.discount),
            sumVat = invoiceLines.asEnumerable().sum(line => line.vat),

            payableAccount = await(this.subLedger.payableAccount()),
            purchaseAccount = await(this.subLedger.purchaseAccount()),

            journalLines = [
                {
                    generalLedgerAccountId: payableAccount.generalLedgerAccountId,
                    subsidiaryLedgerAccountId: payableAccount.id,
                    detailAccountId: purchase.detailAccountId,
                    debtor: 0,
                    creditor: sumAmount - sumDiscount + sumVat,
                    article: journal.description,
                    row: 3
                }, {
                    generalLedgerAccountId: purchaseAccount.generalLedgerAccountId,
                    subsidiaryLedgerAccountId: purchaseAccount.id,
                    debtor: sumAmount,
                    creditor: 0,
                    article: journal.description,
                    row: 1
                }];

        if (sumDiscount > 0) {
            let discountAccount = await(this.subLedger.purchaseDiscountAccount());

            journalLines.push({
                generalLedgerAccountId: discountAccount.generalLedgerAccountId,
                subsidiaryLedgerAccountId: discountAccount.id,
                debtor: 0,
                creditor: sumDiscount,
                article: journal.description,
                row: 4
            });
        }


        if (sumVat > 0) {
            let vatAccount = await(this.subLedger.purchaseVatAccount());

            journalLines.push({
                generalLedgerAccountId: vatAccount.generalLedgerAccountId,
                subsidiaryLedgerAccountId: vatAccount.id,
                debtor: sumVat,
                creditor: 0,
                article: journal.description,
                row: 2
            });
        }

        journalLines = journalLines.asEnumerable().orderBy(e => e.row).toArray();
        journalLines.forEach((e, i) => e.row = i + 1);

        return {journal, journalLines};
    }

    generatePayablePayment(payments, invoiceId) {

        let invoice,
            subLedger = this.subLedger;

        if (invoiceId)
            invoice = await(this.invoiceRepository.findById(invoiceId));

        let description = invoice
            ? `دریافت بابت فاکتور خرید شماره ${invoice.number}`
            : 'دریافت وجه',

            journal = await(this.getJournal(persianDate.current(), description)),

            payableAccount = await(this.subLedger.payableAccount()),
            journalLines = [];

        payments.forEach(p => {
            let bankDetailAccount;

            if (p.paymentType == 'cheque')
                bankDetailAccount = await(this.detailAccountRepository.findById(p.bankId));

            let article = getArticle(p, bankDetailAccount);


            /* معین حسابهای پرداختنی بدهکار میشود */
            journalLines.push({
                generalLedgerAccountId: payableAccount.generalLedgerAccountId,
                subsidiaryLedgerAccountId: payableAccount.id,
                detailAccountId: invoice.detailAccountId,
                article,
                debtor: p.amount,
                creditor: 0
            });

            let debtorSubLedger = await(getSubLedgerForCreditor(p)),
                id = Guid.new();

            journalLines.push({
                id,
                generalLedgerAccountId: debtorSubLedger.generalLedgerAccountId,
                subsidiaryLedgerAccountId: debtorSubLedger.id,
                detailAccountId: getDetailAccountForCreditor(p),
                article,
                debtor: 0,
                creditor: p.amount
            });

            p.journalLineId = id;
        });

        return {journalLines, journal, payments};

        function getArticle(p, bankDetailAccount) {
            if (p.paymentType == 'cash')
                return 'پرداخت نقدی بابت فاکتور شماره {0}'.format(invoice.number);

            if (p.paymentType == 'receipt')
                return 'پرداخت طی فیش / رسید {0} بابت فاکتور شماره {1}'
                    .format(p.number, invoice.number);

            if (p.paymentType == 'cheque')
                return 'پرداخت چک به شماره {0} سررسید {1} حساب {2} - {3} بابت فاکتور شماره {4}'
                    .format(
                        p.number,
                        p.date,
                        bankDetailAccount.title,
                        bankDetailAccount.bankAccountNumber,
                        invoice.number);
        }

        function getSubLedgerForCreditor(p) {
            if (p.paymentType == 'cash')
                return subLedger.fundAccount();

            if (p.paymentType == 'receipt')
                return subLedger.bankAccount();

            if (p.paymentType == 'cheque')
                return subLedger.payableDocument();
        }

        function getDetailAccountForCreditor(p) {
            if (p.paymentType == 'cash')
                return p.fundId;

            if (p.paymentType == 'receipt')
                return p.bankId;

            if (p.paymentType == 'cheque')
                return p.bankId;
        }
    }

    generatePassPayableCheque(payment, command) {
        let subLedger = this.subLedger,

            paymentJournalLine = await(this.journalLineRepositroy.findById(payment.journalLineId)),
            bankDetailAccount = await(this.detailAccountRepository.findById(paymentJournalLine.detailAccountId)),

            description = 'بابت وصول چک شماره {0} سررسید {1} حساب {2} - {3}'
                .format(
                    payment.number,
                    payment.date,
                    bankDetailAccount.title,
                    bankDetailAccount.bankAccountNumber),

            journal = await(this.getJournal(command.date || persianDate.current(), description)),
            journalLines = [],

            payableDocument = await(subLedger.payableDocument());

        journalLines.push({
            row: 1,
            generalLedgerAccountId: payableDocument.generalLedgerAccountId,
            subsidiaryLedgerAccountId: payableDocument.id,
            detailAccountId: paymentJournalLine.detailAccountId,
            article: description,
            debtor: paymentJournalLine.creditor,
            creditor: 0
        });

        let bankAccount = await(subLedger.bankAccount());

        journalLines.push({
            row: 2,
            generalLedgerAccountId: bankAccount.generalLedgerAccountId,
            subsidiaryLedgerAccountId: bankAccount.id,
            detailAccountId: paymentJournalLine.detailAccountId,
            article: description,
            debtor: 0,
            creditor: paymentJournalLine.creditor
        });

        return {journalLines, journal};
    }

    generateReturnPayableCheque(payment, command) {
        let subLedger = this.subLedger,

            paymentJournalLine = await(this.journalLineRepositroy.findById(payment.journalLineId)),
            allPaymentJournalLines = await(this.journalRepository.findByJournalLinesById(paymentJournalLine.journalId)),
            bankDetailAccount = await(this.detailAccountRepository.findById(paymentJournalLine.detailAccountId)),

            description = 'بابت عودت چک شماره {0} سررسید {1} حساب {2} - {3}'
                .format(
                    payment.number,
                    payment.date,
                    bankDetailAccount.title,
                    bankDetailAccount.bankAccountNumber),

            journal = await(this.getJournal(command.date || persianDate.current(), description)),
            journalLines = [],

            payableAccount = await(subLedger.payableAccount()),
            payableAccountDetailAccountId = allPaymentJournalLines.asEnumerable()
                .first(line =>
                    line.subsidiaryLedgerAccountId == payableAccount.id &&
                    line.debtor == paymentJournalLine.creditor).detailAccountId;

        journalLines.push({
            row: 1,
            generalLedgerAccountId: payableAccount.generalLedgerAccountId,
            subsidiaryLedgerAccountId: payableAccount.id,
            detailAccountId: payableAccountDetailAccountId,
            article: description,
            debtor: 0,
            creditor: paymentJournalLine.creditor
        });

        let payableDocument = await(subLedger.payableDocument());

        journalLines.push({
            row: 2,
            generalLedgerAccountId: payableDocument.generalLedgerAccountId,
            subsidiaryLedgerAccountId: payableDocument.id,
            detailAccountId: paymentJournalLine.detailAccountId,
            article: description,
            debtor: paymentJournalLine.creditor,
            creditor: 0
        });

        return {journalLines, journal};
    }

    generateIncome(payments, command) {
        let subLedger = this.subLedger,

            description = command.description || 'بابت درآمد',

            journal = await(this.getJournal(command.date, description)),
            journalLines = [],

            incomeAccount = await(subLedger.getById(command.incomeSubLedgerId));

        journalLines.push({
            generalLedgerAccountId: incomeAccount.generalLedgerAccountId,
            subsidiaryLedgerAccountId: incomeAccount.id,
            detailAccountId: command.personId || null,
            article: description,
            debtor: 0,
            creditor: payments.asEnumerable().sum(e => e.amount)
        });

        payments.forEach(p => {
            let article = description,
                id = Guid.new(),

                debtorSubLedger = await(getSubLedgerForDebtor(p));

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
                return command.personId || null;
        }
    }

    generateExpense(payments, command) {
        let subLedger = this.subLedger,

            description = command.description || 'بابت هزینه',

            journal = await(this.getJournal(command.date, description)),
            journalLines = [],

            expenseAccount = await(subLedger.getById(command.expenseSubLedgerId));

        journalLines.push({
            generalLedgerAccountId: expenseAccount.generalLedgerAccountId,
            subsidiaryLedgerAccountId: expenseAccount.id,
            detailAccountId: command.personId || null,
            article: description,
            debtor: payments.asEnumerable().sum(e => e.amount),
            creditor: 0
        });

        payments.forEach(p => {
            let article = description,
                id = Guid.new(),

                debtorSubLedger = await(getSubLedgerForDebtor(p));

            journalLines.push({
                id,
                generalLedgerAccountId: debtorSubLedger.generalLedgerAccountId,
                subsidiaryLedgerAccountId: debtorSubLedger.id,
                detailAccountId: getDetailAccountForDebtor(p),
                article,
                debtor: 0,
                creditor: p.amount
            });

            p.journalLineId = id;
        });

        return {journalLines, journal, payments};

        function getSubLedgerForDebtor(p) {
            if (p.paymentType == 'cash')
                return subLedger.fundAccount();

            if (p.paymentType == 'receipt')
                return subLedger.bankAccount();

            if (p.paymentType == 'cheque')
                return subLedger.payableDocument();
        }

        function getDetailAccountForDebtor(p) {
            if (p.paymentType == 'cash')
                return p.fundId;

            if (p.paymentType == 'receipt')
                return p.bankId;

            if (p.paymentType == 'cheque')
                return p.bankId
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

};

module.exports = Journal;