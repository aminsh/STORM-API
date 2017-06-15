"use strict";

const Guid = require('../services/shared').utility.Guid,
    async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    translate = require('../services/translateService'),
    PaymentRepository = require('../data/repository.payment'),
    JournalRepository = require('../data/repository.journal'),
    InvoiceRepository = require('../data/repository.invoice'),
    SubsidiaryLedgerAccountRepository = require('../data/repository.subsidiaryLedgerAccount');

module.exports = class Payment {
    constructor(branchId, fiscalPeriodId) {
        this.branchId = branchId;
        this.fiscalPeriodId = fiscalPeriodId;
        this.save = async(this.save);

        this.journalRepository = new JournalRepository(branchId);
        this.invoiceRepository = new InvoiceRepository(branchId);
        this.paymentRepository = new PaymentRepository(branchId);
        this.subsidiaryLedgerAccountRepository = new SubsidiaryLedgerAccountRepository(branchId);
    }


    save(invoiceId, list) {
        let invoice = await(this.invoiceRepository.findById(invoiceId));
        list.forEach(e => e.journalLineId = Guid.new());

        this.payments = list.asEnumerable().select(e => ({
            number: e.number,
            date: e.date,
            invoiceId,
            amount: e.amount,
            paymentType: e.paymentType,
            bankName: e.bankName,
            bankBranch: e.bankBranch,
            journalLineId: e.journalLineId
        }));

        this.journal = {
            number: (await(this.journalRepository.maxTemporaryNumber(this.fiscalPeriodId)).max || 0) + 1,
            date: invoice.date,
            description: invoice.invoiceType == 'sale'
                ? this.getReceiveJournalDescription(invoice)
                : this.getPayJournalDescription(invoice)
        };

        this.journalLines = [];

        let journalLineGenerator = invoice.invoiceType == 'sale'
            ? async(this.receivableJournalLine)
            : async(this.payableJournalLine);

        list.forEach(e => journalLineGenerator(e, invoice));

        await(this.journalRepository.create(this.journal, this.journalLines));
        await(this.paymentRepository.create(this.payments));
    }

    receivableJournalLine(e, invoice) {
        let debtorSubsidiaryLedgerAccount = await(this.getDebtorSubsidiaryLedgerAccount(e.paymentType)),

            // حسابهای دریافتنی
            creditorSubsidiaryLedgerAccount = await(this.subsidiaryLedgerAccountRepository.findByCode('1104')),
            detailAccountId = this.getDebtorDetailAccount(invoice, e),
            article = this.getReceiveJournalLineArticle(invoice, e);

        this.journalLines.push({
            id: e.journalLineId,
            generalLedgerAccountId: debtorSubsidiaryLedgerAccount.generalLedgerAccountId,
            subsidiaryLedgerAccountId: debtorSubsidiaryLedgerAccount.id,
            detailAccountId: detailAccountId,
            article,
            debtor: e.amount,
            creditor: 0
        });

        this.journalLines.push({
            generalLedgerAccountId: creditorSubsidiaryLedgerAccount.generalLedgerAccountId,
            subsidiaryLedgerAccountId: creditorSubsidiaryLedgerAccount.id,
            detailAccountId: invoice.detailAccountId,
            article,
            debtor: 0,
            creditor: e.amount
        });
    }

    payableJournalLine(e, invoice) {
        let
            // حسابهای پرداختنی
            debtorSubsidiaryLedgerAccount = await(this.subsidiaryLedgerAccountRepository.findByCode('2101')),
            creditorSubsidiaryLedgerAccount = await(this.getCreditorSubsidiaryLedgerAccount(e.paymentType)),
            detailAccountId = this.getCreditorDetailAccount(invoice, e),
            article = this.getPayJournalLineArticle(invoice, e);

        this.journalLines.push({
            id: e.journalLineId,
            generalLedgerAccountId: debtorSubsidiaryLedgerAccount.generalLedgerAccountId,
            subsidiaryLedgerAccountId: debtorSubsidiaryLedgerAccount.id,
            detailAccountId: detailAccountId,
            article,
            debtor: e.amount,
            creditor: 0
        });

        this.journalLines.push({
            generalLedgerAccountId: creditorSubsidiaryLedgerAccount.generalLedgerAccountId,
            subsidiaryLedgerAccountId: creditorSubsidiaryLedgerAccount.id,
            detailAccountId: invoice.detailAccountId,
            article,
            debtor: 0,
            creditor: e.amount
        });
    }

    getDebtorSubsidiaryLedgerAccount(paymentType) {
        let subLedgerCodes = {cheque: '1105', receipt: '1103', cash: '1101'},
            code = subLedgerCodes[paymentType],
            subsidiaryLedgerAccount = await(this.subsidiaryLedgerAccountRepository.findByCode(code));

        return subsidiaryLedgerAccount;
    }

    getCreditorSubsidiaryLedgerAccount(paymentType) {
        let subLedgerCodes = {cheque: '2102', receipt: '1103', cash: '1101'},
            code = subLedgerCodes[paymentType],
            subsidiaryLedgerAccount = await(this.subsidiaryLedgerAccountRepository.findByCode(code));

        return subsidiaryLedgerAccount;
    }

    getDebtorDetailAccount(invoice, payment) {
        if (payment.paymentType == 'receipt')
            return payment.bankId;
        if (payment.paymentType == 'cach')
            return payment.fundId;
        if (payment.paymentType == 'cheque')
            return invoice.detailAccountId;
    }

    getCreditorDetailAccount(invoice, payment) {
        if (payment.paymentType == 'receipt')
            return payment.bankId;
        if (payment.paymentType == 'cach')
            return payment.fundId;
        if (payment.paymentType == 'cheque')
            return payment.bankId;
    }

    getReceiveJournalDescription(invoice) {
        return translate('For Cash sale invoice number ...').format(invoice.number);
    }

    getReceiveJournalLineArticle(invoice, payment) {
        if (payment.paymentType == 'cash')
            return translate('received cash for invoice number ... ').format(invoice.number);
        if (payment.paymentType == 'receipt')
            return translate('received receipt number ... for invoice number ... ').format(payment.number, invoice.number);
        if (payment.paymentType == 'cheque')
            return translate('received cheque number ... date ... bank ... branch ... for invoice number ... ')
                .format(payment.number, payment.date, payment.bankName, payment.bankBranch, invoice.number);
    }

    getPayJournalDescription(invoice) {
        return translate('For Cash purchase invoice number ...').format(invoice.number);
    }

    getPayJournalLineArticle(invoice, payment) {
        if (payment.paymentType == 'cash')
            return translate('paid cash for invoice number ... ').format(invoice.number);
        if (payment.paymentType == 'receipt')
            return translate('paid receipt number ... for invoice number ... ').format(payment.number, invoice.number);
        if (payment.paymentType == 'cheque')
            return translate('paid cheque number ... date ... bank ... branch ... for invoice number ... ')
                .format(payment.number, payment.date, payment.bankName, payment.bankBranch, invoice.number);
    }
};